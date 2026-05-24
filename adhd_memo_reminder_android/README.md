# Focus Lane Android

`Focus Lane` is a local-first Android app for ADHD-friendly notes and reminders.

It keeps the structure simple:

- native Android Views with Kotlin
- local JSON persistence in internal app storage
- no backend
- no database
- no web layer

## What changed from the desktop prototype

- mobile-first layout for Android phones
- stronger visual hierarchy with warm cards and lane chips
- quick capture plus `+15 min` checkpoint flow
- `Main / Ref / Park` filtering
- local reminder notifications with `AlarmManager`
- repeat rules for `none / daily / weekdays`

## Project layout

```text
adhd_memo_reminder_android/
├─ build.gradle.kts
├─ settings.gradle.kts
├─ gradle.properties
└─ app/
   ├─ build.gradle.kts
   └─ src/main/
      ├─ AndroidManifest.xml
      ├─ java/com/focuslane/adhdnotes/
      │  ├─ MainActivity.kt
      │  ├─ NoteAdapter.kt
      │  ├─ NoteItem.kt
      │  ├─ NoteRepository.kt
      │  ├─ ReminderScheduler.kt
      │  ├─ ReminderReceiver.kt
      │  └─ BootReceiver.kt
      └─ res/
         ├─ layout/
         ├─ drawable/
         └─ values/
```

## Open in Android Studio

1. Open `C:\Users\redna\.claude\adhd_memo_reminder_android`
2. Let Android Studio sync Gradle
3. Run the `app` configuration on an emulator or Android phone

## Preview file

- Open `C:\Users\redna\.claude\adhd_memo_reminder_android\preview.html`
- It shows the Android direction as a local static preview with three states:
  - home
  - editor sheet
  - reminder

## Notes

- Reminder data is stored as JSON in the app's internal files directory.
- Repeating reminders automatically schedule the next occurrence after firing.
- One-time reminders stay visible in the list until the user snoozes or marks them done.

## Current limitation in this workspace

This desktop workspace does not currently have Java, Gradle, or the Android SDK installed, so I could not run a full local APK build here.
