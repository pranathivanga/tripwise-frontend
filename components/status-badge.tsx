'use client'

type BudgetState =
  | 'NOT_FEASIBLE'
  | 'TIGHT'
  | 'COMFORTABLE'
  | 'LUXURY_POSSIBLE'
  | 'CUSTOM'

interface StatusBadgeProps {
  state: BudgetState
}

const badgeConfig: Record<string, { bg: string; border: string; text: string; label: string }> = {
  NOT_FEASIBLE: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    label: 'Not Feasible'
  },
  TIGHT: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    label: 'Tight Budget'
  },
  COMFORTABLE: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    label: 'Comfortable'
  },
  LUXURY_POSSIBLE: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/50',
    text: 'text-purple-400',
    label: 'Luxury Possible'
  },
  CUSTOM: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    label: 'Custom Plan'
  }
}

export default function StatusBadge({ state }: StatusBadgeProps) {
  const config = badgeConfig[state] ?? badgeConfig.COMFORTABLE

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full ${config.bg} border ${config.border}`}>
      <span className={`text-sm font-semibold ${config.text}`}>
        Budget State: {config.label}
      </span>
    </div>
  )
}