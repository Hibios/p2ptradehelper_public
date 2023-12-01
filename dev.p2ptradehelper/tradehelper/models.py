import datetime
import requests
from dateutil.relativedelta import relativedelta
from celery import current_app

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.sessions.models import Session
from django.contrib.auth.signals import user_logged_in
from django.utils.timezone import now


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    status = models.CharField(max_length=50, help_text="Статус заказа", null=True)
    payment_id = models.IntegerField(null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Стоимость заказа", null=True)
    payment_url = models.CharField(max_length=500, help_text="Ссылка на оплату", null=True)
    datetime = models.DateTimeField(auto_now_add=True)


class Option(models.Model):
    """
    Хранение дополнительных платных опций для подписки
    """
    name = models.CharField(max_length=100, help_text="Название опции")
    description = models.CharField(max_length=500, help_text="Описание опции")
    detail = models.CharField(max_length=50, help_text="Возможные параметры для некоторых опций")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Цена опции")


class Subscription(models.Model):
    """
    Модель для хранения подписки каждого пользователя
    """
    date_start = models.DateTimeField(auto_now_add=True)
    date_end = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Цена всей подписки с учётом опций")
    options = models.ManyToManyField(Option)
    rebill_id = models.CharField(max_length=500, null=True)
    mailing_task = models.CharField(max_length=300, null=True)
    charge_task = models.CharField(max_length=300, null=True)
    canceled = models.BooleanField(null=True, default=False)

    def __str__(self):
        return f'c {self.date_start.strftime("%d.%m.%Y")} по {self.date_end.strftime("%d.%m.%Y")}'

    def status(self):
        if now() < self.date_end:
            return True
        else:
            usr = Profile.objects.filter(subscription_id=self.id).last().user

            current_app.send_task('tradehelper.tasks.send_mail_task', args=["Истёк срок действия подписки",
                                                                            "tradehelper/unsubscribe.txt",
                                                                            usr.email,
                                                                            {
                                                                                'user': usr.username,
                                                                            }], queue="mail_queue")
            self.delete()
            return False

    def update(self):
        self.price = 0
        for option in self.options.all():
            self.price += option.price
        self.date_end = now() + relativedelta(months=1)
        self.save()


class Profile(models.Model):
    """
    Профиль каждого пользователя, надстройка над стандартной моделью :model:`auth.User`
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True)
    profile_photo = models.ImageField(upload_to='media/', blank=True, null=True)
    last_session_key = models.CharField(blank=True, null=True, max_length=40)


@receiver(post_save, sender=User)  # Сохранение пользователя создаёт его профиль если его не было
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)  # Сохранение пользователя также обновляет его профиль
def save_user_profile(sender, instance, created, **kwargs):
    if instance.profile:
        instance.profile.save()


@receiver(user_logged_in, sender=User)
def set_session_key(user, request, **kwargs):
    user_profile = Profile.objects.get(user_id=user.id)
    if user_profile.last_session_key and not user_profile.last_session_key == request.session.session_key:
        lst_session = Session.objects.filter(session_key=user_profile.last_session_key)
        if lst_session:
            lst_session[0].delete()
    user_profile.last_session_key = request.session.session_key
    user_profile.save()


def get_next_payment_date():
    target_date = now() + relativedelta(months=1)
    return target_date.strftime('%d.%m.%Y')


def get_base_subscription():
    dt = now()
    subscription = Subscription(date_start=dt, date_end=dt + relativedelta(months=1), price=990.00)
    subscription.save()
    subscription.options.add(Option.objects.get(name="Базовая подписка"))
    subscription.save()
    return subscription
