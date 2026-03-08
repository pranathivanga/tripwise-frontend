export type BudgetState = 'NOT_FEASIBLE' | 'TIGHT' | 'COMFORTABLE' | 'LUXURY_POSSIBLE' | 'CUSTOM'

export interface TripPlan {
  planType: 'BUDGET' | 'BALANCED' | 'COMFORT'
  totalCost: number
  travelCost: number
  stayCost: number
  foodCost: number
  budgetState: BudgetState
  explanation: string
}

export interface TripRequest {
  sourceCity: string
  destinationCity: string
  days: number
  travelers: number
  totalBudget: number
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface Itinerary {
  days: ItineraryDay[]
  summary?: string
}

export interface MinimumBudgetResult {
  minimumBudget: number
  travelCost: number
  stayCost: number
  foodCost: number
  suggestions: string[]
}