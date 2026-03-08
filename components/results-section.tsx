'use client'

import { useMemo, useState, useRef } from 'react'
import PlanCard from './plan-card'
import { TripPlan } from '@/types/trip'
import BudgetSliders from './budget-sliders'

interface ResultsSectionProps {
  plans: TripPlan[]
  setPlans: (plans: TripPlan[]) => void
  totalBudget: number
  sourceCity?: string
  destinationCity?: string
  days?: number
  travelers?: number
}

const deriveBudgetState = (plan: TripPlan, budget: number, index: number) => {
  const ratio = plan.totalCost / budget
  if (ratio > 1.0) return 'NOT_FEASIBLE' as const
  if (index === 0) return 'COMFORTABLE' as const
  if (index === 1) {
    return ratio > 0.85 ? 'TIGHT' as const : 'COMFORTABLE' as const
  }
  if (index === 2) {
    if (ratio > 0.95) return 'TIGHT' as const
    if (ratio > 0.75) return 'COMFORTABLE' as const
    return 'LUXURY_POSSIBLE' as const
  }
  return 'COMFORTABLE' as const
}

export default function ResultsSection({
  plans,
  setPlans,
  totalBudget,
  sourceCity = 'Hyderabad',
  destinationCity = 'Goa',
  days = 3,
  travelers = 1
}: ResultsSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(null)
  const [itinerary, setItinerary] = useState<any[] | null>(null)
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [selectError, setSelectError] = useState<string | null>(null)
  const itineraryRef = useRef<HTMLDivElement>(null)
  const plansRef = useRef<HTMLDivElement>(null)

  const enrichedPlans = plans.map((plan, index) => ({
    ...plan,
    budgetState: deriveBudgetState(plan, totalBudget, index)
  }))

  const bestPlanIndex = useMemo(() => {
    return enrichedPlans.findIndex(
      plan => plan.budgetState === 'COMFORTABLE' || plan.budgetState === 'LUXURY_POSSIBLE'
    )
  }, [enrichedPlans])

  const handleSelectPlan = (plan: TripPlan) => {
    setSelectedPlan(plan)
    setSelectError(null)
    setItinerary(null)
  }

  const handleGenerateItinerary = async () => {
    if (!selectedPlan) {
      setSelectError('Please select a plan first.')
      return
    }
    setSelectError(null)
    setItineraryLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/trips/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCity,
          destinationCity,
          days,
          travelers,
          totalBudget: selectedPlan.totalCost,
          planType: selectedPlan.planType
        })
      })
      const data = await response.json()
      setItinerary(data)
      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setSelectError('Failed to generate itinerary. Please try again.')
    } finally {
      setItineraryLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!selectedPlan) return
    setPdfLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/trips/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCity,
          destinationCity,
          days,
          travelers,
          totalBudget: selectedPlan.totalCost,
          planType: selectedPlan.planType
        })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tripwise-plan.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setSelectError('Failed to download PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleRecalculate = () => {
    setSelectedPlan(null)
    setItinerary(null)
    setTimeout(() => {
      plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const dayIcons: Record<number, string> = {
    1: '🛬',
    2: '🏛️',
    3: '🏖️',
    4: '🎯',
    5: '🧳',
  }

  const dayColors: Record<number, { badge: string; border: string }> = {
    1: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', border: 'border-blue-500/20' },
    2: { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', border: 'border-purple-500/20' },
    3: { badge: 'bg-teal-500/20 text-teal-400 border-teal-500/30', border: 'border-teal-500/20' },
    4: { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', border: 'border-orange-500/20' },
    5: { badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30', border: 'border-pink-500/20' },
  }

  return (
    <section className="mt-16 animate-fade-in">
      <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
        Your Customized <span className="gradient-text">Travel Plans</span>
      </h3>

      {/* Plans Grid */}
      <div ref={plansRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
     {enrichedPlans.map((plan, index) => (
  <PlanCard
    key={index}
    plan={plan}
    isBestPlan={index === bestPlanIndex}
    index={index}
    isSelected={selectedPlan?.planType === plan.planType}
    onSelect={handleSelectPlan}
    totalBudget={totalBudget}
  />
))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-4 mb-10">
        {selectError && (
          <p className="text-sm text-red-400 font-medium">{selectError}</p>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
            onClick={handleGenerateItinerary}
            disabled={itineraryLoading}
          >
            {itineraryLoading ? 'Generating...' : '🗺️ Generate Itinerary'}
          </button>

          {itinerary && (
            <button
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Downloading...' : '📄 Download Itinerary PDF'}
            </button>
          )}
        </div>

        {!selectedPlan && (
          <p className="text-xs text-muted-foreground">Select a plan above to generate your itinerary</p>
        )}
      </div>

      {/* Itinerary Section */}
      {itinerary && (
        <div ref={itineraryRef} className="glass-card p-8 rounded-xl border border-glass-light mb-12 animate-fade-in">

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Your <span className="gradient-text">Day-by-Day Itinerary</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              {sourceCity} → {destinationCity} &nbsp;·&nbsp; {days} Days &nbsp;·&nbsp; {travelers} Traveler{travelers > 1 ? 's' : ''} &nbsp;·&nbsp;
              <span className="font-semibold text-accent">
                {selectedPlan?.planType.charAt(0) + (selectedPlan?.planType.slice(1).toLowerCase() ?? '')} Plan
              </span>
              &nbsp;·&nbsp; ₹{selectedPlan?.totalCost.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Cost Summary Strip */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-lg bg-black/20 border border-glass-light">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-400">✈️ Travel</span>
              <span className="font-semibold">₹{selectedPlan?.travelCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400">🏨 Stay</span>
              <span className="font-semibold">₹{selectedPlan?.stayCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-teal-400">🍽️ Food</span>
              <span className="font-semibold">₹{selectedPlan?.foodCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-muted-foreground">|</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-accent font-bold">Total ₹{selectedPlan?.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Day Cards */}
          <div className="space-y-4">
            {itinerary.map((dayPlan: any, i: number) => {
              const dayNum = dayPlan.day ?? i + 1
              const icon = dayIcons[dayNum] ?? '📍'
              const color = dayColors[dayNum] ?? dayColors[1]

              return (
                <div
                  key={i}
                  className={`p-5 rounded-xl bg-glass-light border ${color.border} transition-all duration-200 hover:scale-[1.01]`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{icon}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${color.badge}`}>
                      Day {dayNum}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {dayPlan.description}
                    </span>
                  </div>
                  <div className="ml-11 text-xs text-muted-foreground">
                    Est. daily spend: ₹{Math.round((selectedPlan?.foodCost ?? 0) / days).toLocaleString('en-IN')} food
                    {dayNum === 1 && selectedPlan?.travelCost
                      ? ` + ₹${selectedPlan.travelCost.toLocaleString('en-IN')} travel`
                      : ''}
                    {` + ₹${Math.round((selectedPlan?.stayCost ?? 0) / days).toLocaleString('en-IN')} stay`}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budget Sliders */}
      <div className="mt-12 max-w-4xl mx-auto">
        <BudgetSliders
          totalBudget={plans[0]?.totalCost || totalBudget || 0}
          setPlans={setPlans}
          onRecalculate={handleRecalculate}
        />
      </div>
    </section>
  )
}