from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from datetime import timedelta
from datetime import timezone

from github_api.services import GitHubClient

SIX_MONTHS = timedelta(days=182)
TWELVE_MONTHS = timedelta(days=365)

LEVEL_HIGH_RISK = 'high_risk'
LEVEL_WARNING = 'warning'
LEVEL_OK = 'ok'


def parse_github_datetime(value):
    if not value:
        return None
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def format_relative(value):
    now = datetime.now(timezone.utc)
    days = (now - value).days

    if days <= 0:
        return 'today'
    if days == 1:
        return '1 day ago'
    if days < 30:
        return f'{days} days ago'

    months = days // 30
    if months == 1:
        return '1 month ago'
    if months < 12:
        return f'{months} months ago'

    years = days // 365
    if years <= 1:
        return '1 year ago'
    return f'{years} years ago'


def build_risk_signals(archived, last_commit_at, last_release_at):
    now = datetime.now(timezone.utc)
    signals = []
    recent_commits = bool(last_commit_at) and (now - last_commit_at) <= SIX_MONTHS

    if archived:
        signals.append({
            'level': LEVEL_HIGH_RISK,
            'code': 'archived',
            'message': 'Archived repository',
        })
    else:
        signals.append({
            'level': LEVEL_OK,
            'code': 'not_archived',
            'message': 'Not archived',
        })

    if last_commit_at is None:
        signals.append({
            'level': LEVEL_WARNING,
            'code': 'no_commits',
            'message': 'No commits found',
        })
    elif not recent_commits:
        signals.append({
            'level': LEVEL_WARNING,
            'code': 'stale_commits',
            'message': f'Last commit was {format_relative(last_commit_at)}',
        })
    else:
        signals.append({
            'level': LEVEL_OK,
            'code': 'recent_commits',
            'message': 'Recent commits',
        })

    if last_release_at is None:
        signals.append({
            'level': LEVEL_WARNING,
            'code': 'no_releases',
            'message': 'No GitHub releases found',
        })
    elif now - last_release_at > TWELVE_MONTHS:
        signals.append({
            'level': LEVEL_WARNING,
            'code': 'stale_release',
            'message': f'Last release was {format_relative(last_release_at)}',
        })
    else:
        signals.append({
            'level': LEVEL_OK,
            'code': 'recent_release',
            'message': 'Recent release',
        })

    if archived:
        return signals

    if recent_commits:
        signals.append({
            'level': LEVEL_OK,
            'code': 'actively_maintained',
            'message': 'Repository is actively maintained',
        })
    else:
        signals.append({
            'level': LEVEL_WARNING,
            'code': 'inactive',
            'message': 'Repository does not look actively maintained',
        })

    return signals


class RepositoryEvaluator:
    def __init__(self, client=None):
        self.client = client or GitHubClient()

    def evaluate(self, owner, repo):
        repository = self.client.get_repository(owner, repo)

        with ThreadPoolExecutor(max_workers=3) as pool:
            commit_future = pool.submit(self.client.get_latest_commit, owner, repo)
            releases_future = pool.submit(self.client.get_releases, owner, repo)
            contributors_future = pool.submit(
                self.client.get_contributors_count,
                owner,
                repo,
            )
            last_commit_at = parse_github_datetime(commit_future.result())
            releases = releases_future.result()
            contributors = contributors_future.result()

        published_releases = [
            release
            for release in releases
            if not release.get('draft') and release.get('published_at')
        ]
        last_release = self._last_release(published_releases)
        last_release_at = last_release['published_at'] if last_release else None
        license_data = repository.get('license') or {}
        license_id = license_data.get('spdx_id') or license_data.get('name')
        if license_id == 'NOASSERTION':
            license_id = None

        return {
            'repository': {
                'owner': (repository.get('owner') or {}).get('login'),
                'name': repository.get('name'),
                'full_name': repository.get('full_name'),
                'description': repository.get('description'),
                'html_url': repository.get('html_url'),
                'stars': repository.get('stargazers_count'),
                'forks': repository.get('forks_count'),
                'language': repository.get('language'),
                'license': license_id,
                'archived': repository.get('archived', False),
            },
            'activity': {
                'last_commit_at': last_commit_at,
                'last_release': last_release,
                'releases_last_12_months': self._releases_last_12_months(
                    published_releases,
                ),
            },
            'community': {
                'contributors': contributors,
                'open_issues': repository.get('open_issues_count'),
            },
            'risk_signals': build_risk_signals(
                archived=repository.get('archived', False),
                last_commit_at=last_commit_at,
                last_release_at=last_release_at,
            ),
        }

    def _last_release(self, releases):
        if not releases:
            return None

        latest = releases[0]
        return {
            'name': latest.get('name') or latest.get('tag_name'),
            'published_at': parse_github_datetime(latest.get('published_at')),
        }

    def _releases_last_12_months(self, releases):
        cutoff = datetime.now(timezone.utc) - TWELVE_MONTHS
        count = 0
        for release in releases:
            published_at = parse_github_datetime(release.get('published_at'))
            if published_at and published_at >= cutoff:
                count += 1
        return count
