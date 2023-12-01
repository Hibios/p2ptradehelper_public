import time
from ast import literal_eval
from locust import HttpUser, task, between, TaskSet
from random import randint
import os
import requests

USER_CREDENTIALS = []

while not os.path.isfile('/mnt/locust/share/success'):
    time.sleep(1)

with open('/mnt/locust/share/test_users.txt', 'r') as fl:
    users = literal_eval(fl.read())

for usr, passwd in users.items():
    USER_CREDENTIALS.append((usr, passwd))


class User(HttpUser):
    @task
    def view_chains(self):
        self.client.get("/api/chains/?buy_on=%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C+%D0%BD%D0%B0&sell_on=%D0%9F%D1%80%D0%BE%D0%B4%D0%B0%D1%82%D1%8C+%D0%BD%D0%B0&coin=%D0%9A%D0%BE%D0%B8%D0%BD&buy_place=%D0%9C%D0%B5%D1%81%D1%82%D0%BE+%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8&sell_place=%D0%9C%D0%B5%D1%81%D1%82%D0%BE+%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B8&buy_as=%D0%A2%D0%B5%D0%B9%D0%BA%D0%B5%D1%80&sell_as=%D0%9C%D0%B5%D0%B9%D0%BA%D0%B5%D1%80&lower_limit=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%BB%D0%B8%D0%BC%D0%B8%D1%82+%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8&upper_limit=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9+%D0%BB%D0%B8%D0%BC%D0%B8%D1%82+%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6%D0%B8", auth=('Billy', os.environ.get("DJANGO_SUPERUSER_PASSWORD")))

    def on_start(self):
        if len(USER_CREDENTIALS) > 0:
            user, passw = USER_CREDENTIALS.pop()

            print('User:', user, passw)
            print(f'Base auth credintials: {os.environ.get("DJANGO_SUPERUSER_PASSWORD")}')
            response = self.client.get('/login', auth=('Joe', os.environ.get("DJANGO_SUPERUSER_PASSWORD")))
            print('Status code:', response.status_code)
            self.client.headers['Referer'] = self.client.base_url
            csrftoken = response.cookies['csrftoken']
            while self.client.post('/login',
                                 {'username': user, 'password': passw}, headers={'X-CSRFToken': csrftoken}, auth=('Joe', os.environ.get("DJANGO_SUPERUSER_PASSWORD"))).status_code != 200:
                time.sleep(1)
            time.sleep(0.5)
            self.client.get('/arbitration', auth=('Joe', os.environ.get("DJANGO_SUPERUSER_PASSWORD")))
