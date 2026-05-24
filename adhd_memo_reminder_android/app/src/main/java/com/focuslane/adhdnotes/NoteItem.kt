package com.focuslane.adhdnotes

import androidx.annotation.StringRes
import org.json.JSONObject
import java.time.DayOfWeek
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

enum class Lane(val storageKey: String, @StringRes val labelRes: Int) {
    MAIN("main", R.string.lane_main),
    REF("ref", R.string.lane_ref),
    PARK("park", R.string.lane_park),
    ;

    companion object {
        fun fromStorage(value: String?): Lane {
            return values().firstOrNull { it.storageKey == value } ?: PARK
        }
    }
}

enum class RepeatRule(val storageKey: String, @StringRes val labelRes: Int) {
    NONE("none", R.string.repeat_none),
    DAILY("daily", R.string.repeat_daily),
    WEEKDAYS("weekdays", R.string.repeat_weekdays),
    ;

    companion object {
        fun fromStorage(value: String?): RepeatRule {
            return values().firstOrNull { it.storageKey == value } ?: NONE
        }
    }
}

data class NoteItem(
    val id: String,
    var title: String,
    var details: String,
    var lane: Lane,
    var repeatRule: RepeatRule,
    var status: String = STATUS_ACTIVE,
    var remindAt: String? = null,
    var lastAlertAt: String? = null,
    var createdAt: String = nowIso(),
    var updatedAt: String = nowIso(),
    var completedAt: String? = null,
) {
    fun isActive(): Boolean = status == STATUS_ACTIVE

    fun isDone(): Boolean = status == STATUS_DONE

    fun remindAtDateTime(): LocalDateTime? = parseTime(remindAt)

    fun createdAtDateTime(): LocalDateTime = parseTime(createdAt) ?: now()

    fun dueNow(reference: LocalDateTime = now()): Boolean {
        val reminder = remindAtDateTime() ?: return false
        return isActive() && !reminder.isAfter(reference)
    }

    fun updateTimestamp() {
        updatedAt = nowIso()
    }

    fun nextRepeatTime(base: LocalDateTime = remindAtDateTime() ?: now()): LocalDateTime? {
        return when (repeatRule) {
            RepeatRule.NONE -> null
            RepeatRule.DAILY -> base.plusDays(1)
            RepeatRule.WEEKDAYS -> {
                var next = base.plusDays(1)
                while (next.dayOfWeek == DayOfWeek.SATURDAY || next.dayOfWeek == DayOfWeek.SUNDAY) {
                    next = next.plusDays(1)
                }
                next
            }
        }
    }

    fun completeCycle(): Boolean {
        val reminder = remindAtDateTime()
        if (repeatRule != RepeatRule.NONE && reminder != null) {
            status = STATUS_ACTIVE
            completedAt = null
            remindAt = formatTime(nextRepeatTime(reminder))
            lastAlertAt = null
            updateTimestamp()
            return true
        }

        status = STATUS_DONE
        completedAt = nowIso()
        updateTimestamp()
        return false
    }

    fun restore() {
        status = STATUS_ACTIVE
        completedAt = null
        updateTimestamp()
    }

    fun snooze(minutes: Int) {
        val base = remindAtDateTime()?.takeIf { it.isAfter(now()) } ?: now()
        remindAt = formatTime(base.plusMinutes(minutes.toLong()))
        lastAlertAt = null
        updateTimestamp()
    }

    fun moveToMain() {
        lane = Lane.MAIN
        updateTimestamp()
    }

    fun toJson(): JSONObject {
        return JSONObject()
            .put("id", id)
            .put("title", title)
            .put("details", details)
            .put("lane", lane.storageKey)
            .put("repeat", repeatRule.storageKey)
            .put("status", status)
            .put("remind_at", remindAt ?: "")
            .put("last_alert_at", lastAlertAt ?: "")
            .put("created_at", createdAt)
            .put("updated_at", updatedAt)
            .put("completed_at", completedAt ?: "")
    }

    companion object {
        const val STATUS_ACTIVE = "active"
        const val STATUS_DONE = "done"

        private val storageFormatter: DateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

        fun now(): LocalDateTime = LocalDateTime.now().withSecond(0).withNano(0)

        fun nowIso(): String = now().format(storageFormatter)

        fun formatTime(value: LocalDateTime?): String? {
            return value?.withSecond(0)?.withNano(0)?.format(storageFormatter)
        }

        fun parseTime(value: String?): LocalDateTime? {
            if (value.isNullOrBlank()) {
                return null
            }
            return runCatching { LocalDateTime.parse(value, storageFormatter) }.getOrNull()
        }

        fun create(
            title: String,
            details: String,
            lane: Lane,
            remindAt: LocalDateTime?,
            repeatRule: RepeatRule,
        ): NoteItem {
            val timestamp = nowIso()
            return NoteItem(
                id = UUID.randomUUID().toString(),
                title = title.trim(),
                details = details.trim(),
                lane = lane,
                repeatRule = repeatRule,
                remindAt = formatTime(remindAt),
                createdAt = timestamp,
                updatedAt = timestamp,
            )
        }

        fun fromJson(json: JSONObject): NoteItem {
            return NoteItem(
                id = json.optString("id", UUID.randomUUID().toString()),
                title = json.optString("title", ""),
                details = json.optString("details", ""),
                lane = Lane.fromStorage(json.optString("lane")),
                repeatRule = RepeatRule.fromStorage(json.optString("repeat")),
                status = json.optString("status", STATUS_ACTIVE),
                remindAt = json.optString("remind_at", "").ifBlank { null },
                lastAlertAt = json.optString("last_alert_at", "").ifBlank { null },
                createdAt = json.optString("created_at", nowIso()),
                updatedAt = json.optString("updated_at", nowIso()),
                completedAt = json.optString("completed_at", "").ifBlank { null },
            )
        }
    }
}
