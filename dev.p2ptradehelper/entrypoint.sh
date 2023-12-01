#!/bin/bash

echo "PostgreSQL запущена!"

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "Первичный запуск контейнера!"
    python manage.py migrate
    python manage.py collectstatic
    python manage.py createsuperuser --username Joe --email ivan141459@gmail.com --noinput
    python manage.py get_sub Joe
    echo "Запускаем celery воркеры..."
    #celery -A p2phelper worker -l info --pool=solo -n exchange_worker --without-gossip --pidfile="./celery/run/exchange.pid" --logfile="./celery/log/exchange.log" --detach
    #celery -A p2phelper worker -l info --pool=solo -n mail_worker -Q mail_queue --without-gossip --pidfile="./celery/run/mail.pid" --logfile="./celery/log/mail.log" --detach
    #celery -A p2phelper worker -l info --pool=solo -n "subscription_worker" -Q subscription_queue --without-gossip --pidfile="./celery/run/subscription.pid" --logfile="./celery/log/subscription.log" --detach
    #echo "Создаём тестовых пользователей"
    #python createusers.py
    #echo "Пользователи созданы"
else
    echo "Повторный запуск контейнера!"
fi

exec "$@"
