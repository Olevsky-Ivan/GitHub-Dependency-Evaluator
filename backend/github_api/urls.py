from django.urls import path

from github_api.views import RepositoryDetailView

urlpatterns = [
    path(
        'repositories/<str:owner>/<str:repo>/',
        RepositoryDetailView.as_view(),
        name='repository-detail',
    ),
]
