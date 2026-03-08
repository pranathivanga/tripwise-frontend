'use client'

import { useState } from 'react'
import { TripPlan, TripRequest } from '@/types/trip'

export function useTrips() {
  const [plans, setPlans] = useState<TripPlan[]>([])
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const generatePlans = async (data: TripRequest) => {
    setLoading(true)
    setError('')
    setPlans([])

    try {
      const response = await fetch('http://localhost:8081/api/trips/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCity: data.sourceCity,
          destinationCity: data.destinationCity,
          days: data.days,
          travelers: data.travelers,
          totalBudget: data.totalBudget
        }),
      })

      if (!response.ok) throw new Error('Backend API request failed')

      const result = await response.json()
      setPlans(result.plans)
      setTripRequest(data)

    } catch (err) {
      console.error(err)
      setError('Failed to fetch plans. Make sure Spring Boot backend is running on http://localhost:8081')
    } finally {
      setLoading(false)
    }
  }

  return {
    plans,
    setPlans,
    tripRequest,
    loading,
    error,
    generatePlans,
  }
}