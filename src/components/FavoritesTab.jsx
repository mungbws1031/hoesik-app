import { useState } from 'react'
import seedData from '../data/seed_data.json'
import { getFavorites, removeFavorite } from '../utils/storage.js'
import CourseCard from './CourseCard.jsx'

function findById(id, list) { return list.find(p => p.id === id) }

export default function FavoritesTab() {
  const [favs, setFavs] = useState(() => getFavorites())
  const [expanded, setExpanded] = useState(null)

  function handleRemove(id) {
    removeFavorite(id)
    setFavs(getFavorites())
    if (expanded === id) setExpanded(null)
  }

  if (favs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-sub)' }}>
        <div style={{ fontSize: 40 }}>⭐</div>
        <div style={{ marginTop: 12 }}>저장한 코스가 없어요</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>마음에 드는 코스를 저장해보세요!</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 12px', fontWeight: 700, fontSize: 16 }}>즐겨찾기 코스</div>
      {favs.map(fav => {
        const restaurant = findById(fav.restaurantId, seedData.restaurants)
        const cafe = fav.cafeId ? findById(fav.cafeId, seedData.cafes) : null
        if (!restaurant) return null
        const isOpen = expanded === fav.id

        return (
          <div key={fav.id} style={{ marginBottom: 12 }}>
            <div
              onClick={() => setExpanded(isOpen ? null : fav.id)}
              style={{
                margin: '0 16px',
                padding: '14px 16px',
                background: 'var(--surface)',
                borderRadius: 12,
                boxShadow: 'var(--shadow)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{restaurant.name} → {cafe ? cafe.name : '카페 없음'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>
                  {new Date(fav.savedAt).toLocaleDateString('ko-KR')} 저장
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>{isOpen ? '▲' : '▼'}</span>
                <button
                  onClick={e => { e.stopPropagation(); handleRemove(fav.id) }}
                  style={{ fontSize: 18, color: 'var(--text-sub)' }}
                >🗑</button>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 8 }}>
                <CourseCard
                  course={{ restaurant, cafe, distMin: null, driveMinToRestaurant: null }}
                  onVisited={() => {}}
                  onSaved={() => {}}
                  onRedraw={() => {}}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
