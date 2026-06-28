import { addVisit } from '../utils/storage.js'

export default function PlaceRow({ place, driveMinFromAnchor, onVisited, accentColor, bgColor }) {
  const mapsUrl = `https://maps.google.com/?q=${place.lat},${place.lng}`

  function handleVisited() {
    addVisit(place.id)
    onVisited?.(place.id)
  }

  return (
    <div style={{
      background: bgColor ?? 'var(--surface)',
      borderRadius: 12,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 17 }}>{place.name}</span>
          <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-sub)' }}>
            {place.category.join('·')}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: accentColor ?? 'var(--primary)' }}>
          ⭐{place.rating}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4 }}>
        {place.address}
      </div>
      {driveMinFromAnchor != null && (
        <div style={{ fontSize: 13, marginTop: 6, color: accentColor ?? 'var(--primary)', fontWeight: 600 }}>
          차로 약 {driveMinFromAnchor}분
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {place.tags.map(t => (
          <span key={t} style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 10,
            background: 'var(--border)', color: 'var(--text-sub)',
          }}>{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {place.phone && (
          <a href={`tel:${place.phone}`} style={{
            flex: 1, textAlign: 'center', padding: '8px 0',
            borderRadius: 8, background: 'var(--border)',
            fontSize: 13, fontWeight: 600,
          }}>📞 전화</a>
        )}
        <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
          flex: 1, textAlign: 'center', padding: '8px 0',
          borderRadius: 8, background: 'var(--border)',
          fontSize: 13, fontWeight: 600,
        }}>🗺 길찾기</a>
        <button
          onClick={handleVisited}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: accentColor ?? 'var(--primary)',
            color: '#fff', fontSize: 13, fontWeight: 600,
          }}
        >다녀옴 ✓</button>
      </div>
    </div>
  )
}
