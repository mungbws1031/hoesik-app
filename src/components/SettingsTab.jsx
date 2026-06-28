import { useState } from 'react'
import seedData from '../data/seed_data.json'
import { getAnchor, setAnchor, getExcludeDays, setExcludeDays } from '../utils/storage.js'

export default function SettingsTab() {
  const [anchor, setAnchorState] = useState(() => getAnchor())
  const [excludeDays, setExcludeDaysState] = useState(() => getExcludeDays())

  function handleAnchorChange(preset) {
    setAnchor(preset)
    setAnchorState(preset)
  }
  function handleExcludeDays(days) {
    setExcludeDays(days)
    setExcludeDaysState(days)
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>설정</div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>📍 기준점</div>
        {seedData.anchors.map(a => (
          <button
            key={a.id}
            onClick={() => handleAnchorChange(a)}
            style={{
              display: 'block', width: '100%',
              textAlign: 'left', padding: '12px 16px',
              marginBottom: 8, borderRadius: 10,
              border: `2px solid ${anchor.id === a.id ? 'var(--primary)' : 'var(--border)'}`,
              background: anchor.id === a.id ? 'var(--primary-light)' : 'var(--surface)',
              fontWeight: anchor.id === a.id ? 700 : 400,
              fontSize: 15,
            }}
          >
            {a.name}
            {anchor.id === a.id && <span style={{ marginLeft: 8, color: 'var(--primary)' }}>✓</span>}
          </button>
        ))}
      </div>

      <div>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>🗓 방문 제외 기간</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => handleExcludeDays(d)}
              style={{
                flex: 1, padding: '12px 0',
                borderRadius: 10,
                border: `2px solid ${excludeDays === d ? 'var(--primary)' : 'var(--border)'}`,
                background: excludeDays === d ? 'var(--primary-light)' : 'var(--surface)',
                fontWeight: excludeDays === d ? 700 : 400,
                fontSize: 15, color: excludeDays === d ? 'var(--primary)' : 'var(--text)',
              }}
            >
              {d}일
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 8 }}>
          선택한 기간 내에 다녀온 곳은 추천에서 제외돼요.
        </div>
      </div>
    </div>
  )
}
