from rest_framework.fields import BooleanField
from rest_framework.fields import CharField
from rest_framework.fields import DateTimeField
from rest_framework.fields import IntegerField
from rest_framework.fields import URLField
from rest_framework.serializers import Serializer


class RepositoryOverviewSerializer(Serializer):
    owner = CharField()
    name = CharField()
    full_name = CharField()
    description = CharField(allow_null=True)
    html_url = URLField()
    stars = IntegerField()
    forks = IntegerField()
    language = CharField(allow_null=True)
    license = CharField(allow_null=True)
    archived = BooleanField()


class LastReleaseSerializer(Serializer):
    name = CharField(allow_null=True, allow_blank=True)
    published_at = DateTimeField()


class ActivitySerializer(Serializer):
    last_commit_at = DateTimeField(allow_null=True)
    last_release = LastReleaseSerializer(allow_null=True)
    releases_last_12_months = IntegerField()


class CommunitySerializer(Serializer):
    contributors = IntegerField()
    open_issues = IntegerField()


class RiskSignalSerializer(Serializer):
    level = CharField()
    code = CharField()
    message = CharField()


class RepositoryAnalysisSerializer(Serializer):
    repository = RepositoryOverviewSerializer()
    activity = ActivitySerializer()
    community = CommunitySerializer()
    risk_signals = RiskSignalSerializer(many=True)
