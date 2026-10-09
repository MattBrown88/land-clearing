import type { ContractorConfig, EstimateOption } from '../config/contractor'

export interface EstimateInput {
  acres: number
  vegetation: string
  clearingType: string
  terrain: string
  access: string
}

export type Impact = 'lighter' | 'standard' | 'adds-time' | 'major'

export interface FactorSummary {
  category: string
  label: string
  impact: Impact
}

export interface Estimate {
  priceLow: number
  priceHigh: number
  daysLow: number
  daysHigh: number
  acres: number
  factors: FactorSummary[]
}

const find = (options: EstimateOption[], id: string) => {
  const option = options.find((o) => o.id === id)
  if (!option) throw new Error(`Unknown option: ${id}`)
  return option
}

const floorTo = (value: number, step: number) => Math.floor(value / step) * step
const ceilTo = (value: number, step: number) => Math.ceil(value / step) * step

/** Translate a hidden multiplier into a customer-friendly description. */
function impactOf(factor: number): Impact {
  if (factor < 0.95) return 'lighter'
  if (factor <= 1.05) return 'standard'
  if (factor <= 1.3) return 'adds-time'
  return 'major'
}

/**
 * Demo pricing model:
 *   machineDays = acres / baseAcresPerDay × vegetation × clearingType × terrain × access
 *   price       = machineDays × baseDayRate + mobilizationFee
 * The result is widened into a range and rounded so it never reads as an exact quote.
 */
export function calculateEstimate(input: EstimateInput, config: ContractorConfig): Estimate {
  const vegetation = find(config.vegetation, input.vegetation)
  const clearingType = find(config.clearingType, input.clearingType)
  const terrain = find(config.terrain, input.terrain)
  const access = find(config.access, input.access)

  const combinedFactor = vegetation.factor * clearingType.factor * terrain.factor * access.factor
  const machineDays = (input.acres / config.baseAcresPerDay) * combinedFactor

  // Machine time, rounded to half days.
  const daysLow = Math.max(0.5, floorTo(machineDays * config.rangeLowFactor, 0.5))
  const daysHigh = Math.max(daysLow + 0.5, ceilTo(machineDays * config.rangeHighFactor, 0.5))

  // Price range.
  const step = config.priceRounding
  const priceFor = (days: number) => days * config.baseDayRate + config.mobilizationFee
  let priceLow = floorTo(priceFor(machineDays * config.rangeLowFactor), step)
  let priceHigh = ceilTo(priceFor(machineDays * config.rangeHighFactor), step)

  priceLow = Math.max(priceLow, config.minimumProjectPrice)
  // Keep a believable spread when the minimum kicks in.
  priceHigh = Math.max(priceHigh, ceilTo(priceLow * 1.2, step))

  return {
    priceLow,
    priceHigh,
    daysLow,
    daysHigh,
    acres: input.acres,
    factors: [
      { category: 'Vegetation', label: vegetation.label, impact: impactOf(vegetation.factor) },
      { category: 'Terrain', label: terrain.label, impact: impactOf(terrain.factor) },
      { category: 'Access', label: access.label, impact: impactOf(access.factor) },
      { category: 'Clearing Type', label: clearingType.label, impact: impactOf(clearingType.factor) },
    ],
  }
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const formatDays = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1))

export const formatDayRange = (low: number, high: number) =>
  `${formatDays(low)}–${formatDays(high)} ${high <= 1 ? 'day' : 'days'}`

export const formatAcres = (acres: number) =>
  `${acres.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${acres === 1 ? 'acre' : 'acres'}`
