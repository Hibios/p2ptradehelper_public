import ast
from random import choice, randint
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "p2phelper.settings")

import django
django.setup()

from django.contrib.auth.models import User
from tradehelper.models import Profile

for_gen_name = "ABCDEFGOPQRSTUFKCHabcdefgopqrstufkch1234567890"
for_gen_passwd = "ABCDEF%$&@(GOPQRSTUFKCHabcde*&@^$fgopqrstufkch1234567890"


def gen_user(users):
    while True:
        generated_name = ""
        name_lenght = randint(5, 10)
        for i in range(name_lenght):
            generated_name += choice(for_gen_name)
        if generated_name not in users.keys():
            break

    generate_password = ""
    passwd_lenght = randint(5, 10)
    for i in range(passwd_lenght):
        generate_password += choice(for_gen_passwd)
    return generated_name, generate_password


def write_test_users():
    users = {}
    for i in range(500):
        new_user = gen_user(users)
        users[new_user[0]] = new_user[1]
    with open('share/test_users.txt', 'w') as fl:
        fl.write(str(users))
    return users


def users_iterator(users, users_count):
    n = 0
    for u, p in users.items():
        user = User(username=u)
        user.set_password(p)
        n += 1
        print(f'\rUser {n} of {users_count} created!', end="")
        yield user


def create_test_users():
    try:
        with open('share/test_users.txt', 'r') as fl:
            usrs = ast.literal_eval(fl.read())
        User.objects.bulk_create(iter(users_iterator(usrs, len(usrs))))
        for u, p in usrs.items():
            usr = User.objects.get(username=u)
            Profile.objects.create(user=usr)
        open('share/success', 'a').close()
    except FileNotFoundError:
        write_test_users()
        create_test_users()


if __name__ == "__main__":
    create_test_users()
