import { useState } from 'react'

export default function App() {
  const [tab, setTab] = useState('main')
  return (
    <div style={{ padding: 24 }}>
      <p>탭: {tab}</p>
      <button onClick={() => setTab('main')}>메인</button>
      <button onClick={() => setTab('favorites')}>즐겨찾기</button>
    </div>
  )
}
