'use client'

import { useState } from 'react'
import { TripPlan, TripRequest } from '@/types/trip'
import { api } from '@/lib/api'

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
      const result = await api.post<{ plans: TripPlan[] }>('/api/trips/plan', {
        sourceCity: data.sourceCity,
        destinationCity: data.destinationCity,
        days: data.days,
        travelers: data.travelers,
        totalBudget: data.totalBudget
      })

      setPlans(result.plans)
      setTripRequest(data)

    } catch (err) {
      console.error(err)
      setError('Failed to fetch plans. Make sure the backend API is reachable.')
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