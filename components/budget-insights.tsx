'use client'

import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { TripPlan } from '@/types/trip'

interface BudgetInsightsProps {
  plans: TripPlan[]
  bestPlanIndex: number
}

export default function BudgetInsights({ plans, bestPlanIndex }: BudgetInsightsProps) {
  const [displayedInsights, setDisplayedInsights] = useState<string[]>([])

  useEffect(() => {
    const insights: string[] = []

    if (bestPlanIndex >= 0) {
      const bestPlan = plans[bestPlanIndex]
      insights.push(`Your budget comfortably supports this trip with ${bestPlan.budgetState === 'LUXURY_POSSIBLE' ? 'luxury' : 'comfortable'} options available.`)
    }

    // Check if budget is very tight
    const budgetPlan = plans[0]
    if (budgetPlan && budgetPlan.budgetState === 'TIGHT') {
      insights.push(`Reducing the trip by 1 day could unlock a premium stay option at your budget.`)
    }

    // Check if increasing budget helps
    if (bestPlanIndex < 0 && plans.length > 0) {
      const minNeeded = Math.min(...plans.map(p => p.totalCost))
      const currentBudget = plans[0]?.totalCost || 0
      const increase = Math.ceil((minNeeded - currentBudget) / 1000) * 1000
      if (increase > 0) {
        insights.push(`Increasing budget by ₹${increase.toLocaleString('en-IN')} allows a more comfortable itinerary.`)
      }
    }

    // Add accommodation tip
    insights.push(`Consider booking accommodations in advance to lock in better rates across all plan types.`)

    // Animate insights one by one
    insights.forEach((insight, index) => {
      setTimeout(() => {
        setDisplayedInsights(prev => [...prev, insight])
      }, index * 300)
    })
  }, [plans, bestPlanIndex])

  return (
    <div className="mt-12 glass-card p-8 border border-glass-light">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-teal-500/20 border border-purple-400/30">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <h4 className="text-xl font-bold text-foreground">TripWise Insights</h4>
      </div>

      <div className="space-y-3">
        {displayedInsights.map((insight, index) => (
          <div
            key={index}
            className="flex gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
            <p className="text-foreground leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
