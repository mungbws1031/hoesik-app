package com.focuslane.adhdnotes

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.focuslane.adhdnotes.databinding.ItemNoteBinding
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class NoteAdapter(
    private val onEdit: (NoteItem) -> Unit,
    private val onDone: (NoteItem) -> Unit,
    private val onRestore: (NoteItem) -> Unit,
    private val onSnooze: (NoteItem) -> Unit,
    private val onMoveToMain: (NoteItem) -> Unit,
) : RecyclerView.Adapter<NoteAdapter.NoteViewHolder>() {

    private val items = mutableListOf<NoteItem>()
    private val reminderFormatter = DateTimeFormatter.ofPattern("M/d HH:mm", Locale.getDefault())

    fun submitItems(newItems: List<NoteItem>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NoteViewHolder {
        val binding = ItemNoteBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return NoteViewHolder(binding)
    }

    override fun onBindViewHolder(holder: NoteViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class NoteViewHolder(private val binding: ItemNoteBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: NoteItem) {
            val context = binding.root.context
            binding.titleText.text = item.title
            binding.detailsText.text = item.details
            binding.detailsText.isVisible = item.details.isNotBlank()

            binding.metaText.text = buildMeta(item)
            binding.reminderText.text = buildReminder(item)
            binding.statusText.text = if (item.isDone()) {
                context.getString(R.string.status_done)
            } else {
                context.getString(R.string.status_active)
            }

            binding.lanePill.text = context.getString(item.lane.labelRes)
            binding.lanePill.setBackgroundResource(
                when (item.lane) {
                    Lane.MAIN -> R.drawable.bg_lane_main
                    Lane.REF -> R.drawable.bg_lane_ref
                    Lane.PARK -> R.drawable.bg_lane_park
                },
            )

            binding.root.setOnClickListener { onEdit(item) }

            binding.mainButton.isVisible = item.isActive() && item.lane != Lane.MAIN
            binding.mainButton.setOnClickListener { onMoveToMain(item) }

            binding.snoozeButton.isVisible = item.isActive()
            binding.snoozeButton.setOnClickListener { onSnooze(item) }

            binding.doneButton.text = when {
                item.isDone() -> context.getString(R.string.action_restore)
                item.repeatRule != RepeatRule.NONE -> context.getString(R.string.action_complete_cycle)
                else -> context.getString(R.string.action_done)
            }
            binding.doneButton.setOnClickListener {
                if (item.isDone()) {
                    onRestore(item)
                } else {
                    onDone(item)
                }
            }
        }

        private fun buildReminder(item: NoteItem): String {
            val context = binding.root.context
            val reminder = item.remindAtDateTime()
            return when {
                reminder == null -> context.getString(R.string.no_reminder)
                item.isActive() && !reminder.isAfter(LocalDateTime.now()) -> {
                    context.getString(R.string.reminder_due_now)
                }
                else -> context.getString(
                    R.string.reminder_at_value,
                    reminder.format(reminderFormatter),
                )
            }
        }

        private fun buildMeta(item: NoteItem): String {
            val context = binding.root.context
            val repeatLabel = context.getString(item.repeatRule.labelRes)
            return context.getString(
                R.string.note_meta_value,
                context.getString(item.lane.labelRes),
                repeatLabel,
            )
        }
    }
}
