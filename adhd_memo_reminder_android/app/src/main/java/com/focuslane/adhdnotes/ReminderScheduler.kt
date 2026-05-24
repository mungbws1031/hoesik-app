package com.focuslane.adhdnotes

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class ReminderScheduler(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    fun scheduleAll(items: List<NoteItem>) {
        items.forEach { item ->
            cancel(item.id)
            schedule(item)
        }
    }

    fun schedule(item: NoteItem) {
        if (!item.isActive()) {
            return
        }

        val reminderTime = item.remindAtDateTime() ?: return
        if (!reminderTime.isAfter(NoteItem.now())) {
            return
        }

        val triggerAtMillis = reminderTime
            .atZone(ZoneId.systemDefault())
            .toInstant()
            .toEpochMilli()

        alarmManager.setAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            reminderPendingIntent(item.id),
        )
    }

    fun cancel(noteId: String) {
        val intent = Intent(context, ReminderReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode(noteId),
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE,
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
    }

    private fun reminderPendingIntent(noteId: String): PendingIntent {
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            putExtra(EXTRA_NOTE_ID, noteId)
        }

        return PendingIntent.getBroadcast(
            context,
            requestCode(noteId),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }

    companion object {
        const val EXTRA_NOTE_ID = "extra_note_id"

        fun requestCode(noteId: String): Int = noteId.hashCode()
    }
}

object NotificationHelper {
    private val userFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern("M/d HH:mm")

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channel = NotificationChannel(
            CHANNEL_ID,
            context.getString(R.string.notification_channel_name),
            NotificationManager.IMPORTANCE_DEFAULT,
        ).apply {
            description = context.getString(R.string.notification_channel_description)
        }
        manager.createNotificationChannel(channel)
    }

    fun showReminder(context: Context, item: NoteItem) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val granted = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS,
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
            if (!granted) {
                return
            }
        }

        val openIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(ReminderScheduler.EXTRA_NOTE_ID, item.id)
        }
        val openPendingIntent = PendingIntent.getActivity(
            context,
            ReminderScheduler.requestCode(item.id),
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val reminderLabel = item.remindAtDateTime()?.format(userFormatter)
            ?: context.getString(R.string.no_reminder)

        val bodyText = if (item.details.isNotBlank()) {
            item.details
        } else {
            context.getString(
                R.string.notification_fallback_body,
                context.getString(item.lane.labelRes),
                reminderLabel,
            )
        }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(item.title)
            .setContentText(bodyText)
            .setStyle(NotificationCompat.BigTextStyle().bigText(bodyText))
            .setColor(ContextCompat.getColor(context, R.color.accent_coral))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .setContentIntent(openPendingIntent)
            .build()

        NotificationManagerCompat.from(context).notify(
            ReminderScheduler.requestCode(item.id),
            notification,
        )
    }

    private const val CHANNEL_ID = "focus_lane_reminders"
}
