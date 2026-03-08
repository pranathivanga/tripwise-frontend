'use client'

import { useRef } from 'react'
import HeroSection from '@/components/hero-section'
import TripInputPanel from '@/components/trip-input-panel'
import ResultsSection from '@/components/results-section'
import MinimumBudgetCard from '@/components/minimum-budget-card'
import { useTrips } from '@/hooks/use-trips'
import { useMinimumBudget } from '@/hooks/use-minimum-budget'

export default function Home() {
  const { plans, setPlans, tripRequest, loading, error, generatePlans } = useTrips()
  const { result: minimumBudgetResult, loading: budgetLoading, error: budgetError, calculateBudget } = useMinimumBudget()
  const formRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const budgetRef = useRef<HTMLDivElement>(null)

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGeneratePlans = async (params: any) => {
    await generatePlans(params)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  const handleCalculateBudget = async (params: any) => {
    await calculateBudget(params)
    setTimeout(() => {
      budgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">

      <div className="fixed inset-0 -z-10">
        <div className="absolute top-40 left-10 w-96 h-96 bg-glow-purple blur-3xl opacity-20 rounded-full animate-float" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-glow-blue blur-3xl opacity-20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <HeroSection onPlanTrip={handleScrollToForm} />

        <div ref={formRef} className="max-w-6xl mx-auto px-4 py-16">
          <TripInputPanel
            onSubmit={handleGeneratePlans}
            loading={loading}
            onCalculateBudget={handleCalculateBudget}
            budgetLoading={budgetLoading}
          />
          {error && (
            <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}
          {budgetError && (
            <div className="mt-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              {budgetError}
            </div>
          )}
          {minimumBudgetResult && (
            <div ref={budgetRef}>
              <MinimumBudgetCard result={minimumBudgetResult} />
            </div>
          )}
          {plans.length > 0 && tripRequest && (
            <div ref={resultsRef}>
              <ResultsSection
                plans={plans}
                setPlans={setPlans}
                totalBudget={tripRequest.totalBudget}
                sourceCity={tripRequest.sourceCity}
                destinationCity={tripRequest.destinationCity}
                days={tripRequest.days}
                travelers={tripRequest.travelers}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}