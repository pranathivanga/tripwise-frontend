'use client'

import { Zap, Hotel, UtensilsCrossed, Lightbulb, Wallet } from 'lucide-react'
import { MinimumBudgetResult } from '@/types/trip'

interface MinimumBudgetCardProps {
    result: MinimumBudgetResult
}

export default function MinimumBudgetCard({ result }: MinimumBudgetCardProps) {
    const travelCost = result.travelCost ?? 0
    const stayCost = result.stayCost ?? 0
    const foodCost = result.foodCost ?? 0
    const minimumBudget = result.minimumBudget ?? 0
    const suggestions = result.suggestions ?? []

    return (
        <div className="animate-fade-in-up mt-10">
            <div className="glass-card p-8 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20">
                        <Wallet className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-foreground">Minimum Budget Required</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Estimated minimum budget required for this trip
                        </p>
                    </div>
                </div>

                {/* Amount */}
                <div className="mb-6 pb-6 border-b border-glass-lighter">
                    <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                        ₹{minimumBudget.toLocaleString('en-IN')}
                    </div>
                </div>

                {/* Trip Breakdown */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Trip Breakdown
                    </h4>
                    <div className="space-y-3">
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
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-glass-light border border-glass-lighter">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <h4 className="text-sm font-semibold text-foreground">Suggestions</h4>
                        </div>
                        <ul className="space-y-2">
                            {suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-purple-400 mt-0.5">•</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
