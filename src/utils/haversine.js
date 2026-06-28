const R = 6371 // km

export function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function driveMin(km, speedKmh = 25) {
  return Math.ceil((km / speedKmh) * 60 * 10) / 10
}

export function distanceBetween(p1, p2) {
  return haversineKm(p1.lat, p1.lng, p2.lat, p2.lng)
}
