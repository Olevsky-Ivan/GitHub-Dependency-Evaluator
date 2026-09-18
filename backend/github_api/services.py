import re

import requests
from django.conf import settings
from rest_framework.exceptions import NotFound

from github_api.exceptions import GitHubAPIError
from github_api.exceptions import GitHubRateLimitError

LAST_PAGE_RE = re.compile(r'[?&]page=(\d+)>;\s*rel="last"')


class GitHubClient:
    def get_repository(self, owner, repo):
        response = self._request(
            f'/repos/{owner}/{repo}',
            not_found_detail=f"Repository '{owner}/{repo}' was not found.",
        )
        return response.json()

    def get_latest_commit(self, owner, repo):
        response = self._request(
            f'/repos/{owner}/{repo}/commits',
            params={'per_page': 1},
            allowed_statuses={409},
        )
        if response.status_code == 409:
            return None

        commits = response.json()
        if not commits:
            return None

        commit = commits[0].get('commit') or {}
        committer = commit.get('committer') or {}
        author = commit.get('author') or {}
        return committer.get('date') or author.get('date')

    def get_releases(self, owner, repo):
        response = self._request(
            f'/repos/{owner}/{repo}/releases',
            params={'per_page': 100},
        )
        return response.json() or []

    def get_contributors_count(self, owner, repo):
        response = self._request(
            f'/repos/{owner}/{repo}/contributors',
            params={'per_page': 1, 'anon': 'true'},
        )
        match = LAST_PAGE_RE.search(response.headers.get('Link') or '')
        if match:
            return int(match.group(1))

        contributors = response.json()
        if isinstance(contributors, list):
            return len(contributors)
        return 0

    def _request(self, path, params=None, not_found_detail=None, allowed_statuses=None):
        url = f'{settings.GITHUB_API_BASE_URL}{path}'
        try:
            response = requests.get(
                url,
                headers=self._headers(),
                params=params,
                timeout=settings.GITHUB_API_TIMEOUT,
            )
        except requests.RequestException as exc:
            raise GitHubAPIError() from exc

        if allowed_statuses and response.status_code in allowed_statuses:
            return response

        if response.status_code == 404:
            raise NotFound(not_found_detail or 'GitHub resource was not found.')

        if response.status_code == 403 and 'rate limit' in response.text.lower():
            raise GitHubRateLimitError()

        if not response.ok:
            raise GitHubAPIError()

        return response

    def _headers(self):
        headers = {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'GitHub-Dependency-Evaluator',
        }
        if settings.GITHUB_TOKEN:
            headers['Authorization'] = f'Bearer {settings.GITHUB_TOKEN}'
        return headers
