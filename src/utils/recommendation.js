import { haversineKm, driveMin, distanceBetween } from './haversine.js'
import { isRecentlyVisited } from './storage.js'

function weightedRandom(items) {
  const weights = items.map(r => r.rating ** 2)
  const total = weights.reduce((a, b) => a + b, 0)
  let rnd = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    rnd -= weights[i]
    if (rnd <= 0) return items[i]
  }
  return items[items.length - 1]
}

function pairCafe(restaurant, cafes) {
  const sameCluster = cafes
    .filter(c => c.cluster === restaurant.cluster)
    .sort((a, b) => distanceBetween(restaurant, a) - distanceBetween(restaurant, b))

  if (sameCluster.length > 0) return sameCluster[0]

  const nearby = cafes
    .filter(c => driveMin(distanceBetween(restaurant, c)) <= 10)
    .sort((a, b) => distanceBetween(restaurant, a) - distanceBetween(restaurant, b))

  return nearby[0] ?? null
}

export function recommend({
  restaurants,
  cafes,
  anchor,
  categories = [],
  driveLimit = 20,
  excludeDays = 14,
  excludeRestaurantId = null,
}) {
  let pool = restaurants.filter(r => {
    const km = haversineKm(anchor.lat, anchor.lng, r.lat, r.lng)
    return driveMin(km) <= driveLimit
  })

  if (categories.length > 0) {
    pool = pool.filter(r => r.category.some(c => categories.includes(c)))
  }

  let filtered = pool.filter(r => !isRecentlyVisited(r.id, excludeDays))
  if (excludeRestaurantId) {
    filtered = filtered.filter(r => r.id !== excludeRestaurantId)
  }

  let usedFallback = false
  if (filtered.length === 0 && pool.length > 0) {
    filtered = pool.filter(r => r.id !== excludeRestaurantId)
    usedFallback = true
  }

  if (filtered.length === 0) {
    return { course: null, warning: '조건에 맞는 식당이 없어요. 필터를 넓혀보세요.' }
  }

  const restaurant = weightedRandom(filtered)
  const cafe = pairCafe(restaurant, cafes)

  const driveMinToRestaurant = driveMin(haversineKm(anchor.lat, anchor.lng, restaurant.lat, restaurant.lng))
  const distMin = cafe
    ? Math.round(distanceBetween(restaurant, cafe) * 1000)
    : null

  return {
    course: { restaurant, cafe, distMin, driveMinToRestaurant },
    warning: usedFallback ? '전부 다녀오셨네요! 방문 기록을 무시하고 추천했어요.' : null,
  }
}
