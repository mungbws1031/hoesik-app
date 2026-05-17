"""ADHD-friendly memo and reminder desktop app.

Local-first design:
- standard-library only
- JSON file persistence
- simple Tkinter desktop UI
"""

from __future__ import annotations

import json
import sys
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

try:
    import tkinter as tk
    from tkinter import messagebox, ttk
    TK_IMPORT_ERROR = None
except ModuleNotFoundError as exc:
    tk = None
    messagebox = None
    ttk = None
    TK_IMPORT_ERROR = exc


APP_DIR = Path(__file__).parent
DATA_PATH = APP_DIR / "app_state.json"

LANE_LABELS = {
    "main": "Main",
    "ref": "Ref",
    "park": "Park",
}

LANE_HINTS = {
    "main": "지금 하거나 오늘 끝낼 것",
    "ref": "참고 자료나 대기중인 것",
    "park": "지금 말고 나중에 볼 것",
}

REPEAT_LABELS = {
    "none": "없음",
    "daily": "매일",
    "weekdays": "평일",
}

FILTER_LABELS = {
    "active": "활성 메모",
    "main": "Main만",
    "ref": "Ref만",
    "park": "Park만",
    "done": "완료 메모",
    "all": "전체",
}


def now_local() -> datetime:
    """Return the current local datetime."""
    return datetime.now().replace(second=0, microsecond=0)


def now_iso() -> str:
    """Return current local datetime as an ISO string with minute precision."""
    return now_local().isoformat(timespec="minutes")


def default_data() -> dict[str, Any]:
    """Return the initial file structure for a fresh install."""
    return {
        "version": 1,
        "settings": {
            "checkpoint_minutes": 15,
            "snooze_minutes": 5,
        },
        "items": [],
    }


def parse_iso_datetime(value: str) -> datetime | None:
    """Parse ISO-like date strings safely."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def format_user_datetime(value: datetime | None) -> str:
    """Format a datetime for text fields and table cells."""
    if value is None:
        return ""
    return value.strftime("%Y-%m-%d %H:%M")


def parse_user_datetime(text: str, base_time: datetime | None = None) -> datetime | None:
    """Parse user input.

    Accepted formats:
    - blank -> None
    - HH:MM -> today at that time, or tomorrow if it already passed
    - YYYY-MM-DD HH:MM
    """
    cleaned = text.strip()
    if not cleaned:
        return None

    base = base_time or now_local()

    if len(cleaned) == 5 and ":" in cleaned:
        try:
            hour_text, minute_text = cleaned.split(":", maxsplit=1)
            hour = int(hour_text)
            minute = int(minute_text)
            candidate = base.replace(hour=hour, minute=minute)
        except ValueError as exc:
            raise ValueError("알림은 'YYYY-MM-DD HH:MM' 또는 'HH:MM' 형식으로 입력하세요.") from exc
        if candidate < base:
            candidate += timedelta(days=1)
        return candidate

    try:
        return datetime.strptime(cleaned, "%Y-%m-%d %H:%M")
    except ValueError as exc:
        raise ValueError("알림은 'YYYY-MM-DD HH:MM' 또는 'HH:MM' 형식으로 입력하세요.") from exc


def make_item(
    title: str,
    details: str,
    lane: str,
    remind_at: datetime | None,
    repeat: str,
) -> dict[str, Any]:
    """Create a new item dictionary."""
    timestamp = now_iso()
    return {
        "id": str(uuid.uuid4()),
        "title": title.strip(),
        "details": details.strip(),
        "lane": lane,
        "repeat": repeat,
        "status": "active",
        "remind_at": remind_at.isoformat(timespec="minutes") if remind_at else "",
        "last_alert_at": "",
        "created_at": timestamp,
        "updated_at": timestamp,
        "completed_at": "",
    }


def update_item_from_form(
    item: dict[str, Any],
    title: str,
    details: str,
    lane: str,
    remind_at: datetime | None,
    repeat: str,
) -> None:
    """Apply editor field values to an existing item."""
    item["title"] = title.strip()
    item["details"] = details.strip()
    item["lane"] = lane
    item["repeat"] = repeat
    item["remind_at"] = remind_at.isoformat(timespec="minutes") if remind_at else ""
    item["updated_at"] = now_iso()


def next_repeat_time(remind_at: datetime, repeat: str) -> datetime | None:
    """Return the next reminder time for a repeating reminder."""
    if repeat == "none":
        return None
    if repeat == "daily":
        return remind_at + timedelta(days=1)
    if repeat == "weekdays":
        next_time = remind_at + timedelta(days=1)
        while next_time.weekday() >= 5:
            next_time += timedelta(days=1)
        return next_time
    return None


def due_now(item: dict[str, Any], check_time: datetime) -> bool:
    """Return True when an active item should alert right now."""
    if item.get("status") != "active":
        return False
    remind_at = parse_iso_datetime(item.get("remind_at", ""))
    if remind_at is None or remind_at > check_time:
        return False
    last_alert_at = parse_iso_datetime(item.get("last_alert_at", ""))
    return last_alert_at is None or last_alert_at < remind_at


def item_sort_key(item: dict[str, Any]) -> tuple[Any, ...]:
    """Sort active items by urgency and lane."""
    lane_order = {"main": 0, "ref": 1, "park": 2}
    status_order = {"active": 0, "done": 1}
    remind_at = parse_iso_datetime(item.get("remind_at", "")) or datetime.max
    created_at = parse_iso_datetime(item.get("created_at", "")) or datetime.min
    return (
        status_order.get(item.get("status", "active"), 9),
        remind_at,
        lane_order.get(item.get("lane", "park"), 9),
        -created_at.timestamp(),
    )


def summarize_items(items: list[dict[str, Any]]) -> str:
    """Build the top summary sentence."""
    active_items = [item for item in items if item.get("status") == "active"]
    counts = {"main": 0, "ref": 0, "park": 0}
    for item in active_items:
        counts[item.get("lane", "park")] = counts.get(item.get("lane", "park"), 0) + 1

    next_alarm = ""
    remind_times = [
        parse_iso_datetime(item.get("remind_at", ""))
        for item in active_items
        if item.get("remind_at")
    ]
    remind_times = [value for value in remind_times if value is not None]
    if remind_times:
        next_time = min(remind_times)
        next_alarm = f" | 다음 알림 {next_time.strftime('%m-%d %H:%M')}"

    main_warning = ""
    if counts["main"] > 3:
        main_warning = " | Main이 4개 이상입니다"

    return (
        f"활성 메모 {len(active_items)}개"
        f" | Main {counts['main']} | Ref {counts['ref']} | Park {counts['park']}"
        f"{next_alarm}{main_warning}"
    )


def load_data(path: Path) -> dict[str, Any]:
    """Load JSON data from disk or create a default structure."""
    if not path.exists():
        return default_data()

    try:
        loaded = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return default_data()

    data = default_data()
    if isinstance(loaded, dict):
        data["version"] = loaded.get("version", 1)
        data["settings"].update(loaded.get("settings", {}))
        if isinstance(loaded.get("items"), list):
            data["items"] = loaded["items"]
    return data


def save_data(path: Path, data: dict[str, Any]) -> None:
    """Write JSON data to disk."""
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def complete_reminder_cycle(item: dict[str, Any]) -> str:
    """Complete one reminder cycle, keeping repeating items active."""
    repeat = item.get("repeat", "none")
    remind_at = parse_iso_datetime(item.get("remind_at", ""))

    if remind_at is not None and repeat != "none":
        next_time = next_repeat_time(remind_at, repeat)
        item["status"] = "active"
        item["completed_at"] = ""
        item["remind_at"] = next_time.isoformat(timespec="minutes") if next_time else ""
        item["last_alert_at"] = ""
        item["updated_at"] = now_iso()
        return f"다음 반복으로 이동: {item.get('title', '')}"

    item["status"] = "done"
    item["completed_at"] = now_iso()
    item["updated_at"] = now_iso()
    return f"완료 처리: {item.get('title', '')}"


def cli_prompt(label: str, default: str = "") -> str:
    """Prompt in CLI mode with an optional default value."""
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or default


def cli_pick_lane(default: str = "main") -> str:
    """Prompt for a lane in CLI mode."""
    while True:
        lane = cli_prompt("분류(main/ref/park)", default).lower()
        if lane in LANE_LABELS:
            return lane
        print("main, ref, park 중 하나를 입력하세요.")


def cli_pick_repeat(default: str = "none") -> str:
    """Prompt for repeat type in CLI mode."""
    while True:
        repeat = cli_prompt("반복(none/daily/weekdays)", default).lower()
        if repeat in REPEAT_LABELS:
            return repeat
        print("none, daily, weekdays 중 하나를 입력하세요.")


def cli_parse_reminder_input(current_text: str = "") -> datetime | None:
    """Prompt for reminder text and parse it."""
    while True:
        reminder_text = cli_prompt("알림(빈칸, HH:MM, YYYY-MM-DD HH:MM)", current_text)
        try:
            return parse_user_datetime(reminder_text) if reminder_text else None
        except ValueError as exc:
            print(exc)


def cli_print_items(items: list[dict[str, Any]], title: str) -> None:
    """Print a simple item table in CLI mode."""
    print()
    print(title)
    print("-" * len(title))
    if not items:
        print("메모가 없습니다.")
        return

    for index, item in enumerate(items, start=1):
        remind_at = format_user_datetime(parse_iso_datetime(item.get("remind_at", ""))) or "-"
        status = "완료" if item.get("status") == "done" else "활성"
        lane = LANE_LABELS.get(item.get("lane", "park"), item.get("lane", "park"))
        print(f"{index}. [{status}] [{lane}] {item.get('title', '')} | 알림 {remind_at}")


def cli_choose_item(items: list[dict[str, Any]], title: str) -> dict[str, Any] | None:
    """Select one item by list number in CLI mode."""
    cli_print_items(items, title)
    if not items:
        return None

    while True:
        raw_value = input("번호를 입력하세요(취소는 Enter): ").strip()
        if not raw_value:
            return None
        if raw_value.isdigit():
            index = int(raw_value)
            if 1 <= index <= len(items):
                return items[index - 1]
        print("목록에 있는 번호를 입력하세요.")


def cli_add_item(data: dict[str, Any]) -> None:
    """Add one item in CLI mode."""
    title = cli_prompt("제목")
    if not title:
        print("제목은 비워둘 수 없습니다.")
        return

    lane = cli_pick_lane("main")
    repeat = cli_pick_repeat("none")
    remind_at = cli_parse_reminder_input("")
    details = cli_prompt("상세 메모", "")

    data["items"].append(make_item(title, details, lane, remind_at, repeat))
    save_data(DATA_PATH, data)
    print("메모를 저장했습니다.")


def cli_edit_item(data: dict[str, Any]) -> None:
    """Edit one item in CLI mode."""
    item = cli_choose_item(sorted(data["items"], key=item_sort_key), "수정할 메모")
    if item is None:
        return

    title = cli_prompt("제목", item.get("title", ""))
    details = cli_prompt("상세 메모", item.get("details", ""))
    lane = cli_pick_lane(item.get("lane", "main"))
    repeat = cli_pick_repeat(item.get("repeat", "none"))
    current_reminder = format_user_datetime(parse_iso_datetime(item.get("remind_at", "")))
    remind_at = cli_parse_reminder_input(current_reminder)

    update_item_from_form(item, title, details, lane, remind_at, repeat)
    save_data(DATA_PATH, data)
    print("메모를 수정했습니다.")


def cli_mark_done(data: dict[str, Any]) -> None:
    """Mark one item as done in CLI mode."""
    active_items = [item for item in data["items"] if item.get("status") == "active"]
    item = cli_choose_item(sorted(active_items, key=item_sort_key), "완료할 메모")
    if item is None:
        return

    item["status"] = "done"
    item["completed_at"] = now_iso()
    item["updated_at"] = now_iso()
    save_data(DATA_PATH, data)
    print("완료 처리했습니다.")


def cli_restore_item(data: dict[str, Any]) -> None:
    """Restore one completed item in CLI mode."""
    done_items = [item for item in data["items"] if item.get("status") == "done"]
    item = cli_choose_item(sorted(done_items, key=item_sort_key), "복원할 메모")
    if item is None:
        return

    item["status"] = "active"
    item["completed_at"] = ""
    item["updated_at"] = now_iso()
    save_data(DATA_PATH, data)
    print("활성 메모로 복원했습니다.")


def cli_snooze_item(data: dict[str, Any]) -> None:
    """Snooze one active item in CLI mode."""
    active_items = [item for item in data["items"] if item.get("status") == "active"]
    item = cli_choose_item(sorted(active_items, key=item_sort_key), "스누즈할 메모")
    if item is None:
        return

    raw_minutes = cli_prompt("몇 분 뒤로 미룰까요", "15")
    if not raw_minutes.isdigit():
        print("숫자로 입력하세요.")
        return

    minutes = int(raw_minutes)
    base = parse_iso_datetime(item.get("remind_at", "")) or now_local()
    new_time = max(now_local(), base) + timedelta(minutes=minutes)
    item["remind_at"] = new_time.isoformat(timespec="minutes")
    item["last_alert_at"] = ""
    item["updated_at"] = now_iso()
    save_data(DATA_PATH, data)
    print(f"{minutes}분 뒤로 미뤘습니다.")


def cli_delete_item(data: dict[str, Any]) -> None:
    """Delete one item in CLI mode."""
    item = cli_choose_item(sorted(data["items"], key=item_sort_key), "삭제할 메모")
    if item is None:
        return

    confirm = cli_prompt("정말 삭제할까요? (y/N)", "n").lower()
    if confirm != "y":
        print("삭제를 취소했습니다.")
        return

    data["items"] = [candidate for candidate in data["items"] if candidate.get("id") != item.get("id")]
    save_data(DATA_PATH, data)
    print("메모를 삭제했습니다.")


def cli_watch_reminders(data: dict[str, Any]) -> None:
    """Watch due reminders in the terminal."""
    print("알림 감시 모드입니다. 종료하려면 Ctrl+C를 누르세요.")
    try:
        while True:
            due_items = sorted(
                [item for item in data["items"] if due_now(item, now_local())],
                key=item_sort_key,
            )
            if due_items:
                for item in due_items:
                    print("\a")
                    print()
                    print("알림")
                    print("----")
                    print(item.get("title", ""))
                    print(item.get("details", "").strip() or "상세 메모 없음")
                    action = cli_prompt("c=완료, 5/15/30=스누즈, t=내일, Enter=5분", "5").lower()
                    if action == "c":
                        print(complete_reminder_cycle(item))
                    elif action == "15":
                        base = parse_iso_datetime(item.get("remind_at", "")) or now_local()
                        item["remind_at"] = (max(now_local(), base) + timedelta(minutes=15)).isoformat(timespec="minutes")
                        item["last_alert_at"] = ""
                    elif action == "30":
                        base = parse_iso_datetime(item.get("remind_at", "")) or now_local()
                        item["remind_at"] = (max(now_local(), base) + timedelta(minutes=30)).isoformat(timespec="minutes")
                        item["last_alert_at"] = ""
                    elif action == "t":
                        tomorrow = now_local() + timedelta(days=1)
                        item["remind_at"] = tomorrow.replace(hour=9, minute=0).isoformat(timespec="minutes")
                        item["last_alert_at"] = ""
                    else:
                        base = parse_iso_datetime(item.get("remind_at", "")) or now_local()
                        item["remind_at"] = (max(now_local(), base) + timedelta(minutes=5)).isoformat(timespec="minutes")
                        item["last_alert_at"] = ""
                    item["updated_at"] = now_iso()
                    save_data(DATA_PATH, data)
            time.sleep(30)
    except KeyboardInterrupt:
        print("\n알림 감시 모드를 종료했습니다.")


def cli_main() -> None:
    """Run a simple CLI fallback when GUI startup is not available."""
    data = load_data(DATA_PATH)

    while True:
        print()
        print("ADHD 메모 및 알림 CLI")
        print("====================")
        print(summarize_items(data["items"]))
        print("1. 목록 보기")
        print("2. 메모 추가")
        print("3. 메모 수정")
        print("4. 완료 처리")
        print("5. 복원")
        print("6. 스누즈")
        print("7. 삭제")
        print("8. 알림 감시")
        print("9. 종료")

        choice = input("선택: ").strip().lower()
        if choice == "1":
            cli_print_items(sorted(data["items"], key=item_sort_key), "전체 메모")
        elif choice == "2":
            cli_add_item(data)
        elif choice == "3":
            cli_edit_item(data)
        elif choice == "4":
            cli_mark_done(data)
        elif choice == "5":
            cli_restore_item(data)
        elif choice == "6":
            cli_snooze_item(data)
        elif choice == "7":
            cli_delete_item(data)
        elif choice == "8":
            cli_watch_reminders(data)
        elif choice == "9":
            save_data(DATA_PATH, data)
            print("앱을 종료합니다.")
            return
        else:
            print("1~9 중 하나를 입력하세요.")


class MemoReminderApp:
    """Simple Tkinter app for notes, reminders, and gentle ADHD scaffolding."""

    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("ADHD 메모 및 알림")
        self.root.geometry("1200x760")
        self.root.minsize(1080, 680)

        self.data = load_data(DATA_PATH)
        self.items = self.data["items"]
        self.selected_item_id: str | None = None
        self.reminder_popup: tk.Toplevel | None = None
        self.reminder_job: str | None = None

        self.quick_title_var = tk.StringVar()
        self.quick_lane_var = tk.StringVar(value="main")
        self.quick_reminder_var = tk.StringVar()
        self.filter_var = tk.StringVar(value="active")

        self.title_var = tk.StringVar()
        self.lane_var = tk.StringVar(value="main")
        self.repeat_var = tk.StringVar(value="none")
        self.reminder_var = tk.StringVar()
        self.status_var = tk.StringVar(value="새 메모를 추가하거나 왼쪽 목록에서 선택하세요.")
        self.summary_var = tk.StringVar()

        self.build_style()
        self.build_layout()
        self.refresh_treeview()
        self.refresh_summary()
        self.schedule_reminder_loop()

    def build_style(self) -> None:
        """Define a calm, readable style."""
        self.root.configure(bg="#f7f3ea")
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Header.TLabel", font=("Malgun Gothic", 18, "bold"), foreground="#263238", background="#f7f3ea")
        style.configure("Section.TLabelframe", background="#fffdf8")
        style.configure("Section.TLabelframe.Label", font=("Malgun Gothic", 10, "bold"), foreground="#37474f", background="#fffdf8")
        style.configure("TLabel", font=("Malgun Gothic", 10), background="#fffdf8")
        style.configure("Hint.TLabel", font=("Malgun Gothic", 9), foreground="#546e7a", background="#f7f3ea")
        style.configure("TButton", font=("Malgun Gothic", 10), padding=6)
        style.configure("TEntry", padding=5)
        style.configure("Treeview", font=("Malgun Gothic", 10), rowheight=28)
        style.configure("Treeview.Heading", font=("Malgun Gothic", 10, "bold"))
        style.map("Treeview", background=[("selected", "#dbe8f5")], foreground=[("selected", "#1d2a33")])

    def build_layout(self) -> None:
        """Create the main window UI."""
        self.root.columnconfigure(0, weight=5)
        self.root.columnconfigure(1, weight=4)
        self.root.rowconfigure(2, weight=1)

        header = tk.Frame(self.root, bg="#f7f3ea", padx=18, pady=14)
        header.grid(row=0, column=0, columnspan=2, sticky="ew")
        header.columnconfigure(0, weight=1)

        ttk.Label(header, text="ADHD 메모 및 알림", style="Header.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(
            header,
            text="빠른 캡처, Main/Ref/Park 분리, 부드러운 스누즈, 짧은 체크포인트 중심",
            style="Hint.TLabel",
        ).grid(row=1, column=0, sticky="w", pady=(4, 0))
        ttk.Label(header, textvariable=self.summary_var, style="Hint.TLabel").grid(row=0, column=1, rowspan=2, sticky="e")

        self.build_quick_capture()
        self.build_left_panel()
        self.build_right_panel()

        status_bar = tk.Frame(self.root, bg="#f7f3ea", padx=18, pady=8)
        status_bar.grid(row=3, column=0, columnspan=2, sticky="ew")
        ttk.Label(status_bar, textvariable=self.status_var, style="Hint.TLabel").pack(anchor="w")

    def build_quick_capture(self) -> None:
        """Create the quick capture section."""
        frame = ttk.LabelFrame(self.root, text="빠른 캡처", style="Section.TLabelframe", padding=14)
        frame.grid(row=1, column=0, columnspan=2, sticky="ew", padx=18, pady=(0, 12))
        frame.columnconfigure(1, weight=1)

        ttk.Label(frame, text="할 일 / 메모").grid(row=0, column=0, sticky="w", padx=(0, 8))
        quick_entry = ttk.Entry(frame, textvariable=self.quick_title_var)
        quick_entry.grid(row=0, column=1, sticky="ew", padx=(0, 10))
        quick_entry.bind("<Return>", lambda _event: self.quick_add())

        ttk.Label(frame, text="분류").grid(row=0, column=2, sticky="w", padx=(0, 8))
        lane_menu = ttk.Combobox(
            frame,
            textvariable=self.quick_lane_var,
            values=list(LANE_LABELS.keys()),
            width=8,
            state="readonly",
        )
        lane_menu.grid(row=0, column=3, sticky="w", padx=(0, 10))

        ttk.Label(frame, text="알림").grid(row=0, column=4, sticky="w", padx=(0, 8))
        reminder_entry = ttk.Entry(frame, textvariable=self.quick_reminder_var, width=18)
        reminder_entry.grid(row=0, column=5, sticky="w", padx=(0, 10))

        ttk.Button(frame, text="바로 추가", command=self.quick_add).grid(row=0, column=6, sticky="ew", padx=(0, 6))
        ttk.Button(frame, text="+15분 체크", command=lambda: self.quick_add(checkpoint_minutes=15)).grid(row=0, column=7, sticky="ew", padx=(0, 6))
        ttk.Button(frame, text="Brain Dump", command=lambda: self.quick_add(force_lane="park")).grid(row=0, column=8, sticky="ew")

        ttk.Label(frame, text="알림은 `18:30` 또는 `2026-04-22 18:30`처럼 입력할 수 있습니다.", style="Hint.TLabel").grid(
            row=1,
            column=0,
            columnspan=9,
            sticky="w",
            pady=(10, 0),
        )

    def build_left_panel(self) -> None:
        """Create the list panel."""
        frame = ttk.LabelFrame(self.root, text="메모 목록", style="Section.TLabelframe", padding=14)
        frame.grid(row=2, column=0, sticky="nsew", padx=(18, 9), pady=(0, 18))
        frame.rowconfigure(1, weight=1)
        frame.columnconfigure(0, weight=1)

        top_bar = tk.Frame(frame, bg="#fffdf8")
        top_bar.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        top_bar.columnconfigure(1, weight=1)

        ttk.Label(top_bar, text="보기").grid(row=0, column=0, sticky="w", padx=(0, 8))
        filter_menu = ttk.Combobox(
            top_bar,
            textvariable=self.filter_var,
            values=list(FILTER_LABELS.keys()),
            width=14,
            state="readonly",
        )
        filter_menu.grid(row=0, column=1, sticky="w")
        filter_menu.bind("<<ComboboxSelected>>", lambda _event: self.refresh_treeview())

        self.tree = ttk.Treeview(
            frame,
            columns=("title", "lane", "reminder", "repeat", "status"),
            show="headings",
            selectmode="browse",
        )
        self.tree.grid(row=1, column=0, sticky="nsew")
        self.tree.bind("<<TreeviewSelect>>", self.on_select_item)

        headings = {
            "title": "제목",
            "lane": "분류",
            "reminder": "알림",
            "repeat": "반복",
            "status": "상태",
        }
        widths = {
            "title": 270,
            "lane": 80,
            "reminder": 135,
            "repeat": 70,
            "status": 70,
        }
        for key, label in headings.items():
            self.tree.heading(key, text=label)
            self.tree.column(key, width=widths[key], anchor="w", stretch=key == "title")

        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=self.tree.yview)
        scrollbar.grid(row=1, column=1, sticky="ns")
        self.tree.configure(yscrollcommand=scrollbar.set)

        button_row = tk.Frame(frame, bg="#fffdf8")
        button_row.grid(row=2, column=0, sticky="ew", pady=(10, 0))
        for index in range(5):
            button_row.columnconfigure(index, weight=1)

        ttk.Button(button_row, text="완료", command=self.mark_selected_done).grid(row=0, column=0, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="복원", command=self.restore_selected).grid(row=0, column=1, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="5분 스누즈", command=lambda: self.snooze_selected(5)).grid(row=0, column=2, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="Main으로", command=self.send_selected_to_main).grid(row=0, column=3, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="삭제", command=self.delete_selected).grid(row=0, column=4, sticky="ew")

    def build_right_panel(self) -> None:
        """Create the detail/editor panel."""
        frame = ttk.LabelFrame(self.root, text="메모 편집", style="Section.TLabelframe", padding=14)
        frame.grid(row=2, column=1, sticky="nsew", padx=(9, 18), pady=(0, 18))
        frame.rowconfigure(6, weight=1)
        frame.columnconfigure(1, weight=1)

        ttk.Label(frame, text="제목").grid(row=0, column=0, sticky="w", padx=(0, 10), pady=(0, 8))
        ttk.Entry(frame, textvariable=self.title_var).grid(row=0, column=1, sticky="ew", pady=(0, 8))

        ttk.Label(frame, text="분류").grid(row=1, column=0, sticky="w", padx=(0, 10), pady=(0, 8))
        lane_menu = ttk.Combobox(
            frame,
            textvariable=self.lane_var,
            values=list(LANE_LABELS.keys()),
            width=10,
            state="readonly",
        )
        lane_menu.grid(row=1, column=1, sticky="w", pady=(0, 8))

        ttk.Label(frame, text="반복").grid(row=2, column=0, sticky="w", padx=(0, 10), pady=(0, 8))
        repeat_menu = ttk.Combobox(
            frame,
            textvariable=self.repeat_var,
            values=list(REPEAT_LABELS.keys()),
            width=10,
            state="readonly",
        )
        repeat_menu.grid(row=2, column=1, sticky="w", pady=(0, 8))

        ttk.Label(frame, text="알림").grid(row=3, column=0, sticky="w", padx=(0, 10), pady=(0, 8))
        ttk.Entry(frame, textvariable=self.reminder_var).grid(row=3, column=1, sticky="ew", pady=(0, 8))

        hint_text = (
            "Main: 지금 해야 할 1~3개\n"
            "Ref: 참고용 / 기다리는 것\n"
            "Park: 생각만 저장하고 당장 안 보는 것"
        )
        ttk.Label(frame, text=hint_text, style="Hint.TLabel").grid(row=4, column=0, columnspan=2, sticky="w", pady=(0, 8))

        ttk.Label(frame, text="상세 메모").grid(row=5, column=0, sticky="nw", padx=(0, 10), pady=(0, 8))
        self.details_text = tk.Text(
            frame,
            wrap="word",
            height=14,
            font=("Malgun Gothic", 10),
            bg="#ffffff",
            fg="#263238",
            relief="solid",
            bd=1,
            padx=8,
            pady=8,
        )
        self.details_text.grid(row=6, column=0, columnspan=2, sticky="nsew")

        button_row = tk.Frame(frame, bg="#fffdf8")
        button_row.grid(row=7, column=0, columnspan=2, sticky="ew", pady=(12, 0))
        for index in range(4):
            button_row.columnconfigure(index, weight=1)

        ttk.Button(button_row, text="저장", command=self.save_current_item).grid(row=0, column=0, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="새 메모", command=self.clear_editor).grid(row=0, column=1, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="+15분 체크", command=lambda: self.set_editor_checkpoint(15)).grid(row=0, column=2, sticky="ew", padx=(0, 6))
        ttk.Button(button_row, text="내일 아침", command=self.set_editor_tomorrow_morning).grid(row=0, column=3, sticky="ew")

    def get_filtered_items(self) -> list[dict[str, Any]]:
        """Return items matching the current filter."""
        filter_name = self.filter_var.get()
        if filter_name == "all":
            return sorted(self.items, key=item_sort_key)
        if filter_name == "done":
            return sorted([item for item in self.items if item.get("status") == "done"], key=item_sort_key)
        if filter_name == "active":
            return sorted([item for item in self.items if item.get("status") == "active"], key=item_sort_key)
        return sorted(
            [
                item
                for item in self.items
                if item.get("status") == "active" and item.get("lane") == filter_name
            ],
            key=item_sort_key,
        )

    def refresh_treeview(self) -> None:
        """Redraw the item list."""
        for item_id in self.tree.get_children():
            self.tree.delete(item_id)

        for item in self.get_filtered_items():
            remind_at = parse_iso_datetime(item.get("remind_at", ""))
            self.tree.insert(
                "",
                "end",
                iid=item["id"],
                values=(
                    item.get("title", ""),
                    LANE_LABELS.get(item.get("lane", "park"), item.get("lane", "")),
                    format_user_datetime(remind_at),
                    REPEAT_LABELS.get(item.get("repeat", "none"), ""),
                    "완료" if item.get("status") == "done" else "활성",
                ),
            )

        if self.selected_item_id and self.tree.exists(self.selected_item_id):
            self.tree.selection_set(self.selected_item_id)
            self.tree.focus(self.selected_item_id)

    def refresh_summary(self) -> None:
        """Update the top summary string and persist data."""
        self.summary_var.set(summarize_items(self.items))
        save_data(DATA_PATH, self.data)

    def find_item(self, item_id: str | None) -> dict[str, Any] | None:
        """Find an item by id."""
        if item_id is None:
            return None
        for item in self.items:
            if item.get("id") == item_id:
                return item
        return None

    def on_select_item(self, _event: object) -> None:
        """Populate the editor with the selected item."""
        selected = self.tree.selection()
        if not selected:
            return
        self.selected_item_id = selected[0]
        item = self.find_item(self.selected_item_id)
        if item is None:
            return
        self.title_var.set(item.get("title", ""))
        self.lane_var.set(item.get("lane", "main"))
        self.repeat_var.set(item.get("repeat", "none"))
        self.reminder_var.set(format_user_datetime(parse_iso_datetime(item.get("remind_at", ""))))
        self.details_text.delete("1.0", tk.END)
        self.details_text.insert("1.0", item.get("details", ""))
        lane_hint = LANE_HINTS.get(item.get("lane", "park"), "")
        self.status_var.set(f"선택됨: {item.get('title', '')} | {lane_hint}")

    def clear_editor(self) -> None:
        """Clear the editor to create a new item."""
        self.selected_item_id = None
        self.title_var.set("")
        self.lane_var.set("main")
        self.repeat_var.set("none")
        self.reminder_var.set("")
        self.details_text.delete("1.0", tk.END)
        self.tree.selection_remove(self.tree.selection())
        self.status_var.set("새 메모 작성 모드입니다.")

    def quick_add(self, checkpoint_minutes: int | None = None, force_lane: str | None = None) -> None:
        """Create a quick item from the capture bar."""
        title = self.quick_title_var.get().strip()
        if not title:
            messagebox.showinfo("빠른 캡처", "짧은 제목을 먼저 입력하세요.")
            return

        lane = force_lane or self.quick_lane_var.get() or "main"
        reminder_text = self.quick_reminder_var.get().strip()
        remind_at = None

        try:
            if checkpoint_minutes is not None:
                remind_at = now_local() + timedelta(minutes=checkpoint_minutes)
            elif reminder_text:
                remind_at = parse_user_datetime(reminder_text)
        except ValueError as exc:
            messagebox.showerror("알림 형식 오류", str(exc))
            return

        repeat = "none"
        item = make_item(title=title, details="", lane=lane, remind_at=remind_at, repeat=repeat)
        self.items.append(item)
        self.quick_title_var.set("")
        self.quick_reminder_var.set("")
        self.selected_item_id = item["id"]
        self.refresh_treeview()
        self.refresh_summary()
        self.tree.selection_set(item["id"])
        self.tree.focus(item["id"])
        self.on_select_item(None)
        self.status_var.set(f"추가됨: {title}")

    def save_current_item(self) -> None:
        """Save changes from the editor."""
        title = self.title_var.get().strip()
        if not title:
            messagebox.showinfo("저장", "제목은 비워둘 수 없습니다.")
            return

        details = self.details_text.get("1.0", tk.END).strip()
        lane = self.lane_var.get() or "main"
        repeat = self.repeat_var.get() or "none"
        reminder_text = self.reminder_var.get().strip()

        try:
            remind_at = parse_user_datetime(reminder_text) if reminder_text else None
        except ValueError as exc:
            messagebox.showerror("알림 형식 오류", str(exc))
            return

        if self.selected_item_id:
            item = self.find_item(self.selected_item_id)
            if item is None:
                messagebox.showerror("저장 실패", "선택한 메모를 찾지 못했습니다.")
                return
            update_item_from_form(item, title, details, lane, remind_at, repeat)
            status_text = f"수정됨: {title}"
        else:
            item = make_item(title, details, lane, remind_at, repeat)
            self.items.append(item)
            self.selected_item_id = item["id"]
            status_text = f"저장됨: {title}"

        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(status_text)

    def mark_selected_done(self) -> None:
        """Mark the selected item as done."""
        item = self.find_item(self.selected_item_id)
        if item is None:
            messagebox.showinfo("완료", "먼저 메모를 선택하세요.")
            return
        item["status"] = "done"
        item["completed_at"] = now_iso()
        item["updated_at"] = now_iso()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(f"완료 처리: {item.get('title', '')}")

    def restore_selected(self) -> None:
        """Restore a completed item back to active."""
        item = self.find_item(self.selected_item_id)
        if item is None:
            messagebox.showinfo("복원", "먼저 메모를 선택하세요.")
            return
        item["status"] = "active"
        item["completed_at"] = ""
        item["updated_at"] = now_iso()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(f"복원됨: {item.get('title', '')}")

    def delete_selected(self) -> None:
        """Delete the selected item permanently."""
        item = self.find_item(self.selected_item_id)
        if item is None:
            messagebox.showinfo("삭제", "먼저 메모를 선택하세요.")
            return

        confirmed = messagebox.askyesno("삭제 확인", f"'{item.get('title', '')}' 메모를 삭제할까요?")
        if not confirmed:
            return

        self.items = [candidate for candidate in self.items if candidate.get("id") != item.get("id")]
        self.data["items"] = self.items
        self.clear_editor()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set("메모를 삭제했습니다.")

    def snooze_selected(self, minutes: int) -> None:
        """Snooze the selected reminder."""
        item = self.find_item(self.selected_item_id)
        if item is None:
            messagebox.showinfo("스누즈", "먼저 메모를 선택하세요.")
            return
        self.snooze_item(item, minutes)
        self.status_var.set(f"{minutes}분 뒤로 미룸: {item.get('title', '')}")

    def send_selected_to_main(self) -> None:
        """Move the selected item to Main."""
        item = self.find_item(self.selected_item_id)
        if item is None:
            messagebox.showinfo("Main 이동", "먼저 메모를 선택하세요.")
            return
        item["lane"] = "main"
        item["updated_at"] = now_iso()
        self.lane_var.set("main")
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(f"Main으로 이동: {item.get('title', '')}")

    def set_editor_checkpoint(self, minutes: int) -> None:
        """Set the editor reminder to a short checkpoint."""
        reminder_time = now_local() + timedelta(minutes=minutes)
        self.reminder_var.set(format_user_datetime(reminder_time))
        self.status_var.set(f"{minutes}분 체크포인트를 넣었습니다.")

    def set_editor_tomorrow_morning(self) -> None:
        """Set the reminder to tomorrow morning at 09:00."""
        tomorrow = now_local() + timedelta(days=1)
        reminder_time = tomorrow.replace(hour=9, minute=0)
        self.reminder_var.set(format_user_datetime(reminder_time))
        self.status_var.set("내일 오전 9시 알림을 넣었습니다.")

    def schedule_reminder_loop(self) -> None:
        """Start the periodic reminder checks."""
        self.check_due_reminders()

    def queue_next_reminder_check(self) -> None:
        """Keep exactly one reminder timer active."""
        if self.reminder_job is not None:
            self.root.after_cancel(self.reminder_job)
        self.reminder_job = self.root.after(30_000, self.check_due_reminders)

    def check_due_reminders(self) -> None:
        """Check for due reminders and open one popup at a time."""
        due_items = sorted(
            [item for item in self.items if due_now(item, now_local())],
            key=item_sort_key,
        )
        if due_items and self.reminder_popup is None:
            self.show_reminder_popup(due_items[0])

        self.refresh_summary()
        self.queue_next_reminder_check()

    def show_reminder_popup(self, item: dict[str, Any]) -> None:
        """Show a reminder popup for one due item."""
        self.reminder_popup = tk.Toplevel(self.root)
        self.reminder_popup.title("부드러운 알림")
        self.reminder_popup.geometry("420x280")
        self.reminder_popup.configure(bg="#fff8e8")
        self.reminder_popup.resizable(False, False)
        self.reminder_popup.attributes("-topmost", True)
        self.reminder_popup.protocol("WM_DELETE_WINDOW", lambda: self.dismiss_popup_with_snooze(item, 5))

        item["last_alert_at"] = now_iso()
        item["updated_at"] = now_iso()
        save_data(DATA_PATH, self.data)

        self.root.bell()

        container = tk.Frame(self.reminder_popup, bg="#fff8e8", padx=20, pady=18)
        container.pack(fill="both", expand=True)

        tk.Label(
            container,
            text="지금 확인할 메모",
            font=("Malgun Gothic", 16, "bold"),
            bg="#fff8e8",
            fg="#263238",
        ).pack(anchor="w")

        tk.Label(
            container,
            text=item.get("title", ""),
            font=("Malgun Gothic", 13, "bold"),
            bg="#fff8e8",
            fg="#37474f",
            wraplength=360,
            justify="left",
        ).pack(anchor="w", pady=(12, 8))

        details = item.get("details", "").strip() or "상세 메모 없음"
        tk.Label(
            container,
            text=details,
            font=("Malgun Gothic", 10),
            bg="#fff8e8",
            fg="#455a64",
            wraplength=360,
            justify="left",
        ).pack(anchor="w", pady=(0, 12))

        button_row = tk.Frame(container, bg="#fff8e8")
        button_row.pack(fill="x", pady=(6, 0))

        ttk.Button(button_row, text="완료", command=lambda: self.complete_from_popup(item)).pack(side="left", padx=(0, 6))
        ttk.Button(button_row, text="5분", command=lambda: self.dismiss_popup_with_snooze(item, 5)).pack(side="left", padx=(0, 6))
        ttk.Button(button_row, text="15분", command=lambda: self.dismiss_popup_with_snooze(item, 15)).pack(side="left", padx=(0, 6))
        ttk.Button(button_row, text="30분", command=lambda: self.dismiss_popup_with_snooze(item, 30)).pack(side="left", padx=(0, 6))
        ttk.Button(button_row, text="내일", command=lambda: self.move_popup_to_tomorrow(item)).pack(side="left")

        ttk.Label(
            container,
            text="창을 그냥 닫으면 5분 뒤 다시 알려줍니다.",
            style="Hint.TLabel",
        ).pack(anchor="w", pady=(14, 0))

    def close_popup(self) -> None:
        """Close the current popup if it exists."""
        if self.reminder_popup is not None and self.reminder_popup.winfo_exists():
            self.reminder_popup.destroy()
        self.reminder_popup = None

    def complete_from_popup(self, item: dict[str, Any]) -> None:
        """Mark the popup item as done."""
        status_text = complete_reminder_cycle(item)
        self.close_popup()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(status_text)
        self.check_due_reminders()

    def dismiss_popup_with_snooze(self, item: dict[str, Any], minutes: int) -> None:
        """Snooze a popup item."""
        self.snooze_item(item, minutes)
        self.close_popup()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(f"{minutes}분 스누즈: {item.get('title', '')}")
        self.check_due_reminders()

    def move_popup_to_tomorrow(self, item: dict[str, Any]) -> None:
        """Move the popup item to tomorrow morning."""
        tomorrow = now_local() + timedelta(days=1)
        item["remind_at"] = tomorrow.replace(hour=9, minute=0).isoformat(timespec="minutes")
        item["last_alert_at"] = ""
        item["updated_at"] = now_iso()
        self.close_popup()
        self.refresh_treeview()
        self.refresh_summary()
        self.status_var.set(f"내일 오전으로 이동: {item.get('title', '')}")
        self.check_due_reminders()

    def snooze_item(self, item: dict[str, Any], minutes: int) -> None:
        """Move a reminder forward by a few minutes."""
        base = parse_iso_datetime(item.get("remind_at", "")) or now_local()
        new_time = max(now_local(), base) + timedelta(minutes=minutes)
        item["remind_at"] = new_time.isoformat(timespec="minutes")
        item["last_alert_at"] = ""
        item["updated_at"] = now_iso()
        self.refresh_treeview()
        self.refresh_summary()


def main() -> None:
    """Launch the desktop app."""
    if "--cli" in sys.argv[1:]:
        cli_main()
        return

    if tk is None:
        print("GUI를 시작할 수 없어 CLI 모드로 전환합니다.")
        print("이유: tkinter를 포함한 Python이 아닙니다.")
        cli_main()
        return

    try:
        root = tk.Tk()
    except Exception as exc:
        print("GUI를 시작할 수 없어 CLI 모드로 전환합니다.")
        print(f"이유: {exc}")
        cli_main()
        return

    MemoReminderApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
