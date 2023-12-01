from django.urls import path
from . import views

app_name = 'frontend'

urlpatterns = [
    path('arbitration', views.arbitration, name='arbitration'),
    path('', views.landing, name="home"),
    path('oferta', views.download_oferta),
]