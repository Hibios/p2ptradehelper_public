# Generated by Django 4.0.6 on 2022-09-18 17:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tradehelper', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='status',
        ),
    ]