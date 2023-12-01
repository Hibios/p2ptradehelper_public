# Generated by Django 4.1.1 on 2022-09-16 22:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    def set_default_option(apps, schema_editor):
        Option = apps.get_model('tradehelper', 'Option')
        default_option = Option(1, "Базовая подписка", "Открывает доступ к странице арбитража, просмотру и фильтрации связок с бирж", "", 990.00)
        default_option.save()

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Название опции', max_length=100)),
                ('description', models.CharField(help_text='Описание опции', max_length=500)),
                ('detail', models.CharField(help_text='Возможные параметры для некоторых опций', max_length=50)),
                ('price', models.DecimalField(decimal_places=2, help_text='Цена опции', max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_start', models.DateTimeField(auto_now_add=True)),
                ('date_end', models.DateTimeField()),
                ('status', models.BooleanField()),
                ('price', models.DecimalField(decimal_places=2, help_text='Цена всей подписки с учётом опций', max_digits=10)),
                ('options', models.ManyToManyField(to='tradehelper.option')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_photo', models.ImageField(blank=True, null=True, upload_to='media/')),
                ('last_session_key', models.CharField(blank=True, max_length=40, null=True)),
                ('subscription', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tradehelper.subscription')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RunPython(set_default_option),
    ]