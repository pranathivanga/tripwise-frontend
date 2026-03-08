'use client'

import { TripPlan } from '@/types/trip'

interface BudgetBarProps {
  plan: TripPlan
  totalBudget: number
}

export default function BudgetBar({ plan, totalBudget }: BudgetBarProps) {
  const total = plan.travelCost + plan.stayCost + plan.foodCost

  const travelPercent = (plan.travelCost / total) * 100
  const stayPercent = (plan.stayCost / total) * 100
  const foodPercent = (plan.foodCost / total) * 100

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Budget Breakdown
      </p>
      <div className="flex h-3 rounded-full overflow-hidden bg-glass-light border border-glass-light gap-0.5">
        <div
          className="bg-blue-500 transition-all duration-500 hover:brightness-110"
          style={{ width: `${travelPercent}%` }}
          title={`Travel: ₹${plan.travelCost.toLocaleString('en-IN')}`}
        />
        <div
          className="bg-purple-500 transition-all duration-500 hover:brightness-110"
          style={{ width: `${stayPercent}%` }}
          title={`Stay: ₹${plan.stayCost.toLocaleString('en-IN')}`}
        />
        <div
          className="bg-teal-500 transition-all duration-500 hover:brightness-110"
          style={{ width: `${foodPercent}%` }}
          title={`Food: ₹${plan.foodCost.toLocaleString('en-IN')}`}
        />
      </div>
      <div className="flex gap-4 text-xs pt-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">{travelPercent.toFixed(0)}% Travel</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">{stayPercent.toFixed(0)}% Stay</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-muted-foreground">{foodPercent.toFixed(0)}% Food</span>
        </div>
      </div>
    </div>
  )
}