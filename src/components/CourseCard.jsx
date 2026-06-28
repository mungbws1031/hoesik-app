import PlaceRow from './PlaceRow.jsx'
import { addFavorite } from '../utils/storage.js'

export default function CourseCard({ course, onVisited, onSaved, onRedraw }) {
  const { restaurant, cafe, distMin, driveMinToRestaurant } = course

  function handleSave() {
    addFavorite(restaurant.id, cafe?.id ?? null)
    onSaved?.()
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      overflow: 'hidden',
      margin: '0 16px',
    }}>
      <div style={{ padding: 4, paddingTop: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
          color: 'var(--primary)', padding: '10px 16px 4px',
        }}>🍽 밥집</div>
        <PlaceRow
          place={restaurant}
          driveMinFromAnchor={driveMinToRestaurant}
          onVisited={onVisited}
          accentColor="var(--primary)"
          bgColor="var(--primary-light)"
        />
      </div>

      {cafe && (
        <div style={{
          textAlign: 'center', padding: '8px 0',
          fontSize: 12, color: 'var(--text-sub)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          ↓ {distMin != null ? `${distMin}m 이동` : '근처 이동'}
        </div>
      )}

      {cafe ? (
        <div style={{ padding: 4, paddingBottom: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            color: 'var(--cafe)', padding: '10px 16px 4px',
          }}>☕ 카페</div>
          <PlaceRow
            place={cafe}
            onVisited={onVisited}
            accentColor="var(--cafe)"
            bgColor="var(--cafe-light)"
          />
        </div>
      ) : (
        <div style={{
          padding: '14px 16px', fontSize: 13, color: 'var(--text-sub)',
          borderTop: '1px solid var(--border)',
        }}>
          ☕ 근처 카페 없음 — 검색 후 이동을 권장해요
        </div>
      )}

      <div style={{
        display: 'flex', gap: 8, padding: 12,
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={onRedraw}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            border: '1.5px solid var(--border)',
            fontSize: 14, fontWeight: 700, color: 'var(--text)',
          }}
        >🔄 다시 뽑기</button>
        <button
          onClick={handleSave}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            background: 'var(--primary)', color: '#fff',
            fontSize: 14, fontWeight: 700,
          }}
        >⭐ 저장</button>
      </div>
    </div>
  )
}
