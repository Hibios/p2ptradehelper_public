from django.contrib.auth.urls import urlpatterns as original_urlpatterns

exclude_patterns = ["login",
                    "password_reset", "password_reset_done",
                    "password_reset_confirm", "password_reset_complete", ]
urlpatterns = [pattern for pattern in original_urlpatterns if pattern.name not in exclude_patterns]
