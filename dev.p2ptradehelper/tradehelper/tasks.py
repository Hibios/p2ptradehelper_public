import json
import pprint

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import BadHeaderError, send_mail
from django.http import HttpResponse
from django.template.loader import render_to_string
from concurrent.futures import wait
from datetime import datetime, timedelta
from itertools import permutations, chain

import concurrent.futures

from django.core.cache import cache
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from p2phelper.celery import app
import logging
from .modules import Exchange, Binance, Huobi, ByBit, OKX, BESTCHANGE, Chain, intra_exchange
from .models import Order, get_base_subscription
from django.contrib.auth.models import User
from .functions import buy_subscription, send_request, get_token
from celery.signals import worker_ready, worker_shutting_down

logger = logging.getLogger(__name__)

@worker_ready.connect
def at_start(sender, **kwargs):
    with sender.app.connection() as conn:
        if sender.controller.hostname == "celery@exchange_worker":
            app.control.purge()
            cache.set('worker_ready', 1, timeout=None)
            sender.app.send_task('tradehelper.tasks.upload_data_from_exchanges', connection=conn)


@worker_shutting_down.connect
def at_shutting_down(sender, **kwargs):
    if sender == "celery@exchange_worker":
        app.control.purge()
        cache.set('worker_ready', 0, timeout=None)


@app.task(ignore_result=True)
def charge_subscription(usr_id):
    # Проверяем что пользователь ещё подписан
    usr = User.objects.filter(id=usr_id).last()
    if usr:
        if not usr.profile.subscription.canceled and usr.profile.subscription.rebill_id:
            payment_id = buy_subscription(usr, 'update')
            if payment_id:
                charge_params = {"TerminalKey": settings.TERMINAL_KEY,
                                 "PaymentId": str(payment_id),
                                 "RebillId": str(usr.profile.subscription.rebill_id),
                                 }
                logger.info(f"Charge dict final: {charge_params.update({'Token': get_token(charge_params)})}")
                charge_request = send_request('Charge',
                                              charge_params,
                                              {"Content-Type": "application/json", }, )
                try:
                    logger.info(f"Charge response: {charge_request.text}")
                except Exception as e:
                    pass
                order_data = json.loads(charge_request.text)
                user_order = Order.objects.get(id=int(order_data["OrderId"]))
                user_order.status = order_data["Status"]
                user_order.save()
                user = user_order.user
                if order_data["Success"] and order_data["Status"] == "CONFIRMED":
                    user.profile.subscription.update()
                    user.save()
                    send_mail_task.apply_async(args=["Ваша подписка продлена на месяц",
                                                     "tradehelper/update_subscription.txt",
                                                     user.email,
                                                     {
                                                         'user': user.username,
                                                     }], queue="mail_queue")
                else:
                    send_mail_task.apply_async(args=["Не удалось пополнить баланс и продлить подписку",
                                                     "tradehelper/fail_subscription.txt",
                                                     user.email,
                                                     {
                                                         'user': user.username,
                                                     }], queue="mail_queue")
                    user.profile.subscription = None
                    user.save()
            else:
                logger.info(f"Payment id не получен! init запрос провалился!")
    else:
        logger.info(f"Пользователь уже отменил подписку!")


@app.task(ignore_result=True)
def send_mail_task(subject, template, user_email, args_dict, ):
    email = render_to_string(template, args_dict)
    try:
        send_mail(subject, email, settings.EMAIL_HOST_USER, [user_email], fail_silently=False)
    except BadHeaderError:
        return HttpResponse('Invalid header found.')


@app.task(bind=True, ignore_result=True, autoretry_for=(Exception,), retry_kwargs={'countdown': 5})
def upload_data_from_exchanges(self):
    start_time = datetime.now() + timedelta(seconds=60)

    # Для таймера на сайте, запоминаем, во сколько должно запустится следующее обновление связок
    cache.set('updatetime', datetime.timestamp(start_time) * 1000, timeout=None)

    binance_table = Exchange('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
                             {"Tinkoff": "Купить тинькофф",
                              "QIWI": "Купить Qiwi",
                              "YandexMoneyNew": "Купить Юмани",
                              "RaiffeisenBankRussia": "Купить Райффайзен",
                              "RosBank": "Купить Росбанк",
                              "PostBankRussia": "Купить Почтабанк",
                              "HomeCreditBank": "Купить Хоум Кредит",
                              "MTSBank": "Купить МТС-Банк",
                              "AkBarsBank": "Купить Ак Барс", },
                             ["USDT", "BUSD", "ETH", "BTC", "BNB", "RUB", ],
                             Binance)

    huobi_table = Exchange('https://otc-api.bitderiv.com/v1/data/trade-market',
                           {28: "Купить тинькофф",
                            9: "Купить Qiwi",
                            19: "Купить Юмани",
                            36: "Купить Райффайзен",
                            358: "Купить Росбанк",
                            29: "Купить Сбербанк",
                            27: "Купить ВТБ",
                            25: "Купить Альфа банк",
                            351: "Купить Газпромбанк", },
                           {"USDT": 2, "ETH": 3, "BTC": 1},
                           Huobi)

    bybit_table = Exchange('https://api2.bybit.com/spot/api/otc/item/list',
                           {75: "Купить тинькофф",
                            62: "Купить Qiwi",
                            88: "Купить Юмани",
                            64: "Купить Райффайзен",
                            185: "Купить Росбанк",
                            1: "Купить А-Банк",
                            44: "МТС-Банк", },
                           ["USDT", "ETH", "BTC"],
                           ByBit)

    okx_table = Exchange('https://www.okx.com/v3/c2c/tradingOrders/books',
                         {"Tinkoff": "Купить тинькофф",
                          "QiWi": "Купить Qiwi",
                          "Yandex.Money": "Купить Юмани",
                          "Raiffaizen": "Купить Райффайзен",
                          "Rosbank": "Купить Росбанк", },
                         ["USDT", "ETH", "BTC"],
                         OKX)

    # TODO Стандартизировать названия банков для возможности фильтрации через интерфейс
    bestchange = Exchange('',
                          {},
                          {"USDT": [208, 36, 10, ],
                           "ETH": [139, 212, ],
                           "BTC": [93, 43, ],
                           "BUSD": [206, ],
                           "BNB": [19, ]},
                          BESTCHANGE)

    exchanges = [['Binance'], ['Huobi'], ['ByBit'], ['OKX'], ['BESTCHANGE']]

    print("Обновляем BESTCHANGE и binance...")
    with concurrent.futures.ThreadPoolExecutor() as executor:
        bestchange_future = executor.submit(bestchange.update)
        binance_future = executor.submit(binance_table.update)

        print("Обновляем хуоби...")
        h_chains = huobi_table.update()
        huobi_inner = intra_exchange(list(chain.from_iterable(h_chains)))
        exchanges[1] += zip(*h_chains)

        print("Обновляем байбит...")
        by_chains = bybit_table.update()
        bybit_inner = intra_exchange(list(chain.from_iterable(by_chains)))
        exchanges[2] += zip(*by_chains)

        print("Обновляем OKX...")
        e_chains = okx_table.update()
        okx_inner = intra_exchange(list(chain.from_iterable(e_chains)))
        exchanges[3] += zip(*e_chains)

    print("Забираем результат BESTCHANGE и binance...")
    b_chains = binance_future.result()
    binance_inner = intra_exchange(list(chain.from_iterable(b_chains)))
    exchanges[0] += zip(*b_chains)

    bst_chains = bestchange_future.result()
    bst_inner = intra_exchange(list(chain.from_iterable(bst_chains)))
    exchanges[4] += zip(*bst_chains)

    chain_fabric = list(permutations(exchanges, 2))

    res = []
    for exch in chain_fabric:  # Каждая пара бирж
        for buy_order in exch[0][1]:  # each buy order from all first exchange buy orders
            for sell_order in exch[1][2]:  # each sell order from all second exchange sell orders
                res.append((buy_order, sell_order))

    interexchange_chains = [c for c in res if
                            str(c[0]).split(' ')[1] == str(c[1]).split(' ')[1] and
                            'RUB' not in f'{c[0]}{c[1]}']

    all_chains = []
    all_chains += interexchange_chains
    all_chains += binance_inner
    all_chains += huobi_inner
    all_chains += bybit_inner
    all_chains += okx_inner
    all_chains += bst_inner

    print("Очищаем кеш - только цепочки прошлые")
    cache.delete("chains")

    print("Кешируем количество")

    cache.set('betwc', len(interexchange_chains), timeout=None)
    cache.set('binance', len(binance_inner), timeout=None)
    cache.set('huobi', len(huobi_inner), timeout=None)
    cache.set('bybit', len(bybit_inner), timeout=None)
    cache.set('okx', len(okx_inner), timeout=None)
    cache.set('bestchange', len(bst_inner), timeout=None)

    chains_for_sort = [Chain(i, c[0], c[1]) for i, c in enumerate(all_chains)]
    print("Кешируем связки")

    chains_pack = {str(i): c.cache_key() for i, c in enumerate(chains_for_sort) if c.profit_percentage > 0}
    cache.set('allc', len(chains_pack), timeout=None)
    d = json.dumps(chains_pack)
    cache.set('chains', d, timeout=None)

    planned_time_diff = (start_time - datetime.now()).total_seconds()

    if cache.get('worker_ready'):
        print("Worker ready!")
        print(f"Planned timne diff: {planned_time_diff}")
        if planned_time_diff > 0:
            cache.set('active_task', upload_data_from_exchanges.apply_async(countdown=planned_time_diff))
        else:
            cache.set('active_task', upload_data_from_exchanges.delay())
