package com.focuslane.adhdnotes

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class NoteRepository(context: Context) {
    private val dataFile = File(context.filesDir, FILE_NAME)

    fun loadItems(): MutableList<NoteItem> {
        if (!dataFile.exists()) {
            return mutableListOf()
        }

        return runCatching {
            val root = JSONObject(dataFile.readText(Charsets.UTF_8))
            val items = root.optJSONArray("items") ?: JSONArray()
            MutableList(items.length()) { index ->
                NoteItem.fromJson(items.getJSONObject(index))
            }
        }.getOrElse {
            mutableListOf()
        }
    }

    fun saveItems(items: List<NoteItem>) {
        val array = JSONArray()
        items.forEach { item ->
            array.put(item.toJson())
        }

        val root = JSONObject()
            .put("version", 1)
            .put("items", array)

        dataFile.writeText(root.toString(2), Charsets.UTF_8)
    }

    companion object {
        private const val FILE_NAME = "focus_lane_state.json"
    }
}
