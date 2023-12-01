import datetime
import json
import os
import logging

from rest_framework import status

from .tasks import send_mail_task, charge_subscription

from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import BadHeaderError, send_mail
from django.db.models import Q
from django.http import HttpResponse, FileResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib import messages
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response

from .forms import PasswordResetUserForm, SetPasswordUserForm
from .functions import buy_subscription

from .forms import ProfileForm, UserForm, ProfileImageForm
from django.conf import settings
from .modules import ChainForView, is_valid_filter, filter_chains

from .modules import serialize_chains, deserialize_chains
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from .models import Order, get_next_payment_date, get_base_subscription
from p2phelper.celery import app

logger = logging.getLogger(__name__)

@login_required(login_url='tradehelper:login')
def update_profile(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=request.user)
        profile_form = ProfileImageForm(request.POST, request.FILES, instance=request.user.profile)
        if user_form.is_valid() and (User.objects.filter(email=user_form.cleaned_data["email"]).count() == 0 or
                                     user_form.cleaned_data["email"] == request.user.email):
            if profile_form.is_valid():
                profile_photo = profile_form.cleaned_data['profile_photo']
                if profile_photo:
                    if profile_photo.size / 1000 <= 1000:
                        profile_form.save()
                        user_form.save()
                        return redirect('tradehelper:profile')
                    else:
                        messages.info(request, "Допустимый размер изображения - до 1МБ")
                else:
                    user_form.save()
                    return redirect('tradehelper:profile')
            else:
                messages.info(request, "Загружаемый файл должен быть изображением")
        else:
            messages.info(request, "Имя пользователя или электронная почта уже заняты")
    user_form = UserForm(instance=request.user)
    profile_form = ProfileImageForm()
    return render(request, 'tradehelper/edit_profile.html', {
        'user_form': user_form,
        'image_form': profile_form,
    })


def register_request(request):
    if request.method == "POST":
        if request.recaptcha_is_valid:
            form = ProfileForm(request.POST)
            if form.is_valid() and User.objects.filter(email=form.cleaned_data["email"]).count() == 0:
                user = form.save()
                login(request, user)
                messages.success(request, "Вы успешно зарегистрированы")
                return redirect("tradehelper:profile")
            messages.error(request, "Ошибка регистрации. Проверьте введённые данные")
    form = ProfileForm()
    return render(request,
                  'tradehelper/register.html',
                  context={"register_form": form})


@login_required(login_url='tradehelper:login')
def index(request):
    return render(
        request,
        'tradehelper/profile.html',
        context={"next_payment_date": get_next_payment_date()})


def password_reset_request(request):
    if request.method == "POST":
        if request.recaptcha_is_valid:
            password_reset_form = PasswordResetUserForm(request.POST)
            if password_reset_form.is_valid():
                data = password_reset_form.cleaned_data['email']
                associated_users = User.objects.filter(Q(email=data))
                if associated_users.exists():
                    for user in associated_users:
                        send_mail_task.apply_async(args=["Password Reset Requested",
                                                         "tradehelper/passwords/password_reset_email.txt",
                                                         user.email,
                                                         {
                                                             'email': user.email,
                                                             'domain': 'p2ptradehelper.ru',
                                                             'site_name': 'P2PTradeHelper',
                                                             'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                                             'user': user.username,
                                                             'token': default_token_generator.make_token(user),
                                                             'protocol': 'https',
                                                         }], queue="mail_queue")
                        return redirect("tradehelper:password_reset_done")
            else:
                messages.info(request, "Вы не прошли проверку Captcha")
        else:
            messages.info(request, "Вы не прошли проверку Captcha")
    password_reset_form = PasswordResetUserForm()
    return render(request=request, template_name='tradehelper/passwords/password_reset_form.html',
                  context={"password_reset_form": password_reset_form})


def new_password_confirm(request):
    set_password_form = SetPasswordUserForm()
    return render(request=request, template_name='registration/password_reset_confirm.html',
                  context={"form": set_password_form})


class NotificationListener(APIView):
    def post(self, request):
        try:
            logger.info("Payment notification is received")
            order_data = request.data
            logger.info(f"Order_data: {order_data}")
            user_order = Order.objects.get(id=int(order_data["OrderId"]))
            if user_order.status != "CONFIRMED":
                logger.info(f"User order that we find: {user_order.__dict__}")
                user_order.status = order_data["Status"]
                user_order.save()
                if order_data["Success"] and order_data["Status"] == "CONFIRMED":
                    logger.info("OMG! Success in order operation!")
                    user = user_order.user
                    user.profile.subscription = get_base_subscription()
                    logger.info(f"We have issued a subscription!: {user.profile.subscription}")
                    user.profile.subscription.rebill_id = order_data["RebillId"]
                    logger.info(f"NEXT CHARGING: {user.profile.subscription.date_end}")
                    seconds_to_charge = (user.profile.subscription.date_end - datetime.datetime.now()).total_seconds()
                    logger.info(f"Seconds to charge: {seconds_to_charge}")
                    charging_id = charge_subscription.apply_async(args=[user.id,],
                                                                  countdown=seconds_to_charge,
                                                                  queue="subscription_queue")
                    mailing_id = send_mail_task.apply_async(args=["Подписка оформлена",
                                                     "tradehelper/subscription.txt",
                                                     user.email,
                                                     {
                                                         'user': user.username,
                                                         'next_payment': user.profile.subscription.date_end.strftime("%d.%m.%Y"),
                                                     }], queue="mail_queue")

                    seconds_to_notify = seconds_to_charge - 86400

                    notify_mailing_id = send_mail_task.apply_async(args=["Подписка на P2PTradeHelper",
                                                                  "tradehelper/subscription_notify.txt",
                                                                  user.email,
                                                                  {
                                                                      'user': user.username,
                                                                  }], countdown=seconds_to_notify, queue="mail_queue")
                    user.profile.subscription.charge_task = str(charging_id)
                    user.profile.subscription.mailing_task = str(mailing_id) + '|' + str(notify_mailing_id)
                    user.profile.subscription.save()
                    user.save()
                    return HttpResponse(content='OK', status=status.HTTP_200_OK)
                else:
                    logger.info(f"Something wrong!: {order_data}")
                    return JsonResponse({'message': 'The payment was made successfully, but the payment '
                                                    'status in the response is not successful! Impossible error.!'},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return HttpResponse(content='OK', status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            logger.info("MISSING ORDER ERROR AGAIN!")
            return HttpResponse(content='OK', status=status.HTTP_200_OK)


class ChainsList(APIView):
    def get(self, request):
        if request.user.profile.subscription and request.user.profile.subscription.status():
            buy_on = (self.request.GET.get('buy_on', 'Купить на'), 'buy_on')
            sell_on = (self.request.GET.get('sell_on', 'Продать на'), 'sell_on')
            coin = (self.request.GET.get('coin', 'Коин'), 'coin')
            buy_place = (self.request.GET.get('buy_place', 'Место покупки'), 'buy_place')
            sell_place = (self.request.GET.get('sell_place', 'Место продажи'), 'sell_place')
            transform_dict = {"Тейкер": "T", "Мейкер": "M", "Купить как": "Купить как", "Продать как": "Продать как"}
            buy_as = (transform_dict[self.request.GET.get('buy_as', 'Купить как')], 'buy_as')
            sell_as = (transform_dict[self.request.GET.get('sell_as', 'Продать как')], 'sell_as')
            lower_limit = (self.request.GET.get('lower_limit'), 'lower_limit')
            upper_limit = (self.request.GET.get('upper_limit'), 'upper_limit')

            if lower_limit[0] == "Нижний лимит покупки":
                lower_limit = (0, lower_limit[1])
            if upper_limit[0] == "Нижний лимит продажи":
                upper_limit = (0, upper_limit[1])

            print("Лимиты: ", lower_limit, upper_limit)

            filters = []

            if lower_limit[0] != '':
                filters.append(lower_limit)
            if upper_limit[0] != '':
                filters.append(upper_limit)

            for fltr in [buy_on, sell_on, coin, buy_place, sell_place, buy_as, sell_as]:
                if is_valid_filter(fltr[0], fltr[1]):
                    filters.append(fltr)

            #  Проверяем, были ли запросы по таким же фильтрам в последнюю минуту, если да, сразу возвращаем ответ
            current_mask = ""
            for f in filters:
                current_mask += f'{f[0]}{f[1]}!'
            chains_from_cache = cache.get(current_mask)
            if chains_from_cache:
                print(f'Current mask in cache: {current_mask}')
                all_chains = cache.get('allc')
                updatetime = cache.get('updatetime')

                return Response({"all_chains": all_chains, "updatetime": updatetime,
                                 "chains": json.loads(chains_from_cache)[:30], "subscribe": 1})

            # Пытаемся получить связки из кеша
            chains_struct_cache = cache.get('chains')

            if chains_struct_cache:
                redis_chains = json.loads(chains_struct_cache).values()
                all_chains = cache.get('allc')
                updatetime = cache.get('updatetime')  # Unix формат для React
                update_time = datetime.datetime.fromtimestamp(
                    int(updatetime) / 1000)  # Формат для вычисления времени кеша
                view_chains = []

                # Получим из кеша отсортированный и обработанный список связок
                cache_try = cache.get("chains_for_view")
                if cache_try:
                    view_chains = deserialize_chains(json.loads(cache_try))

                # Сортируем и структурируем сами, записываем в кеш
                if not view_chains:
                    for c in redis_chains:
                        view_chains.append(ChainForView(c))
                    view_chains.sort(key=lambda cls: cls.profit_percent, reverse=True)
                    cache_time = (update_time - datetime.datetime.now()).total_seconds()
                    print(f'===============CACHE TIME==========: {cache_time}')
                    if cache_time > 0:
                        cache.set("chains_for_view", json.dumps(serialize_chains(view_chains)), timeout=cache_time)

                view_chains = filter_chains(filters, view_chains, update_time)

                return Response({"all_chains": all_chains, "updatetime": updatetime,
                                 "chains": [chain.to_json() for chain in view_chains][:30], "subscribe": 1})
            return Response({"all_chains": 0, "updatetime": "", "chains": [], "subscribe": 1})
        else:
            return Response({"all_chains": 0, "updatetime": "", "chains": [], "subscribe": 0})


def download_autopay(request):
    filename = 'autopay.pdf'
    filepath = os.path.dirname(settings.BASE_DIR) + '/p2phelper/docs/' + filename
    response = FileResponse(open(filepath, 'rb'))
    response['Content-Disposition'] = f"attachment; filename={filename}"
    return response


def get_subscription(request):
    return buy_subscription(request.user, 'buy')


def unsubscribe(request):
    usr = request.user
    app.control.revoke(usr.profile.subscription.charge_task, terminate=True, signal='SIGKILL')
    mailing_tasks = usr.profile.subscription.mailing_task
    for t in mailing_tasks.split('|'):
        app.control.revoke(t, terminate=True, signal='SIGKILL')
    usr.profile.subscription.canceled = True
    usr.profile.subscription.save()
    send_mail_task.apply_async(args=["Вы отключили подписку",
                                     "tradehelper/unsubscribe.txt",
                                     usr.email,
                                     {
                                         'user': usr.username,
                                     }], queue="mail_queue")
    return render(request, 'tradehelper/profile.html')


def payment_complete(request):
    return render(request, 'tradehelper/success_payment.html')


def payment_fail(request):
    return render(request, 'tradehelper/fail_payment.html')
