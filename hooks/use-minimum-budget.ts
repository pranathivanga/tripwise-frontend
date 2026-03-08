'use client'

import { useState } from 'react'
import { MinimumBudgetResult } from '@/types/trip'

export function useMinimumBudget() {
    const [result, setResult] = useState<MinimumBudgetResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const calculateBudget = async (data: {
        sourceCity: string
        destinationCity: string
        days: number
        travelers: number
    }) => {
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await fetch('http://54.226.116.18:8081/api/trips/minimum-budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceCity: data.sourceCity,
                    destinationCity: data.destinationCity,
                    days: data.days,
                    travelers: data.travelers,
                }),
            })

            if (!response.ok) throw new Error('Backend API request failed')

            const json = await response.json()
            setResult(json)
        } catch (err) {
            console.error(err)
            setError('Failed to calculate minimum budget. Make sure Spring Boot backend is running on http://54.226.116.18:8081/api/trips/plan')
        } finally {
            setLoading(false)
        }
    }

    return {
        result,
        loading,
        error,
        calculateBudget,
    }
}
