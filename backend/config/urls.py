from django.urls import include
from django.urls import path

from github_api import urls as github_api_urls

urlpatterns = [
    path('api/', include(github_api_urls)),
]
