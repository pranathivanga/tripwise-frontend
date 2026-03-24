'use client'

import { useState } from 'react'
import { TripPlan } from '@/types/trip'
import { api } from '@/lib/api'

interface Props {
  totalBudget: number
  setPlans: (plans: TripPlan[]) => void
  onRecalculate?: () => void
}

export default function BudgetSliders({ totalBudget, setPlans, onRecalculate }: Props) {
  const [travelPriority, setTravelPriority] = useState(3)
  const [stayPriority, setStayPriority] = useState(5)
  const [foodPriority, setFoodPriority] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPriority = travelPriority + stayPriority + foodPriority

  const travelCost = Math.round((travelPriority / totalPriority) * totalBudget)
  const stayCost = Math.round((stayPriority / totalPriority) * totalBudget)
  const foodCost = Math.round((foodPriority / totalPriority) * totalBudget)

  const recalculatePlan = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.post<TripPlan | TripPlan[]>('/api/trips/adjust-budget', {
        travelPercent: travelPriority / totalPriority,
        stayPercent: stayPriority / totalPriority,
        foodPercent: foodPriority / totalPriority,
        totalBudget
      })

      setPlans(Array.isArray(result) ? result : [result])
      onRecalculate?.()
    } catch (err) {
      setError('Failed to recalculate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8 rounded-xl border border-glass-light mt-12">
      <h3 className="text-2xl font-bold text-center mb-3">
        Customize Your Travel Priorities
      </h3>

      <p className="text-sm text-muted-foreground text-center mb-8">
        Adjust what matters most for your trip. Increasing a category gives it a larger
        share of your budget. TripWise automatically redistributes the remaining budget.
      </p>

      <div className="space-y-8">
        {/* Travel */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Travel Priority</span>
            <span className="text-blue-400 font-semibold">{travelPriority}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={travelPriority}
            onChange={(e) => setTravelPriority(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values allocate more budget for transport comfort.
          </p>
        </div>

        {/* Stay */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Accommodation Priority</span>
            <span className="text-purple-400 font-semibold">{stayPriority}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={stayPriority}
            onChange={(e) => setStayPriority(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values allow better hotels or longer stays.
          </p>
        </div>

        {/* Food */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Food Priority</span>
            <span className="text-teal-400 font-semibold">{foodPriority}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={foodPriority}
            onChange={(e) => setFoodPriority(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values allocate more budget for dining and experiences.
          </p>
        </div>
      </div>

      {/* Budget Preview */}
      <div className="mt-10 p-4 rounded-lg bg-black/30 border border-glass-light">
        <h4 className="font-semibold mb-3">Live Budget Preview</h4>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-400">✈ Travel</span>
            <span className="font-semibold">₹{travelCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-400">🏨 Accommodation</span>
            <span className="font-semibold">₹{stayCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-teal-400">🍽 Food</span>
            <span className="font-semibold">₹{foodCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-glass-light pt-2 mt-2">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-accent">₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
      )}

      <button
        onClick={recalculatePlan}
        disabled={loading}
        className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors"
      >
        {loading ? 'Recalculating...' : 'Recalculate Plan'}
      </button>
    </div>
  )
}