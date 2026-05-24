package com.focuslane.adhdnotes

import android.Manifest
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.recyclerview.widget.LinearLayoutManager
import com.focuslane.adhdnotes.databinding.ActivityMainBinding
import com.focuslane.adhdnotes.databinding.DialogEditNoteBinding
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var repository: NoteRepository
    private lateinit var scheduler: ReminderScheduler
    private lateinit var adapter: NoteAdapter

    private val items = mutableListOf<NoteItem>()
    private var renderedItems: List<NoteItem> = emptyList()
    private var selectedQuickLane: Lane = Lane.MAIN
    private var selectedFilter: FilterMode = FilterMode.ACTIVE

    private val displayFormatter = DateTimeFormatter.ofPattern("M/d HH:mm", Locale.getDefault())

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (!granted) {
            toast(getString(R.string.notification_permission_hint))
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repository = NoteRepository(applicationContext)
        scheduler = ReminderScheduler(applicationContext)
        NotificationHelper.ensureChannel(this)

        setupRecyclerView()
        setupQuickCapture()
        setupFilters()
        requestNotificationPermissionIfNeeded()
    }

    override fun onResume() {
        super.onResume()
        loadAndRender()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        loadAndRender()
    }

    private fun setupRecyclerView() {
        adapter = NoteAdapter(
            onEdit = { openEditor(it) },
            onDone = { completeItem(it) },
            onRestore = { restoreItem(it) },
            onSnooze = { openSnoozeMenu(it) },
            onMoveToMain = { moveToMain(it) },
        )

        binding.noteList.layoutManager = LinearLayoutManager(this)
        binding.noteList.adapter = adapter
    }

    private fun setupQuickCapture() {
        binding.quickLaneGroup.check(binding.quickLaneMain.id)
        binding.quickLaneGroup.setOnCheckedStateChangeListener { _, checkedIds ->
            selectedQuickLane = when (checkedIds.firstOrNull()) {
                binding.quickLaneMain.id -> Lane.MAIN
                binding.quickLaneRef.id -> Lane.REF
                else -> Lane.PARK
            }
        }

        binding.quickAddButton.setOnClickListener {
            addQuickItem(withCheckpoint = false)
        }
        binding.quickCheckpointButton.setOnClickListener {
            addQuickItem(withCheckpoint = true)
        }
        binding.newNoteFab.setOnClickListener {
            openEditor(null)
        }
    }

    private fun setupFilters() {
        binding.filterChipGroup.check(binding.filterActive.id)
        binding.filterChipGroup.setOnCheckedStateChangeListener { _, checkedIds ->
            selectedFilter = when (checkedIds.firstOrNull()) {
                binding.filterMain.id -> FilterMode.MAIN
                binding.filterRef.id -> FilterMode.REF
                binding.filterPark.id -> FilterMode.PARK
                binding.filterDone.id -> FilterMode.DONE
                binding.filterAll.id -> FilterMode.ALL
                else -> FilterMode.ACTIVE
            }
            render()
        }
    }

    private fun addQuickItem(withCheckpoint: Boolean) {
        val title = binding.quickTitleEdit.text?.toString().orEmpty().trim()
        if (title.isBlank()) {
            toast(getString(R.string.validation_title))
            return
        }

        val reminder = if (withCheckpoint) {
            NoteItem.now().plusMinutes(15)
        } else {
            null
        }

        items.add(
            NoteItem.create(
                title = title,
                details = "",
                lane = selectedQuickLane,
                remindAt = reminder,
                repeatRule = RepeatRule.NONE,
            ),
        )

        binding.quickTitleEdit.setText("")
        persistAndRender()
        toast(
            if (withCheckpoint) {
                getString(R.string.quick_add_checkpoint_done)
            } else {
                getString(R.string.quick_add_done)
            },
        )
    }

    private fun openEditor(existingItem: NoteItem?) {
        val dialogBinding = DialogEditNoteBinding.inflate(layoutInflater)
        val laneOptions = Lane.values().toList()
        val repeatOptions = RepeatRule.values().toList()

        dialogBinding.titleEdit.setText(existingItem?.title.orEmpty())
        dialogBinding.detailsEdit.setText(existingItem?.details.orEmpty())
        dialogBinding.laneSpinner.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_dropdown_item,
            laneOptions.map { getString(it.labelRes) },
        )
        dialogBinding.repeatSpinner.adapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_dropdown_item,
            repeatOptions.map { getString(it.labelRes) },
        )

        dialogBinding.laneSpinner.setSelection(laneOptions.indexOf(existingItem?.lane ?: Lane.MAIN))
        dialogBinding.repeatSpinner.setSelection(
            repeatOptions.indexOf(existingItem?.repeatRule ?: RepeatRule.NONE),
        )

        var selectedReminder = existingItem?.remindAtDateTime()
        renderReminderLabel(dialogBinding, selectedReminder)

        dialogBinding.pickReminderButton.setOnClickListener {
            openDateTimePicker(selectedReminder ?: NoteItem.now().plusMinutes(15)) { picked ->
                selectedReminder = picked
                renderReminderLabel(dialogBinding, selectedReminder)
            }
        }
        dialogBinding.clearReminderButton.setOnClickListener {
            selectedReminder = null
            renderReminderLabel(dialogBinding, selectedReminder)
        }
        dialogBinding.plusFifteenButton.setOnClickListener {
            selectedReminder = NoteItem.now().plusMinutes(15)
            renderReminderLabel(dialogBinding, selectedReminder)
        }
        dialogBinding.tomorrowMorningButton.setOnClickListener {
            val tomorrow = NoteItem.now().plusDays(1)
            selectedReminder = tomorrow.withHour(9).withMinute(0)
            renderReminderLabel(dialogBinding, selectedReminder)
        }

        val dialog = MaterialAlertDialogBuilder(this, R.style.ThemeOverlay_FocusLane_Dialog)
            .setTitle(
                if (existingItem == null) {
                    R.string.dialog_new_title
                } else {
                    R.string.dialog_edit_title
                },
            )
            .setView(dialogBinding.root)
            .setNegativeButton(R.string.action_cancel, null)
            .setPositiveButton(R.string.action_save, null)
            .apply {
                if (existingItem != null) {
                    setNeutralButton(R.string.action_delete, null)
                }
            }
            .create()

        dialog.setOnShowListener {
            dialog.getButton(androidx.appcompat.app.AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val title = dialogBinding.titleEdit.text?.toString().orEmpty().trim()
                if (title.isBlank()) {
                    dialogBinding.titleLayout.error = getString(R.string.validation_title)
                    return@setOnClickListener
                }
                dialogBinding.titleLayout.error = null

                val details = dialogBinding.detailsEdit.text?.toString().orEmpty().trim()
                val lane = laneOptions[dialogBinding.laneSpinner.selectedItemPosition]
                val repeatRule = repeatOptions[dialogBinding.repeatSpinner.selectedItemPosition]

                if (existingItem == null) {
                    items.add(
                        NoteItem.create(
                            title = title,
                            details = details,
                            lane = lane,
                            remindAt = selectedReminder,
                            repeatRule = repeatRule,
                        ),
                    )
                } else {
                    existingItem.title = title
                    existingItem.details = details
                    existingItem.lane = lane
                    existingItem.repeatRule = repeatRule
                    existingItem.remindAt = NoteItem.formatTime(selectedReminder)
                    existingItem.lastAlertAt = null
                    existingItem.updateTimestamp()
                }

                persistAndRender()
                dialog.dismiss()
            }

            if (existingItem != null) {
                dialog.getButton(androidx.appcompat.app.AlertDialog.BUTTON_NEUTRAL).setOnClickListener {
                    MaterialAlertDialogBuilder(this, R.style.ThemeOverlay_FocusLane_Dialog)
                        .setTitle(R.string.delete_confirm_title)
                        .setMessage(getString(R.string.delete_confirm_body, existingItem.title))
                        .setNegativeButton(R.string.action_cancel, null)
                        .setPositiveButton(R.string.action_delete) { _, _ ->
                            scheduler.cancel(existingItem.id)
                            items.removeAll { it.id == existingItem.id }
                            persistAndRender()
                        }
                        .show()
                    dialog.dismiss()
                }
            }
        }

        dialog.show()
    }

    private fun renderReminderLabel(
        dialogBinding: DialogEditNoteBinding,
        selectedReminder: LocalDateTime?,
    ) {
        dialogBinding.reminderValueText.text = if (selectedReminder == null) {
            getString(R.string.no_reminder)
        } else {
            getString(R.string.reminder_at_value, selectedReminder.format(displayFormatter))
        }
    }

    private fun openDateTimePicker(
        initialTime: LocalDateTime,
        onPicked: (LocalDateTime) -> Unit,
    ) {
        val normalized = initialTime.withSecond(0).withNano(0)

        DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                TimePickerDialog(
                    this,
                    { _, hourOfDay, minute ->
                        onPicked(
                            LocalDateTime.of(year, month + 1, dayOfMonth, hourOfDay, minute)
                                .withSecond(0)
                                .withNano(0),
                        )
                    },
                    normalized.hour,
                    normalized.minute,
                    true,
                ).show()
            },
            normalized.year,
            normalized.monthValue - 1,
            normalized.dayOfMonth,
        ).show()
    }

    private fun completeItem(item: NoteItem) {
        val movedToNextCycle = item.completeCycle()
        persistAndRender()
        toast(
            if (movedToNextCycle) {
                getString(R.string.repeat_cycle_done)
            } else {
                getString(R.string.item_done_message)
            },
        )
    }

    private fun restoreItem(item: NoteItem) {
        item.restore()
        persistAndRender()
        toast(getString(R.string.item_restored_message))
    }

    private fun moveToMain(item: NoteItem) {
        item.moveToMain()
        persistAndRender()
        toast(getString(R.string.item_moved_to_main))
    }

    private fun openSnoozeMenu(item: NoteItem) {
        val labels = arrayOf(
            getString(R.string.snooze_5),
            getString(R.string.snooze_15),
            getString(R.string.snooze_30),
            getString(R.string.snooze_tomorrow),
        )

        MaterialAlertDialogBuilder(this, R.style.ThemeOverlay_FocusLane_Dialog)
            .setTitle(R.string.snooze_dialog_title)
            .setItems(labels) { _, index ->
                when (index) {
                    0 -> item.snooze(5)
                    1 -> item.snooze(15)
                    2 -> item.snooze(30)
                    3 -> {
                        val tomorrow = NoteItem.now().plusDays(1)
                        item.remindAt = NoteItem.formatTime(tomorrow.withHour(9).withMinute(0))
                        item.lastAlertAt = null
                        item.updateTimestamp()
                    }
                }
                persistAndRender()
            }
            .show()
    }

    private fun loadAndRender() {
        items.clear()
        items.addAll(repository.loadItems())
        render()
    }

    private fun render() {
        val sorted = sortItems(items)
        val filtered = filterItems(sorted)
        renderedItems = filtered

        renderSummary(sorted)
        adapter.submitItems(filtered)
        binding.emptyStateText.isVisible = filtered.isEmpty()
        scrollToReminderTargetIfNeeded()
    }

    private fun renderSummary(sortedItems: List<NoteItem>) {
        val activeCount = sortedItems.count { it.isActive() }
        val mainCount = sortedItems.count { it.isActive() && it.lane == Lane.MAIN }
        val parkCount = sortedItems.count { it.isActive() && it.lane == Lane.PARK }
        val primaryMain = sortedItems.firstOrNull { it.isActive() && it.lane == Lane.MAIN }
        val nextReminder = sortedItems
            .filter { it.isActive() }
            .mapNotNull { it.remindAtDateTime() }
            .sorted()
            .firstOrNull()

        binding.activeCountValue.text = activeCount.toString()
        binding.mainCountValue.text = mainCount.toString()
        binding.parkCountValue.text = parkCount.toString()
        binding.nextReminderValue.text = if (nextReminder == null) {
            getString(R.string.summary_next_none)
        } else {
            nextReminder.format(displayFormatter)
        }

        binding.nowTaskTitleText.text = primaryMain?.title ?: getString(R.string.now_focus_empty_title)
        binding.nowTaskBodyText.text = when {
            primaryMain == null -> getString(R.string.now_focus_empty_body)
            primaryMain.details.isNotBlank() -> primaryMain.details
            else -> getString(R.string.now_focus_body_fallback)
        }
        binding.nowTaskMetaText.text = primaryMain?.remindAtDateTime()?.let {
            getString(R.string.now_focus_reminder_value, it.format(displayFormatter))
        } ?: getString(R.string.now_focus_no_reminder)

        binding.focusHintText.text = if (mainCount > 3) {
            getString(R.string.main_guard_warning)
        } else {
            getString(R.string.main_guard_ok)
        }
    }

    private fun sortItems(source: List<NoteItem>): List<NoteItem> {
        return source.sortedWith(
            compareBy<NoteItem> { if (it.isActive()) 0 else 1 }
                .thenBy { it.remindAtDateTime() ?: LocalDateTime.MAX }
                .thenBy { laneRank(it.lane) }
                .thenByDescending { it.createdAtDateTime() },
        )
    }

    private fun filterItems(source: List<NoteItem>): List<NoteItem> {
        return when (selectedFilter) {
            FilterMode.ACTIVE -> source.filter { it.isActive() }
            FilterMode.MAIN -> source.filter { it.isActive() && it.lane == Lane.MAIN }
            FilterMode.REF -> source.filter { it.isActive() && it.lane == Lane.REF }
            FilterMode.PARK -> source.filter { it.isActive() && it.lane == Lane.PARK }
            FilterMode.DONE -> source.filter { it.isDone() }
            FilterMode.ALL -> source
        }
    }

    private fun persistAndRender() {
        repository.saveItems(items)
        scheduler.scheduleAll(items)
        render()
    }

    private fun scrollToReminderTargetIfNeeded() {
        val targetId = intent.getStringExtra(ReminderScheduler.EXTRA_NOTE_ID) ?: return
        val index = renderedItems.indexOfFirst { it.id == targetId }
        if (index >= 0) {
            binding.noteList.post {
                binding.noteList.smoothScrollToPosition(index)
            }
            intent.removeExtra(ReminderScheduler.EXTRA_NOTE_ID)
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return
        }
        val granted = ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.POST_NOTIFICATIONS,
        ) == PackageManager.PERMISSION_GRANTED
        if (!granted) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    private fun laneRank(lane: Lane): Int {
        return when (lane) {
            Lane.MAIN -> 0
            Lane.REF -> 1
            Lane.PARK -> 2
        }
    }

    private fun toast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private enum class FilterMode {
        ACTIVE,
        MAIN,
        REF,
        PARK,
        DONE,
        ALL,
    }
}
