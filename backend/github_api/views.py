from rest_framework.response import Response
from rest_framework.views import APIView

from github_api.evaluation import RepositoryEvaluator
from github_api.serializers import RepositoryAnalysisSerializer


class HealthView(APIView):
    def get(self, request):
        return Response({'status': 'ok'})


class RepositoryDetailView(APIView):
    def get(self, request, owner, repo):
        analysis = RepositoryEvaluator().evaluate(owner, repo)
        serializer = RepositoryAnalysisSerializer(analysis)
        return Response(serializer.data)
