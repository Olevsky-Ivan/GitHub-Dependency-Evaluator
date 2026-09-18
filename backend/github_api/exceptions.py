from rest_framework.exceptions import APIException


class GitHubAPIError(APIException):
    status_code = 502
    default_detail = 'GitHub API is unavailable.'
    default_code = 'github_unavailable'


class GitHubRateLimitError(APIException):
    status_code = 429
    default_detail = 'GitHub API rate limit exceeded.'
    default_code = 'github_rate_limited'
