import { useState } from 'react'
import MainTab from './components/MainTab.jsx'
import FavoritesTab from './components/FavoritesTab.jsx'
import HistoryTab from './components/HistoryTab.jsx'
import SettingsTab from './components/SettingsTab.jsx'

const TABS = [
  { id: 'main', label: '🎲 뽑기' },
  { id: 'favorites', label: '⭐ 즐겨찾기' },
  { id: 'history', label: '📅 기록' },
  { id: 'settings', label: '⚙ 설정' },
]

export default function App() {
  const [tab, setTab] = useState('main')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 64 }}>
        {tab === 'main' && <MainTab />}
        {tab === 'favorites' && <FavoritesTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        display: 'flex',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        zIndex: 100,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '10px 0 8px',
              fontSize: tab === t.id ? 13 : 12,
              fontWeight: tab === t.id ? 700 : 400,
              color: tab === t.id ? 'var(--primary)' : 'var(--text-sub)',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
