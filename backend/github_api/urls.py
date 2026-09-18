from django.urls import path

from github_api.views import HealthView
from github_api.views import RepositoryDetailView

urlpatterns = [
    path('health/', HealthView.as_view(), name='health'),
    path(
        'repositories/<str:owner>/<str:repo>/',
        RepositoryDetailView.as_view(),
        name='repository-detail',
    ),
]
