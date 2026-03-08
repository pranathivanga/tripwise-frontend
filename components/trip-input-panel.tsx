'use client'

import { useState } from 'react'
import { Loader2, Wallet } from 'lucide-react'

interface TripInputPanelProps {
  onSubmit: (data: TripFormData) => Promise<void>
  loading: boolean
  onCalculateBudget: (data: TripFormData) => Promise<void>
  budgetLoading: boolean
}

export interface TripFormData {
  sourceCity: string
  destinationCity: string
  days: number
  travelers: number
  totalBudget: number
}

export default function TripInputPanel({ onSubmit, loading, onCalculateBudget, budgetLoading }: TripInputPanelProps) {
  const [formData, setFormData] = useState<TripFormData>({
    sourceCity: '',
    destinationCity: '',
    days: 3,
    travelers: 1,
    totalBudget: 50000,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'days' || name === 'travelers' || name === 'totalBudget'
        ? parseInt(value) || 0
        : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.sourceCity && formData.destinationCity && formData.days > 0 && formData.travelers > 0) {
      await onSubmit(formData)
    }
  }

  const handleBudgetClick = async () => {
    if (formData.sourceCity && formData.destinationCity && formData.days > 0 && formData.travelers > 0) {
      await onCalculateBudget(formData)
    }
  }

  const anyLoading = loading || budgetLoading

  return (
    <div className="animate-slide-up">
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-8">Plan Your Trip</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cities Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                From City
              </label>
              <input
                type="text"
                name="sourceCity"
                value={formData.sourceCity}
                onChange={handleChange}
                placeholder="e.g., Hyderabad"
                className="glass-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                To City
              </label>
              <input
                type="text"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
                placeholder="e.g., Goa"
                className="glass-input w-full"
                required
              />
            </div>
          </div>

          {/* Trip Details Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Days
              </label>
              <input
                type="number"
                name="days"
                min="1"
                max="30"
                value={formData.days}
                onChange={handleChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Travelers
              </label>
              <input
                type="number"
                name="travelers"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={handleChange}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Budget (₹)
              </label>
              <input
                type="number"
                name="totalBudget"
                min="1000"
                value={formData.totalBudget}
                onChange={handleChange}
                className="glass-input w-full"
              />
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={anyLoading}
              className="flex-1 btn-glow bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Plans...
                </>
              ) : (
                'Generate Smart Plans'
              )}
            </button>

            <button
              type="button"
              disabled={anyLoading}
              onClick={handleBudgetClick}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center gap-2"
            >
              {budgetLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Calculate Minimum Budget
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

