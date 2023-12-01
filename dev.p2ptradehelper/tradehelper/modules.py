import time
from datetime import datetime
from functools import wraps

import aiohttp
import asyncio
import copy
from itertools import permutations
from django.core.cache import cache
from django.conf import settings

from bestchange_api import BestChange
import json
import requests

from concurrent.futures import ThreadPoolExecutor
from ratelimit import limits, RateLimitException, sleep_and_retry
from ratelimiter import RateLimiter


async def fetch(req_type, format_type, url, chain, session, headers, proxy=None):
    """

    :param proxies: Прокси на случай блокировки сервиса в России
    :param req_type: Тип запроса (GET, POST)
    :param format_type: Формат передачи агрументов в запросе
    :param url: URL для отправки запроса
    :param chain: Структура для записи ответов с каждой биржи
    :param session: Объект для работы с запросами
    :param headers: Заголовки при необходимости
    :return:
    """

    # Ниже совершаем запрос и ожидаем ответ
    if req_type == "get":
        if format_type == 'json':
            async with session.get(url, json=chain.get(), headers=headers, proxy=proxy) as response:
                return await response.read()
        async with session.get(f'{url}?{chain.get()}', headers=headers, proxy=proxy) as response:
            return await response.read()
    if format_type == 'json':
        async with session.post(url, json=chain.get(), headers=headers, proxy=proxy) as response:
            return await response.read()
    async with session.post(f'{url}?{chain.get()}', headers=headers, proxy=proxy) as response:
        return await response.read()


async def get_data(req_type, format_type, url, chains, headers=None, proxy=None):
    """

    :param req_type: Тип запроса (GET, POST)
    :param format_type: Формат передачи агрументов в запросе
    :param url: URL для отправки запроса
    :param chains: Список структур для записи ответов с каждой биржи
    :param headers: Заголовки при необходимости
    :return:
    """
    # Список для ...
    tasks = []
    # Объект сессии требует асинхронной работы и гарантированного закрытия
    if 'binance' in url:
        connector = aiohttp.TCPConnector(limit=3)
    elif 'bitderiv' in url:  # Huobi
        connector = aiohttp.TCPConnector(limit=5)
    else:
        connector = aiohttp.TCPConnector(limit=20)
    async with aiohttp.ClientSession(connector=connector) as session:
        for chain in chains:  # Для каждой структуры
            # В цикле мы описываем задачу для каждой структуры, в данном случае от
            # каждой структуры мы требуем выполнения запроса и заполнение данными - асинхронная функция fetch
            task = asyncio.ensure_future(fetch(req_type, format_type, url, chain, session, headers, proxy))
            tasks.append(task)

        responses = await asyncio.gather(*tasks)
        return responses


def is_valid_filter(value, f_type):
    filters_values = {'buy_on': ["PochtaBank", "Yandex.Money", "Raiffaizen", "AlphaBank", "VTB", "HomeCreditBank",
                                 "QiWi", "AkBarsBank", "Rosbank", "MTSBank", "Tinkoff", "A-Bank", "Gasprombank",
                                 "Sberbank", ],
                      'sell_on': ["PochtaBank", "Yandex.Money", "Raiffaizen", "AlphaBank", "VTB", "HomeCreditBank",
                                  "QiWi", "AkBarsBank", "Rosbank", "MTSBank", "Tinkoff", "A-Bank", "Gasprombank",
                                  "Sberbank", ],
                      'coin': ["USDT", "ETH", "BTC", "BUSD", "BNB", ],
                      'buy_place': ["Binance", "Huobi", "ByBit", "OKX", "BESTCHANGE", ],
                      'sell_place': ["Binance", "Huobi", "ByBit", "OKX", "BESTCHANGE", ],
                      'buy_as': ["T", "M"],
                      'sell_as': ["T", "M"], }
    if value not in ['Купить на', 'Продать на', 'Коин', 'Место покупки',
                     'Место продажи', 'Купить как', 'Продать как']:
        if value in filters_values[f_type]:
            return True
    return False


def serialize_chains(chains):
    return json.dumps([ch.to_json() for ch in chains])


def deserialize_chains(chains):
    return [ChainForView().from_json(ch) for ch in json.loads(chains)]


def filter_chains(filters, chains, update_time):
    # TODO Нужен рефакторинг функции - вынести кеширование в отдельную функцию
    filter_level = ""

    for fltr in filters:
        if fltr[1] in ['buy_on', 'coin', 'buy_place']:
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: fltr[0] in x.buy_detail, chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
        elif fltr[1] in ['sell_on', 'sell_place']:
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: fltr[0] in x.sell_detail, chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
        elif fltr[1] == 'buy_as':
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: x.buy_role == fltr[0], chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
        elif fltr[1] == 'sell_as':
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: x.sell_role == fltr[0], chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
        elif fltr[1] == 'lower_limit':
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: float(x.buy_min_limit) >= float(fltr[0]) and
                                               float(x.buy_max_limit) >= float(fltr[0]), chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
        elif fltr[1] == 'upper_limit':
            filter_level += f'{fltr[0]}{fltr[1]}!'
            cache_try = cache.get(filter_level)
            if cache_try:
                chains = deserialize_chains(cache_try)
            else:
                chains = list(filter(lambda x: float(x.sell_min_limit) >= float(fltr[0]) and
                                               float(x.sell_max_limit) >= float(fltr[0]), chains))
                cache_time = (update_time - datetime.now()).total_seconds()
                if cache_time > 0:
                    cache.set(filter_level, serialize_chains(chains), timeout=cache_time)
    return chains


def time_profiler(func):
    @wraps(func)
    def wrapper(*args):
        start_time = time.time()
        result = func(*args)
        print(f"--- {time.time() - start_time} seconds ---")
        return result

    return wrapper


def intra_exchange(chns):
    """
    Возвращает все внутребиржевые связки, принимая все ордеры на покупку и продажу с 1 биржи
    """
    # print(len(chns))
    lst = list(
        permutations(chns, 2))  # После перестановочного метода, список снова становится списком кортежей по парам

    filtered_chains = [c for c in lst if
                       str(c[0]).split(' ')[0] != 'SELL' and str(c[0]).split(' ')[1] == str(c[1]).split(' ')[1] and
                       str(c[0]).split(' ')[0] != str(c[1]).split(' ')[0] and
                       'RUB' not in f'{c[0]}{c[1]}']
    return filtered_chains


def make_same(exch, bank):
    formats = {"Binance": {"Tinkoff": "Tinkoff",
                           "QIWI": "QiWi",
                           "YandexMoneyNew": "Yandex.Money",
                           "RaiffeisenBankRussia": "Raiffaizen",
                           "RosBank": "Rosbank",
                           "PostBankRussia": "PochtaBank",
                           "HomeCreditBank": "HomeCreditBank",
                           "MTSBank": "MTSBank",
                           "AkBarsBank": "AkBarsBank", },

               "Huobi": {28: "Tinkoff",
                         9: "QiWi",
                         19: "Yandex.Money",
                         36: "Raiffaizen",
                         358: "Rosbank",
                         29: "Sberbank",
                         27: "VTB",
                         25: "AlphaBank",
                         351: "Gasprombank", },

               "ByBit": {75: "Tinkoff",
                         62: "QiWi",
                         88: "Yandex.Money",
                         64: "Raiffaizen",
                         185: "Rosbank",
                         1: "A-Bank",
                         44: "MTSBank", },

               "OKX": {"Tinkoff": "Tinkoff",
                       "QiWi": "QiWi",
                       "Yandex.Money": "Yandex.Money",
                       "Raiffaizen": "Raiffaizen",
                       "Rosbank": "Rosbank", }, }
    return formats[exch][bank]


def add_behavior(chain):
    # Данная замена необходима, так как биржа передаёт данные с API в другом порядке (при запросе вкладки buy, выдают sell)
    if chain.__class__.__name__ == 'Huobi' or chain.__class__.__name__ == 'OKX':
        if chain.interaction_type == 'sell':
            chain.interaction_type = 'buy'
        else:
            chain.interaction_type = 'sell'
    # if chain.__class__.__name__ == 'ByBit':
    #    print(f'intrct state: {chain.interaction_type}')
    #    print(f'intrct state t: {type(chain.interaction_type)}')
    #    sleep(5)
    # Если нам попалось объявление со страницы, где мы можем продать другим валюту как тейкер
    # Данное объявление запрошено путём поиска людей, желающих купить крипту по данной цене
    if chain.interaction_type in ['SELL', 'sell', 0]:
        # Существует человек, который как мейкер готов купить у нас крипту по этой цене
        # Существует человек, которому мы как тейкер готовы продать крипту на странице продажи
        taker_sell = chain
        maker_buy = copy.deepcopy(chain)

        taker_sell.interaction_type = "SELL"
        maker_buy.interaction_type = "BUY"

        taker_sell.role = "T"
        maker_buy.role = "M"
        # if chain.__class__.__name__ == 'ByBit':
        #    print(f'Мы можем продать вот этому человеку крипту как тейкер: {taker_sell.advertiser} за {taker_sell.rate}')
        #    print(f'Мы можем как мейкер выложить запрос на покупку крипты по этой цене: {maker_buy.advertiser} {maker_buy.rate}')
        #    sleep(3)
        return maker_buy, taker_sell
    else:
        # Существует человек, который готов как мейкер продать нам крипту по этой цене
        # Существует человек, у которого мы как тейкер можем купить крипту на странице купить
        maker_sell = copy.deepcopy(chain)
        taker_buy = chain

        taker_buy.interaction_type = "BUY"
        maker_sell.interaction_type = "SELL"

        taker_buy.role = "T"
        maker_sell.role = "M"
        # if chain.__class__.__name__ == 'Huobi':
        #    print(f'Мы можем быстро купить крипту как тейкер у него: {taker_buy.advertiser} за {taker_buy.rate}')
        #    print(f'Мы можем как мейкер выложить на продажу крипту по этой цене: {maker_sell.advertiser} {maker_sell.rate}')
        #    sleep(3)
        return taker_buy, maker_sell


def get_correct_user(data, exchange):
    """
    Выбираем нормального трейдера
    """
    if exchange == 'Binance':
        for user in data:
            if float(user["advertiser"]["monthFinishRate"]) * 100 >= 50:
                return user
        return None
    elif exchange == 'Huobi':
        for user in data:
            if float(user["orderCompleteRate"]) >= 50:
                return user
        return None
    elif exchange == 'ByBit':
        for user in data:
            if float(user["recentExecuteRate"]) >= 50:
                return user
        return None
    else:
        for user in data:
            if float(user["completedRate"]) * 100 >= 50:
                return user
        return None


# Структура для хранения связок
class Chain:
    def __init__(self, id, buy_part, sell_part):  # Два экземпляра биржи
        self.id = id
        self.buy_part = buy_part
        self.sell_part = sell_part
        self.profit_percentage = (self.sell_part.rate / self.buy_part.rate - 1) * 100
        self.type = f'{self.buy_part.role}-{self.sell_part.role}'
        self.banks = [self.buy_part.bank(), self.sell_part.bank()]
        self.exchanges = [self.buy_part.__class__.__name__, self.sell_part.__class__.__name__]
        self.payment = [self.buy_part.payment(), self.sell_part.payment()]
        self.identical_exch = self.buy_part.__class__.__name__ == self.sell_part.__class__.__name__

    def show(self):
        return f'{self.buy_part} --- {self.sell_part}  >>>  {self.profit_percentage}\n<{self.buy_part.advertiser} = {self.sell_part.advertiser}>'

    def cache_key(self):
        return f'{self.id}_{self.buy_part}_{self.sell_part}_{self.profit_percentage}_' \
               f'{self.buy_part.advertiser}_{self.sell_part.advertiser}_' \
               f'{self.buy_part.min_limit}_{self.buy_part.max_limit}_' \
               f'{self.sell_part.min_limit}_{self.sell_part.max_limit}'


class ChainForView:  # TODO Этот ужас нужно убрать, форматирование должно быть нормальным после Redis
    def __init__(self, redis_str=None):
        self.redis_str = redis_str
        if self.redis_str:
            self.items = self.redis_str.split('_')
            buy_split = self.items[1].split('|')
            sell_split = self.items[2].split('|')
            self.id = int(self.items[0])
            self.buy_role = buy_split[-2]
            self.sell_role = sell_split[-2]
            self.buy_detail = f"{''.join(buy_split[0].split(' ')[1:])} | {buy_split[1]}"
            self.sell_detail = f"{''.join(sell_split[0].split(' ')[1:])} | {sell_split[1]}"
            self.profit_percent = round(float(self.items[3]), 2)
            self.buy_link = self.items[4]
            self.sell_link = self.items[5]
            self.buy_min_limit = self.items[6]
            self.buy_max_limit = self.items[7]
            self.sell_min_limit = self.items[8]
            self.sell_max_limit = self.items[9]

    def to_json(self):
        return {"id": self.id, "buy_role": self.buy_role, "sell_role": self.sell_role,
                "buy_detail": self.buy_detail, "sell_detail": self.sell_detail,
                "profit_percent": self.profit_percent,
                "buy_link": self.buy_link, "sell_link": self.sell_link,
                "buy_min_limit": self.buy_min_limit, "buy_max_limit": self.buy_max_limit,
                "sell_min_limit": self.sell_min_limit, "sell_max_limit": self.sell_max_limit, }

    def from_json(self, json_dct):
        for k, v in json_dct.items():
            setattr(self, k, v)
        return self


"""
Каждый Interaction класс нужен для записи частей связок с каждой из бирж.
Каждая биржа предоставляет отличающиеся API, поэтому класс нельзя объеденить в один.

bank_name - Название банка для оплаты и получения крипты
interaction_type - покупаем или продаём
asset, coin_id, token_id - крипта
cell - позиция на листе
fiat - валюта выбранного банка
merchant_check - хотим ли мы видеть только проверенных торговцев
"""


class Binance:
    def __init__(self, bank_name: str,
                 interaction_type: str,
                 asset: str, fiat: str = "RUB",
                 merchant_check: bool = False,
                 publisher_type: str = None,
                 completed_rate: float = None):
        self.bank_name = bank_name
        self.interaction_type = interaction_type
        self.merchant_check = merchant_check
        self.publisher_type = publisher_type
        self.asset = asset
        self.fiat = fiat
        self.rate = None
        self.role = None
        self.advertiser = None
        self.completed_rate = completed_rate
        self.min_limit = None
        self.max_limit = None

        self.i_dict = {
            "asset": self.asset,
            "fiat": self.fiat,
            "merchantCheck": self.merchant_check,
            "page": 1,
            "payTypes": [self.bank_name],
            "publisherType": self.publisher_type,
            "rows": 10,
            "tradeType": self.interaction_type
        }

    def get(self):
        return self.i_dict

    def payment(self):
        return self.asset

    def bank(self):
        return make_same(self.__class__.__name__, self.bank_name)

    def __str__(self):
        return f'{self.interaction_type} {self.asset} ({self.bank()})|' \
               f'{self.__class__.__name__}({self.rate})|{self.role}|'


class Huobi:
    def __init__(self, bank_index: int,
                 interaction_type: str,
                 coin_id: int, currency: int = 11,
                 merchant_check: str = "false",
                 block_type: str = "general",
                 completed_rate: float = None):
        self.bank_index = bank_index
        self.interaction_type = interaction_type
        self.merchant_check = merchant_check
        self.block_type = block_type
        self.coin_id = coin_id
        self.currency = currency
        self.rate = None
        self.role = None
        self.advertiser = None
        self.coins = {2: "USDT", 3: "ETH", 1: "BTC"}
        self.completed_rate = completed_rate
        self.min_limit = None
        self.max_limit = None

        self.i_dict = {
            "coinId": self.coin_id,
            "currency": self.currency,
            "isMerchant": self.merchant_check,
            "currPage": 1,
            "payMethod": self.bank_index,
            "tradeType": self.interaction_type,
            "blockType": self.block_type
        }

    def get(self):
        request_str = ""

        for k, v in self.i_dict.items():
            request_str += f'{k}={v}&'

        return request_str[:-1]

    def payment(self):
        return self.coins[self.coin_id]

    def bank(self):
        return make_same(self.__class__.__name__, self.bank_index)

    def __str__(self):
        return f'{self.interaction_type.upper()} {self.coins[self.coin_id]} ({self.bank()})|' \
               f'{self.__class__.__name__}({self.rate})|{self.role}|'


class ByBit:
    def __init__(self, bank_index: int,
                 interaction_type: int,
                 token_id: int, currency_id: str = "RUB",
                 completed_rate: float = None):
        self.bank_index = bank_index
        self.interaction_type = interaction_type
        self.token_id = token_id
        self.currency_id = currency_id
        self.rate = None
        self.role = None
        self.advertiser = None
        self.completed_rate = completed_rate
        self.min_limit = None
        self.max_limit = None

        self.i_dict = {
            "tokenId": self.token_id,
            "currencyId": self.currency_id,
            "payment": self.bank_index,
            "side": self.interaction_type,  # 1 - покупка, 2 - продажа
            "size": 10,
            "page": 1,
        }

    def get(self):
        request_str = ""

        for k, v in self.i_dict.items():
            request_str += f'{k}={v}&'

        return request_str[:-1]

    def payment(self):
        return self.token_id

    def bank(self):
        return make_same(self.__class__.__name__, self.bank_index)

    def __str__(self):
        ch_interaction = {0: "BUY", 1: "SELL", "SELL": "SELL", "BUY": "BUY"}  # What? show add_behavior func for answer
        return f'{ch_interaction[self.interaction_type]} {self.token_id} ({self.bank()})|' \
               f'{self.__class__.__name__}({self.rate})|{self.role}|'


class OKX:
    def __init__(self, bank_name: str,
                 interaction_type: str,
                 asset: str, currency_id: str = "rub",
                 completed_rate: float = None):
        self.bank_name = bank_name
        self.interaction_type = interaction_type
        self.asset = asset
        self.currency_id = currency_id
        self.rate = None
        self.role = None
        self.advertiser = None
        self.completed_rate = completed_rate
        self.min_limit = None
        self.max_limit = None

        self.i_dict = {
            "quoteCurrency": self.currency_id,
            "baseCurrency": self.asset,
            "side": self.interaction_type,
            "paymentMethod": self.bank_name,
            "userType": "all",
            "showTrade": "false",
            "showFollow": "false",
            "showAlreadyTraded": "false",
            "isAbleFilter": "false",
        }

    def get(self):
        request_str = ""

        for k, v in self.i_dict.items():
            request_str += f'{k}={v}&'

        return request_str[:-1]

    def payment(self):
        return self.asset.upper()

    def bank(self):
        return make_same(self.__class__.__name__, self.bank_name)

    def __str__(self):
        return f'{self.interaction_type.upper()} {self.asset.upper()} ({self.bank()})|' \
               f'{self.__class__.__name__}({self.rate})|{self.role}|'


class BESTCHANGE:
    def __init__(self, bank_name: str,
                 interaction_type: str,
                 asset: str, currency_id: str = "rub",
                 rate: float = None,
                 role: str = None,
                 min_limit: float = None,
                 max_limit: float = None,
                 advertiser: str = None,
                 exchange_suffix: str = None):
        self.bank_name = bank_name
        self.interaction_type = interaction_type
        self.asset = asset
        self.currency_id = currency_id
        self.rate = rate
        self.role = role
        self.advertiser = advertiser
        self.exchange_suffix = exchange_suffix  # У сайта вроде bestchange можно указать обменник для удобства
        self.min_limit = min_limit
        self.max_limit = max_limit

    def payment(self):
        return self.asset.upper()

    def bank(self):
        return self.bank_name

    def __str__(self):
        return f'{self.interaction_type} {self.asset.upper()} ({self.bank_name})|' \
               f'{self.__class__.__name__}.{self.exchange_suffix}({self.rate})|{self.role}|'


class Exchange:
    def __init__(self, base_url: str, wallets: dict, coins, interaction):

        # Словарь с банками и электронными кошельками.
        # Каждый ключ уникален в зависимости от API
        self.wallets = wallets
        self.coins = coins  # Список крипты, доступный на бирже
        self.base_url = base_url  # Основной url адрес биржи для работы с API
        self.interaction = interaction  # Структура данных, используемая для хранения данных с биржи
        # Методы обновляют данные связок с каждой биржи
        self.update_fabric = {"Binance": self.binance_update,
                              "Huobi": self.huobi_update,
                              "ByBit": self.bybit_update,
                              "OKX": self.okx_update,
                              "BESTCHANGE": self.bestchange_update}

    def update(self):
        """
        При вызове метода у экземпляра Exchange выбираем для значений подходящую биржу.
        """
        return self.update_fabric[self.interaction.__name__]()

    @time_profiler
    def binance_update(self):
        """
        Процесс обновления:
        1. Создаём список, в котором будем хранить связки
        2. Идём по списку крипты для конкретной биржи в таблице находим ячейку предназначенную для конкретной крипты
        3. Каждую итерацию цикла по перечислению крипты мы запускаем цикл,
           в котором каждую крипту прогоняем по всем возможным банкам и для каждого банка добавляем возможность
           покупки и продажи одной и той же крипты этим банком. Оба элемента добавляются в список.
        4. Затем, с помощью асинхронных запросов мы обращаемся к API для каждого элемента цепочки.
        5. Создаём список, который нужен для размещения полученных данных на листе
        6. Снова проходимся по старому списку со связками, пытаемся добавить в новый список результат
           каждого выполненного запроса, ведь индекс каждого элемента в списке со связками тот же,
           что и у каждого ответа.
        7. Структурируем полученный список удобным образом и выгружаем на лист.

        В итоге что мы получаем: Мы получаем последнее выгодное
                                 значение для покупки и продажи каждой крипты в каждом из банков

        :return: None
        """

        @RateLimiter(max_calls=3, period=1)
        def access_rate_limited_api(ch):
            try:
                return requests.post(self.base_url, json=ch.get(), timeout=1.5)
            except Exception as e:
                print(f"При отправке запроса вызвано исключение: {e}")

        chains = []

        for coin in self.coins:
            for wallet in self.wallets.keys():
                chains.append(self.interaction(wallet, "SELL", coin))
                chains.append(self.interaction(wallet, "BUY", coin))

        print(f"Всего возможных частей цепочек у binance(API обращений): {len(chains)}")

        with ThreadPoolExecutor(max_workers=3) as executor:
            loop_res = list(executor.map(access_rate_limited_api, chains))

            print('Binance finished!')
            new_chains = []
            for chain in chains:
                try:
                    user = get_correct_user(json.loads(loop_res[chains.index(chain)].text)["data"],
                                            chain.__class__.__name__)
                except AttributeError as text_as_nonetype:
                    print(text_as_nonetype)
                    continue
                except TypeError:
                    print(f"Data отсутствует для данного запроса: {loop_res[chains.index(chain)].text}")
                if user:
                    chain.rate = float(user["adv"]["price"])
                    chain.advertiser = f'https://p2p.binance.com/ru/advertiserDetail?advertiserNo={user["advertiser"]["userNo"]}'
                    chain.completed_rate = float(user["advertiser"]["monthFinishRate"]) * 100
                    chain.min_limit = float(user["adv"]["minSingleTransAmount"])
                    chain.max_limit = float(user["adv"]["maxSingleTransAmount"])

                    new_chains.append(add_behavior(chain))
            return new_chains

    @time_profiler
    def huobi_update(self):
        chains = []

        for coin, n in self.coins.items():
            for wallet in self.wallets.keys():
                # Отличается, потому что при запросе buy, биржа отображает данные со страницы sell
                chains.append(self.interaction(wallet, "buy", n))
                chains.append(self.interaction(wallet, "sell", n))

        loop = asyncio.get_event_loop()
        future = asyncio.ensure_future(get_data('get', 'args_inside_url', self.base_url, chains))
        loop_res = loop.run_until_complete(future)

        new_chains = []

        for chain in chains:
            try:
                user = get_correct_user(json.loads(loop_res[chains.index(chain)])['data'], chain.__class__.__name__)
                if user:
                    chain.rate = float(user['price'])
                    chain.advertiser = f'https://c2c.huobi.com/ru-ru/trader/{user["uid"]}'
                    chain.completed_rate = float(user["orderCompleteRate"])
                    chain.min_limit = float(user["minTradeLimit"])
                    chain.max_limit = float(user["maxTradeLimit"])

                    new_chains.append(add_behavior(chain))
            except (IndexError, AttributeError):
                print('Attribute error or index error')
            except Exception as e:
                print(f"Возникла неизвестная ошибка при обработке связки: {e}")
        return new_chains

    @time_profiler
    def bybit_update(self):
        chains = []

        for coin in self.coins:
            for wallet in self.wallets.keys():
                chains.append(self.interaction(wallet, 0, coin))
                chains.append(self.interaction(wallet, 1, coin))

        loop = asyncio.get_event_loop()
        future = asyncio.ensure_future(get_data('post', 'args_inside_url', self.base_url, chains))
        loop_res = loop.run_until_complete(future)

        new_chains = []

        for chain in chains:
            try:
                user = get_correct_user(json.loads(loop_res[chains.index(chain)])['result']['items'],
                                        chain.__class__.__name__)
                if user:
                    chain.rate = float(user['price'])
                    chain.advertiser = f"https://www.bybit.com/fiat/trade/otc/profile/{user['userId']}/{user['tokenId']}/RUB/item"
                    chain.completed_rate = float(user["recentExecuteRate"])
                    chain.min_limit = float(user["minAmount"])
                    chain.max_limit = float(user["maxAmount"])

                    new_chains.append(add_behavior(chain))
            except (IndexError, AttributeError):
                print('Attribute error or index error')
            except Exception as e:
                print(f"Возникла неизвестная ошибка при обработке связки: {e}")
        return new_chains

    @time_profiler
    def okx_update(self):
        chains = []

        for coin in self.coins:
            for wallet in self.wallets.keys():
                chains.append(self.interaction(wallet, "buy", coin))
                chains.append(self.interaction(wallet, "sell", coin))

        loop = asyncio.get_event_loop()
        future = asyncio.ensure_future(get_data('get', 'args_inside_url', self.base_url, chains,
                                                headers={'User-agent': 'Mozilla/5.0'}, proxy=settings.PROXY_SERVER))
        loop_res = loop.run_until_complete(future)

        new_chains = []

        for chain in chains:
            try:
                dct = json.loads(loop_res[chains.index(chain)])
                for k, v in dct['data'].items():
                    if v:
                        user = get_correct_user(dct['data'][k], chain.__class__.__name__)
                        if user:
                            chain.rate = float(user['price'])
                            chain.advertiser = f"https://www.okx.com/ru/p2p/ads-merchant?publicUserId={user['publicUserId']}"
                            chain.completed_rate = float(user["completedRate"]) * 100
                            chain.min_limit = float(user["quoteMinAmountPerOrder"])
                            chain.max_limit = float(user["quoteMaxAmountPerOrder"])

                            new_chains.append(add_behavior(chain))
            except (IndexError, AttributeError):
                print('Attribute error or index error')
            except Exception as e:
                print(f"Возникла неизвестная ошибка при обработке связки: {e}")
        return new_chains

    @time_profiler
    def bestchange_update(self):
        api = BestChange(cache=False)
        rates = api.rates()
        exchangers = api.exchangers().get()

        chains = []

        self.wallets = []
        for k, v in api.currencies().search_by_name('rub').items():
            if int(v["id"]) in [79, 17, 34, 64, 53, 147, 215, 191, 170, 176, 95, 132, 229, 62, 63, 59, 52, 51, 157, 195,
                                21, 42, 105, 6]:
                self.wallets.append((v["id"], v["name"].replace(' RUB', '')))
        for b in self.wallets:
            for coin, coin_variants in self.coins.items():
                for var in coin_variants:
                    try:
                        br = rates.filter(b[0], var)[0]
                        sr = rates.filter(var, b[0])[0]
                        self.min_limit = None
                        self.max_limit = None
                        buy_intrct = self.interaction(b[1], "BUY", coin, rate=float(br['give']),
                                                      role='T', exchange_suffix=exchangers[br['exchange_id']]['name'],
                                                      min_limit=float(br['min_sum']), max_limit=float(br['max_sum']),
                                                      advertiser=f'https://www.bestchange.ru/index.php?from={b[0]}&to={var}')
                        sell_intrct = self.interaction(b[1], "SELL", coin, rate=float(sr['get']),
                                                       role='T', exchange_suffix=exchangers[sr['exchange_id']]['name'],
                                                       min_limit=float(sr['min_sum']), max_limit=float(sr['max_sum']),
                                                       advertiser=f'https://www.bestchange.ru/index.php?from={var}&to={b[0]}')
                        chains.append((buy_intrct, sell_intrct))
                    except IndexError:
                        pass  # Нет предложений покупки за этот банк
        return chains
