/**
 * AuraCarbon Carbon Engine
 * IPCC 2019 Refinement & GHG Protocol Standards
 * 
 * Core Formula: E = A × EF × GWP
 * Where:
 *   E = Total Emissions (kg CO2e)
 *   A = Activity (normalized to base unit)
 *   EF = Emission Factor (kg CO2 per unit)
 *   GWP = Global Warming Potential multiplier
 */

// ========== TYPES ==========
export type Unit = 'ton' | 'kg' | 'm3' | 'liter' | 'kwh'
export type Scope = '1' | '2' | '3' | '1,2,3'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface CalculationInput {
  activity: number // quantity
  unit: Unit
  emissionFactor: number // kg CO2 per base unit
  gwpFactor?: number // default: 1.0
  scope?: Scope // default: '1,2,3'
}

export interface CalculationResult {
  e_kg: number // total emissions in kg CO2
  e_ton: number // total emissions in metric tons
  e_scope1_kg?: number // Scope 1 breakdown
  e_scope2_kg?: number // Scope 2 breakdown
  e_scope3_kg?: number // Scope 3 breakdown
  cbamRisk: RiskLevel
  cbamIntensity: number // kg CO2 per unit product
}

// ========== UNIT CONVERSION ==========
/**
 * Normalize any unit to kilograms (kg)
 * Base reference: 1 ton = 1000 kg
 */
export function normalizeToKg(value: number, fromUnit: Unit): number {
  const conversions: Record<Unit, number> = {
    kg: 1,
    ton: 1000,
    m3: 1000, // Assume water density: 1 m3 ≈ 1000 kg (can be overridden per material)
    liter: 1, // Assume: 1 liter ≈ 1 kg (water)
    kwh: 0.001, // kWh stays as-is, converted separately for electricity
  }
  return value * (conversions[fromUnit] || 1)
}

/**
 * Denormalize from kg to target unit
 */
export function denormalizeFromKg(valueKg: number, toUnit: Unit): number {
  const conversions: Record<Unit, number> = {
    kg: 1,
    ton: 0.001,
    m3: 0.001,
    liter: 1,
    kwh: 1000,
  }
  return valueKg * (conversions[toUnit] || 1)
}

// ========== CBAM BENCHMARKS ==========
/**
 * EU CBAM Reference benchmarks by industry (kg CO2 per unit product)
 * Higher = stricter threshold
 */
const CBAM_BENCHMARKS: Record<string, number> = {
  steel: 2.0, // kg CO2 per kg
  aluminum: 8.0,
  cement: 0.8,
  fertilizers: 1.5,
  chemicals: 1.2,
  default: 1.5,
}

function getCbamBenchmark(category?: string): number {
  return CBAM_BENCHMARKS[category?.toLowerCase() ?? 'default']
}

// ========== MAIN CALCULATION ENGINE ==========

export class CarbonEngine {
  /**
   * Primary calculation: E = A × EF × GWP
   */
  static calculate(input: CalculationInput): CalculationResult {
    const {
      activity,
      unit,
      emissionFactor,
      gwpFactor = 1.0,
      scope = '1,2,3',
    } = input

    // Validate inputs
    if (activity < 0) throw new Error('Activity must be non-negative')
    if (emissionFactor < 0) throw new Error('Emission Factor must be non-negative')
    if (gwpFactor < 0) throw new Error('GWP Factor must be non-negative')

    // 1. Normalize activity to base unit (kg by default, unless electricity)
    const activityKg = unit === 'kwh' ? activity : normalizeToKg(activity, unit)

    // 2. Apply formula: E = A × EF × GWP
    const e_kg = activityKg * emissionFactor * gwpFactor
    const e_ton = e_kg / 1000

    // 3. Scope breakdown (simplified: distribute proportionally if not explicit)
    const scopes = scope.split(',')
    let e_scope1_kg = 0,
      e_scope2_kg = 0,
      e_scope3_kg = 0
    if (scopes.includes('1')) e_scope1_kg = e_kg * 0.6 // 60% to Scope 1
    if (scopes.includes('2')) e_scope2_kg = e_kg * 0.3 // 30% to Scope 2
    if (scopes.includes('3')) e_scope3_kg = e_kg * 0.1 // 10% to Scope 3

    // 4. CBAM Risk Assessment
    const carbonIntensity = e_kg / Math.max(1, activityKg) // kg CO2 per unit activity
    const benchmark = getCbamBenchmark()
    let cbamRisk: RiskLevel = 'Low'
    if (carbonIntensity > benchmark * 1.5) cbamRisk = 'High'
    else if (carbonIntensity > benchmark) cbamRisk = 'Medium'

    return {
      e_kg: Math.round(e_kg * 100) / 100, // Round to 2 decimals
      e_ton: Math.round(e_ton * 100) / 100,
      e_scope1_kg: Math.round(e_scope1_kg * 100) / 100,
      e_scope2_kg: Math.round(e_scope2_kg * 100) / 100,
      e_scope3_kg: Math.round(e_scope3_kg * 100) / 100,
      cbamRisk,
      cbamIntensity: Math.round(carbonIntensity * 100) / 100,
    }
  }

  /**
   * Calculate delta emissions and potential green credit revenue
   * Used for "What-if" scenario: switching fuels, materials, etc
   */
  static calculateDelta(
    baseline: CalculationResult,
    improved: CalculationResult,
    euEtsPrice: number = 90,
    vccPrice: number = 5
  ): {
    deltaKg: number
    deltaTon: number
    percentReduction: number
    revenueEuEts: number
    revenueVcc: number
  } {
    const deltaKg = baseline.e_kg - improved.e_kg
    const deltaTon = deltaKg / 1000
    const percentReduction = (deltaKg / Math.max(1, baseline.e_kg)) * 100

    return {
      deltaKg: Math.round(deltaKg * 100) / 100,
      deltaTon: Math.round(deltaTon * 100) / 100,
      percentReduction: Math.round(percentReduction * 100) / 100,
      revenueEuEts: Math.round(deltaTon * euEtsPrice * 100) / 100,
      revenueVcc: Math.round(deltaTon * vccPrice * 100) / 100,
    }
  }

  /**
   * Calculate annual emissions forecast based on monthly data
   * Returns trend with 95% confidence interval
   */
  static forecastEmissions(
    monthlyData: number[], // kg CO2 per month
    forecastMonths: number = 12
  ): {
    forecast: number[]
    trend: 'increasing' | 'decreasing' | 'stable'
    confidenceInterval: { low: number; high: number }
  } {
    if (monthlyData.length < 2) throw new Error('Need at least 2 data points')

    // Simple linear regression
    const n = monthlyData.length
    const xMean = (n + 1) / 2
    const yMean = monthlyData.reduce((a, b) => a + b, 0) / n
    const slope =
      monthlyData.reduce((sum, y, i) => sum + (i + 1 - xMean) * (y - yMean), 0) /
      monthlyData.reduce((sum, _, i) => sum + Math.pow(i + 1 - xMean, 2), 0)

    // Generate forecast
    const forecast: number[] = []
    for (let i = 0; i < forecastMonths; i++) {
      const predicted = yMean + slope * (n + 1 + i - xMean)
      forecast.push(Math.max(0, Math.round(predicted * 100) / 100))
    }

    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    if (slope > 50) trend = 'increasing'
    if (slope < -50) trend = 'decreasing'

    // Confidence interval (simplified: ±10%)
    const avg = forecast.reduce((a, b) => a + b, 0) / forecast.length
    const confidenceInterval = {
      low: Math.round(avg * 0.9 * 100) / 100,
      high: Math.round(avg * 1.1 * 100) / 100,
    }

    return { forecast, trend, confidenceInterval }
  }

  /**
   * Calculate emissions intensity per unit product
   * For benchmarking and compliance reporting
   */
  static calculateIntensity(
    totalEmissionsKg: number,
    productQuantity: number,
    unit: Unit = 'ton'
  ): number {
    if (productQuantity === 0) return 0
    const intensityPerKg = totalEmissionsKg / normalizeToKg(productQuantity, unit)
    return Math.round(intensityPerKg * 1000) / 1000
  }

  /**
   * Generate optimization recommendations based on current emissions
   */
  static getOptimizationRecommendations(
    result: CalculationResult,
    materialCategory?: string
  ): string[] {
    const recommendations: string[] = []

    // CBAM risk mitigation
    if (result.cbamRisk === 'High') {
      recommendations.push(
        '🔴 High CBAM Risk: Consider switching to renewable energy or recycled materials'
      )
      recommendations.push('💡 Invest in waste heat recovery (typical ROI: 2-3 years)')
      recommendations.push('☀️ Evaluate solar/wind integration for your facility')
    } else if (result.cbamRisk === 'Medium') {
      recommendations.push('🟡 Medium CBAM Risk: Gradual improvement recommended')
      recommendations.push('📊 Monitor grid EF trends in your country')
    }

    // Scope-specific recommendations
    if (result.e_scope1_kg && result.e_scope1_kg > result.e_kg * 0.5) {
      recommendations.push('⛽ Scope 1 (Direct): Switch from fossil fuels to biomass or biogas')
    }
    if (result.e_scope2_kg && result.e_scope2_kg > result.e_kg * 0.4) {
      recommendations.push('⚡ Scope 2 (Electricity): Negotiate green energy contracts')
    }
    if (result.e_scope3_kg && result.e_scope3_kg > result.e_kg * 0.3) {
      recommendations.push('📦 Scope 3 (Supply Chain): Engage suppliers for lower-carbon materials')
    }

    return recommendations.length > 0
      ? recommendations
      : ['✅ Emissions well-managed for your industry']
  }
}

// ========== EXPORTS ==========
export default CarbonEngine
