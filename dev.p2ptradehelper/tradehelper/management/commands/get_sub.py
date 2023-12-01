from django.core.management.base import BaseCommand, CommandError
from tradehelper.models import Profile, get_base_subscription


class Command(BaseCommand):
    help = 'Выдаём пользователю подписку'

    def add_arguments(self, parser):
        parser.add_argument('user', type=str)

    def handle(self, *args, **options):
        try:
            user_profile = Profile.objects.get(user__username=options['user'])
        except Profile.DoesNotExist:
            raise CommandError(f'Пользователя {options["user"]} не существует!')

        new_sub = get_base_subscription()
        user_profile.subscription = new_sub
        user_profile.save()

        self.stdout.write(self.style.SUCCESS(f'Подписка успешно выдана пользователю: {options["user"]}'))
