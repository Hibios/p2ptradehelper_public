# Generated by Django 4.1.1 on 2022-09-29 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tradehelper", "0008_alter_profile_subscription"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="canceled",
            field=models.BooleanField(default=False, null=True),
        ),
        migrations.AddField(
            model_name="subscription",
            name="charge_task",
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AddField(
            model_name="subscription",
            name="mailing_task",
            field=models.CharField(max_length=300, null=True),
        ),
    ]
