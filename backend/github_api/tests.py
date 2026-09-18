from datetime import datetime
from datetime import timedelta
from datetime import timezone

from django.test import SimpleTestCase

from github_api.evaluation import LEVEL_HIGH_RISK
from github_api.evaluation import LEVEL_OK
from github_api.evaluation import LEVEL_WARNING
from github_api.evaluation import build_risk_signals


class HealthViewTests(SimpleTestCase):
    def test_health_endpoint_returns_ok(self):
        response = self.client.get('/api/health/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})


class RiskSignalTests(SimpleTestCase):
    def test_archived_repository_is_high_risk(self):
        now = datetime.now(timezone.utc)
        signals = build_risk_signals(True, now, now)
        archived = signals[0]

        self.assertEqual(archived['level'], LEVEL_HIGH_RISK)
        self.assertEqual(archived['code'], 'archived')
        self.assertEqual(archived['message'], 'Archived repository')

    def test_stale_release_and_stale_commits_are_warnings(self):
        stale_commit = datetime.now(timezone.utc) - timedelta(days=200)
        stale_release = datetime.now(timezone.utc) - timedelta(days=400)
        signals = {
            signal['code']: signal
            for signal in build_risk_signals(False, stale_commit, stale_release)
        }

        self.assertEqual(signals['stale_commits']['level'], LEVEL_WARNING)
        self.assertEqual(signals['stale_release']['level'], LEVEL_WARNING)
        self.assertEqual(signals['inactive']['level'], LEVEL_WARNING)

    def test_recent_activity_has_no_warnings(self):
        now = datetime.now(timezone.utc)
        signals = build_risk_signals(False, now, now)
        levels = {signal['level'] for signal in signals}
        codes = {signal['code'] for signal in signals}

        self.assertEqual(levels, {LEVEL_OK})
        self.assertEqual(
            codes,
            {
                'not_archived',
                'recent_commits',
                'recent_release',
                'actively_maintained',
            },
        )
