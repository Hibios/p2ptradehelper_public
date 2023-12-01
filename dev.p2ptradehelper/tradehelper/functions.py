import json

from collections import OrderedDict
from hashlib import sha256
import requests
import logging
from django.shortcuts import redirect
from django.conf import settings

from .models import Order

logger = logging.getLogger(__name__)

def send_request(method, data, headers):
    return requests.post(f'https://securepay.tinkoff.ru/v2/{method}', json=data, headers=headers)


def get_token(request):
    params = {k: v for k, v in request.items() if k not in ['Shops', 'DATA', 'Receipt']}

    params['Password'] = settings.TERMINAL_PASS

    sorted_params = OrderedDict(
        sorted((k, v) for k, v in params.items() if k not in ['Shops', 'DATA', 'Receipt']),
    )

    logger.info(f'Params for token: {sorted_params}')

    return sha256(''.join(str(value) for value in sorted_params.values()).encode()).hexdigest()


def buy_subscription(usr, interaction_type='buy'):
    last_order = Order.objects.filter(user_id=usr.id).last()
    # Если пользователь уже пытался купить подписку, не создаём лишних заказов
    if last_order and last_order.status == "NEW":
        return redirect(last_order.payment_url)

    new_order = Order(user=usr)
    new_order.save()

    init_params = {"TerminalKey": settings.TERMINAL_KEY,
                   "Amount": 99000,
                   "OrderId": new_order.id,
                   "Description": "Базовая подписка",
                   "PayType": "O",
                   "NotificationURL": "https://p2ptradehelper.ru/api/payment_notification/",
                   "SuccessURL": "https://p2ptradehelper.ru/payment_complete",
                   "FailURL": "https://p2ptradehelper.ru/payment_fail",
                   }
    if interaction_type == 'buy':
        init_params.update({"CustomerKey": usr.id, "Recurrent": "Y", })

    buy_request = send_request('Init',
                               init_params,
                               {"Content-Type": "application/json", }, )

    if buy_request.status_code == 200:
        order_data = json.loads(buy_request.text)
        logger.info("Order data:", order_data)
        new_order.status = order_data["Status"]
        new_order.payment_id = order_data["PaymentId"]
        new_order.amount = order_data["Amount"] / 100
        new_order.payment_url = order_data["PaymentURL"]
        new_order.save()
        if interaction_type == 'buy':
            return redirect(new_order.payment_url)
        else:
            return order_data["PaymentId"]
    else:
        raise Exception(
            f'Incorrect HTTP-status code for Init: {buy_request.status_code}',
        )