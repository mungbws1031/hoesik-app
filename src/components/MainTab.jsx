import { useState } from 'react'
import FilterBar from './FilterBar.jsx'
import CourseCard from './CourseCard.jsx'
import { useRecommendation } from '../hooks/useRecommendation.js'
import { getAnchor } from '../utils/storage.js'

export default function MainTab() {
  const { course, warning, categories, setCategories, drawNew, redraw, isLoading } = useRecommendation()
  const [toast, setToast] = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const anchor = getAnchor()

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{
        padding: '20px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>오늘 회식 🎲</div>
        <div style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 4 }}>
          기준: {anchor.name} · 차로 20분 이내
        </div>
      </div>

      <FilterBar selected={categories} onChange={setCategories} />

      {!course && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <button
            onClick={drawNew}
            disabled={isLoading}
            style={{
              width: '100%', maxWidth: 320,
              padding: '20px 0', borderRadius: 16,
              background: 'var(--primary)', color: '#fff',
              fontSize: 20, fontWeight: 800,
              boxShadow: '0 4px 20px rgba(232,93,38,0.35)',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {isLoading ? '뽑는 중...' : '오늘 회식 뽑기 🎲'}
          </button>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-sub)' }}>
            밥집 + 카페 코스를 한 번에
          </p>
        </div>
      )}

      {warning && (
        <div style={{
          margin: '0 16px 12px',
          padding: '10px 14px', borderRadius: 10,
          background: '#fff8e1', border: '1px solid #ffe082',
          fontSize: 13, color: '#7a5800',
        }}>
          ⚠ {warning}
        </div>
      )}

      {course && !isLoading && (
        <CourseCard
          course={course}
          onVisited={() => showToast('방문 기록에 저장됐어요!')}
          onSaved={() => showToast('즐겨찾기에 저장됐어요! ⭐')}
          onRedraw={redraw}
        />
      )}

      {isLoading && course && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-sub)' }}>
          뽑는 중...
        </div>
      )}

      {course && !isLoading && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={drawNew}
            style={{ fontSize: 13, color: 'var(--text-sub)', padding: '6px 12px' }}
          >
            처음부터 다시 뽑기
          </button>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff',
          padding: '10px 20px', borderRadius: 20,
          fontSize: 14, fontWeight: 600,
          zIndex: 999, whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
