'use client'

import { Zap, Hotel, UtensilsCrossed, Star, CheckCircle } from 'lucide-react'
import BudgetBar from './budget-bar'
import StatusBadge from './status-badge'
import { TripPlan } from '@/types/trip'

interface PlanCardProps {
  plan: TripPlan
  isBestPlan: boolean
  index: number
  isSelected: boolean
  onSelect: (plan: TripPlan) => void
  totalBudget: number
}

const planTitles = {
  BUDGET: 'Budget Plan',
  BALANCED: 'Balanced Plan',
  COMFORT: 'Comfort Plan',
}

const planDescriptions = {
  BUDGET: 'Economy accommodations with careful spending on food and activities.',
  BALANCED: 'Standard accommodations while keeping travel and food costs balanced.',
  COMFORT: 'Premium accommodations with comfortable travel and dining options.',
}

export default function PlanCard({ plan, isBestPlan, index, isSelected, onSelect, totalBudget }: PlanCardProps) {
  const planType = plan.planType as keyof typeof planTitles
  const title = planTitles[planType] || 'Travel Plan'
  const description = planDescriptions[planType] || ''

  const travelCost = plan.travelCost ?? 0
  const stayCost = plan.stayCost ?? 0
  const foodCost = plan.foodCost ?? 0
  const totalCost = plan.totalCost ?? 0
  const savings = totalBudget - totalCost

  return (
    <div
      className={`animate-slide-up hover-lift transition-all duration-300 ${
        isSelected
          ? 'glass-card border-2 border-blue-400/70 shadow-glow-blue scale-105 relative'
          : isBestPlan
          ? 'glass-card border-2 border-purple-400/50 shadow-glow-purple scale-105 relative'
          : 'glass-card border border-glass-light'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {isSelected && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Selected</span>
          </div>
        </div>
      )}

      {!isSelected && isBestPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-sm font-semibold text-white">Recommended</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-xl font-bold text-foreground mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Total Cost */}
        <div className="mb-4 pb-4 border-b border-glass-light">
          <div className="text-4xl font-bold text-accent">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Estimated Trip Cost</p>
        </div>

        {/* Savings from budget */}
        {totalBudget > 0 && (
          <div className={`mb-4 px-4 py-2 rounded-lg flex items-center justify-between ${
            savings >= 0
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <span className="text-xs text-muted-foreground">
              {savings >= 0 ? 'You save from budget' : 'Exceeds budget by'}
            </span>
            <span className={`text-sm font-bold ${savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {savings >= 0 ? '+' : '-'}₹{Math.abs(savings).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="mb-6">
          <StatusBadge state={plan.budgetState} />
        </div>

        {/* Budget Bar */}
   <div className="mb-6">
  <BudgetBar plan={plan} totalBudget={totalBudget} />
</div>

        {/* Cost Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span>Travel</span>
            </div>
            <span className="font-semibold text-foreground">
              ₹{travelCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-purple-400">
              <Hotel className="w-4 h-4" />
              <span>Stay</span>
            </div>
            <span className="font-semibold text-foreground">
              ₹{stayCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-teal-400">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Food</span>
            </div>
            <span className="font-semibold text-foreground">
              ₹{foodCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-lg bg-glass-light border border-glass-light mb-4">
          <p className="text-sm text-foreground leading-relaxed">
            {plan.explanation}
          </p>
        </div>

        {/* Select Plan Button */}
        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isSelected
              ? 'bg-blue-600 text-white cursor-default'
              : 'bg-glass-light border border-glass-light hover:bg-blue-600/20 hover:border-blue-400/50 text-foreground'
          }`}
        >
          {isSelected ? '✓ Plan Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  )
}