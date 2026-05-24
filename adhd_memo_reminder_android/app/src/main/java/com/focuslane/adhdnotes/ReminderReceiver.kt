package com.focuslane.adhdnotes

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val noteId = intent.getStringExtra(ReminderScheduler.EXTRA_NOTE_ID) ?: return

        val repository = NoteRepository(context)
        val items = repository.loadItems()
        val item = items.firstOrNull { it.id == noteId && it.isActive() } ?: return
        val firedSnapshot = item.copy()

        item.lastAlertAt = NoteItem.nowIso()
        item.updateTimestamp()

        if (item.repeatRule != RepeatRule.NONE) {
            item.remindAt = NoteItem.formatTime(item.nextRepeatTime())
        }

        repository.saveItems(items)

        val scheduler = ReminderScheduler(context)
        scheduler.scheduleAll(items)

        NotificationHelper.ensureChannel(context)
        NotificationHelper.showReminder(context, firedSnapshot)
    }
}
