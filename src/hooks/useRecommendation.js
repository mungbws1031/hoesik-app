import { useState, useCallback } from 'react'
import seedData from '../data/seed_data.json'
import { recommend } from '../utils/recommendation.js'
import { getAnchor, getExcludeDays } from '../utils/storage.js'

export function useRecommendation() {
  const [course, setCourse] = useState(null)
  const [warning, setWarning] = useState(null)
  const [categories, setCategories] = useState([])
  const [lastRestaurantId, setLastRestaurantId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const draw = useCallback((excludeId = null) => {
    setIsLoading(true)
    setTimeout(() => {
      const result = recommend({
        restaurants: seedData.restaurants,
        cafes: seedData.cafes,
        anchor: getAnchor(),
        categories,
        driveLimit: seedData.meta.defaultDriveLimitMin,
        excludeDays: getExcludeDays(),
        excludeRestaurantId: excludeId,
      })
      setCourse(result.course)
      setWarning(result.warning)
      setLastRestaurantId(result.course?.restaurant?.id ?? null)
      setIsLoading(false)
    }, 300)
  }, [categories])

  const drawNew = useCallback(() => draw(null), [draw])
  const redraw = useCallback(() => draw(lastRestaurantId), [draw, lastRestaurantId])

  return { course, warning, categories, setCategories, drawNew, redraw, isLoading }
}
