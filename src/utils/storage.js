const KEYS = {
  visits: 'hoesik_visits',
  favorites: 'hoesik_favorites',
  anchor: 'hoesik_anchor',
  excludeDays: 'hoesik_excludeDays',
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getVisits() { return load(KEYS.visits, []) }
export function addVisit(placeId, courseId = null) {
  const visits = getVisits()
  visits.push({ placeId, visitedAt: new Date().toISOString(), courseId })
  save(KEYS.visits, visits)
}
export function removeVisit(placeId, visitedAt) {
  save(KEYS.visits, getVisits().filter(v => !(v.placeId === placeId && v.visitedAt === visitedAt)))
}
export function clearVisits() { save(KEYS.visits, []) }

export function isRecentlyVisited(placeId, excludeDays = 14) {
  const cutoff = Date.now() - excludeDays * 86400_000
  return getVisits().some(v => v.placeId === placeId && new Date(v.visitedAt).getTime() >= cutoff)
}

export function getFavorites() { return load(KEYS.favorites, []) }
export function addFavorite(restaurantId, cafeId) {
  const favs = getFavorites()
  const id = `c_${Date.now()}`
  favs.unshift({ id, restaurantId, cafeId, savedAt: new Date().toISOString() })
  save(KEYS.favorites, favs)
  return id
}
export function removeFavorite(id) {
  save(KEYS.favorites, getFavorites().filter(f => f.id !== id))
}

export function getAnchor() {
  return load(KEYS.anchor, { id: 'sejong_cityhall', name: '세종시청', lat: 36.4800, lng: 127.2890 })
}
export function setAnchor(anchor) { save(KEYS.anchor, anchor) }

export function getExcludeDays() { return load(KEYS.excludeDays, 14) }
export function setExcludeDays(days) { save(KEYS.excludeDays, days) }
