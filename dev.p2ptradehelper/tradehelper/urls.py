from django.urls import path, reverse_lazy
from django.contrib.auth import views

from . import views as app_views
from . import captcha

from .forms import UserLoginForm, SetPasswordUserForm
from django.contrib.auth.decorators import login_required

app_name = 'tradehelper'

urlpatterns = [
    path('profile', app_views.index, name='profile'),
    path('autopay', app_views.download_autopay, name='autopay_rules'),
    path('payment_complete', app_views.payment_complete, name='payment_complete'),
    path('payment_fail', app_views.payment_fail, name='payment_fail'),
    path('login', views.LoginView.as_view(authentication_form=UserLoginForm), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('register', captcha.check_recaptcha(app_views.register_request), name='register'),
    path('edit_profile', app_views.update_profile, name='edit_profile'),
    path('password_reset', captcha.check_recaptcha(app_views.password_reset_request), name="password_reset"),
    path('password_reset/done/',
         views.PasswordResetDoneView.as_view(template_name='registration/password_reset_done.html'),
         name='password_reset_done'),
    path('reset/<uidb64>/<token>/',
         views.PasswordResetConfirmView.as_view(template_name='registration/password_reset_confirm.html',
                                                form_class=SetPasswordUserForm,
                                                success_url=reverse_lazy('tradehelper:password_reset_complete')),
         name='password_reset_confirm'),
    path('reset/done/',
         views.PasswordResetCompleteView.as_view(template_name='tradehelper/passwords/password_reset_complete.html'),
         name='password_reset_complete'),

    # API
    path('api/chains/', login_required(app_views.ChainsList.as_view()), name="chains"),
    path('api/payment_notification/', app_views.NotificationListener.as_view(), name="payment_notification"),
    path('buy_subscription', login_required(app_views.get_subscription), name="buy_subscription"),
    path('unsubscribe', login_required(app_views.unsubscribe), name="unsubscribe"),
]