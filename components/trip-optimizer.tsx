'use client'

import { TripPlan } from '@/types/trip'
import { Lightbulb } from 'lucide-react'

interface Props {
  plans: TripPlan[]
}

export default function TripOptimizer({ plans }: Props) {
  if (!plans || plans.length === 0) return null

  const budgetPlan = plans.find(p => p.planType === 'BUDGET')
  const balancedPlan = plans.find(p => p.planType === 'BALANCED')
  const comfortPlan = plans.find(p => p.planType === 'COMFORT')

  const suggestions: { icon: string; text: string; highlight?: string }[] = []

  if (comfortPlan && budgetPlan) {
    const savings = Math.round(comfortPlan.totalCost - budgetPlan.totalCost)
    if (savings > 0) {
      suggestions.push({
        icon: '💰',
        text: `The Budget plan saves you`,
        highlight: `₹${savings.toLocaleString('en-IN')} compared to Comfort plan`
      })
    }
  }

  if (budgetPlan && budgetPlan.totalCost > 0) {
    const daySaving = Math.round(budgetPlan.totalCost * 0.15)
    suggestions.push({
      icon: '📅',
      text: `Reducing your trip by 1 day could save approximately`,
      highlight: `₹${daySaving.toLocaleString('en-IN')} in accommodation costs`
    })
  }

  if (balancedPlan && budgetPlan) {
    const diff = Math.round(balancedPlan.totalCost - budgetPlan.totalCost)
    if (diff > 0) {
      suggestions.push({
        icon: '⚖️',
        text: `The Balanced plan offers a middle ground — only`,
        highlight: `₹${diff.toLocaleString('en-IN')} more than Budget`
      })
    }
  }

  suggestions.push({
    icon: '🏨',
    text: 'Booking accommodations 2–3 weeks in advance can reduce hotel costs by',
    highlight: '10–20%'
  })

  suggestions.push({
    icon: '🚂',
    text: 'Opting for train travel instead of flights can significantly reduce your travel cost, especially for distances under 600 km.'
  })

  suggestions.push({
    icon: '🍽️',
    text: 'Mixing local street food with occasional restaurant meals is a great way to experience authentic cuisine while keeping food costs low.'
  })

  const displaySuggestions = suggestions.slice(0, Math.max(3, suggestions.length))

  return (
    <div className="glass-card p-8 rounded-xl border border-glass-light mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Trip Optimizer</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Smart suggestions to help you make the most of your travel budget.
      </p>

      <ul className="space-y-4">
        {displaySuggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-glass-light border border-glass-light">
            <span className="text-lg mt-0.5 flex-shrink-0">{s.icon}</span>
            <span className="text-sm text-foreground leading-relaxed">
              {s.text}{' '}
              {s.highlight && (
                <span className="font-semibold text-accent">{s.highlight}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}