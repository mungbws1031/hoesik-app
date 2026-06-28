const ALL_CATEGORIES = ['고기', '한식', '찌개', '양식', '일식']

export default function FilterBar({ selected, onChange }) {
  function toggle(cat) {
    onChange(
      selected.includes(cat)
        ? selected.filter(c => c !== cat)
        : [...selected, cat]
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 16px' }}>
      {ALL_CATEGORIES.map(cat => {
        const on = selected.includes(cat)
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              background: on ? 'var(--primary)' : 'var(--surface)',
              color: on ? '#fff' : 'var(--text)',
              border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        )
      })}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          style={{ padding: '6px 10px', fontSize: 13, color: 'var(--text-sub)' }}
        >
          전체
        </button>
      )}
    </div>
  )
}
