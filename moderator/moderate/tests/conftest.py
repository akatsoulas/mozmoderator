def pytest_configure(config):
    from django.conf import settings

    settings.SESSION_COOKIE_SECURE = False
    settings.CSRF_COOKIE_SECURE = False
    settings.SECURE_HSTS_SECONDS = 0
