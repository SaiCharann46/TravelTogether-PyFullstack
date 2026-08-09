"""
WSGI config for traveltogether project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveltogether.settings')

application = get_wsgi_application()
