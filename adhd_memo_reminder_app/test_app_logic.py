"""Small logic tests for the ADHD memo reminder app."""

from datetime import datetime
import unittest

from app import complete_reminder_cycle, due_now, next_repeat_time, parse_user_datetime


class AppLogicTests(unittest.TestCase):
    def test_parse_time_only_rolls_to_next_day_when_needed(self) -> None:
        base = datetime(2026, 4, 22, 18, 0)
        parsed = parse_user_datetime("09:30", base_time=base)
        self.assertEqual(parsed, datetime(2026, 4, 23, 9, 30))

    def test_parse_full_datetime(self) -> None:
        parsed = parse_user_datetime("2026-04-22 21:15")
        self.assertEqual(parsed, datetime(2026, 4, 22, 21, 15))

    def test_weekday_repeat_skips_weekend(self) -> None:
        friday = datetime(2026, 4, 24, 10, 0)
        next_time = next_repeat_time(friday, "weekdays")
        self.assertEqual(next_time, datetime(2026, 4, 27, 10, 0))

    def test_due_now_when_last_alert_is_older_than_reminder(self) -> None:
        item = {
            "status": "active",
            "remind_at": "2026-04-22T10:00",
            "last_alert_at": "2026-04-22T09:00",
        }
        self.assertTrue(due_now(item, datetime(2026, 4, 22, 10, 5)))

    def test_due_now_when_same_reminder_already_alerted(self) -> None:
        item = {
            "status": "active",
            "remind_at": "2026-04-22T10:00",
            "last_alert_at": "2026-04-22T10:00",
        }
        self.assertFalse(due_now(item, datetime(2026, 4, 22, 10, 5)))

    def test_complete_repeating_cycle_keeps_item_active(self) -> None:
        item = {
            "title": "매일 약 먹기",
            "status": "active",
            "repeat": "daily",
            "remind_at": "2026-04-22T10:00",
            "last_alert_at": "2026-04-22T10:00",
            "completed_at": "",
        }
        message = complete_reminder_cycle(item)
        self.assertEqual(message, "다음 반복으로 이동: 매일 약 먹기")
        self.assertEqual(item["status"], "active")
        self.assertEqual(item["remind_at"], "2026-04-23T10:00")


if __name__ == "__main__":
    unittest.main()
