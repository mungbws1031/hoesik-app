import { useState } from 'react'
import seedData from '../data/seed_data.json'
import { getVisits, removeVisit } from '../utils/storage.js'

const allPlaces = [...seedData.restaurants, ...seedData.cafes]
function findById(id) { return allPlaces.find(p => p.id === id) }

export default function HistoryTab() {
  const [visits, setVisits] = useState(() =>
    [...getVisits()].sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt))
  )

  function handleDelete(placeId, visitedAt) {
    removeVisit(placeId, visitedAt)
    setVisits([...getVisits()].sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt)))
  }

  if (visits.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-sub)' }}>
        <div style={{ fontSize: 40 }}>📅</div>
        <div style={{ marginTop: 12 }}>방문 기록이 없어요</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 12px', fontWeight: 700, fontSize: 16 }}>최근 방문 기록</div>
      {visits.map((v, i) => {
        const place = findById(v.placeId)
        if (!place) return null
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            margin: '0 16px 10px',
            padding: '12px 16px',
            background: 'var(--surface)', borderRadius: 12,
            boxShadow: 'var(--shadow)',
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{place.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>
                {place.category.join('·')} · {new Date(v.visitedAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <button
              onClick={() => handleDelete(v.placeId, v.visitedAt)}
              style={{ fontSize: 18, color: 'var(--text-sub)', padding: 4 }}
            >🗑</button>
          </div>
        )
      })}
    </div>
  )
}
