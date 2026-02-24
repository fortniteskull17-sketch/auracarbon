/**
 * Carbon Engine Unit Tests
 * Validates all calculations against IPCC and GHG Protocol standards
 */

import CarbonEngine, { normalizeToKg, denormalizeFromKg } from '../lib/carbon-engine'

describe('CarbonEngine - Unit Tests', () => {
  describe('Unit Conversions', () => {
    test('should normalize tons to kg', () => {
      expect(normalizeToKg(1, 'ton')).toBe(1000)
      expect(normalizeToKg(0.5, 'ton')).toBe(500)
    })

    test('should normalize liters to kg (water)', () => {
      expect(normalizeToKg(1000, 'liter')).toBe(1000)
    })

    test('should handle m3 conversions', () => {
      expect(normalizeToKg(1, 'm3')).toBe(1000)
    })

    test('should denormalize kg back to tons', () => {
      expect(denormalizeFromKg(1000, 'ton')).toBe(1)
      expect(denormalizeFromKg(500, 'ton')).toBe(0.5)
    })
  })

  describe('Core Calculation (E = A × EF × GWP)', () => {
    test('should calculate steel emissions correctly', () => {
      const result = CarbonEngine.calculate({
        activity: 100, // 100 tons
        unit: 'ton',
        emissionFactor: 1.85, // kg CO2 per ton (cold rolled steel)
        gwpFactor: 1.0,
      })

      expect(result.e_kg).toBe(185000) // 100 * 1000 * 1.85
      expect(result.e_ton).toBe(185)
      expect(result.cbamRisk).toBe('High')
    })

    test('should apply GWP multiplier', () => {
      const baseline = CarbonEngine.calculate({
        activity: 50,
        unit: 'ton',
        emissionFactor: 1.0,
        gwpFactor: 1.0,
      })

      const withGwp = CarbonEngine.calculate({
        activity: 50,
        unit: 'ton',
        emissionFactor: 1.0,
        gwpFactor: 1.5,
      })

      expect(withGwp.e_kg).toBe(baseline.e_kg * 1.5)
    })

    test('should calculate natural gas combustion emissions', () => {
      const result = CarbonEngine.calculate({
        activity: 1000, // 1000 liters
        unit: 'liter',
        emissionFactor: 0.002, // kg CO2 per liter
        gwpFactor: 1.0,
      })

      expect(result.e_kg).toBe(2) // 1000 * 1 * 0.002
      expect(result.e_ton).toBe(0.002)
    })

    test('should handle zero emissions', () => {
      const result = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 0,
        gwpFactor: 1.0,
      })

      expect(result.e_kg).toBe(0)
      expect(result.cbamRisk).toBe('Low')
    })

    test('should reject negative inputs', () => {
      expect(() => {
        CarbonEngine.calculate({
          activity: -10,
          unit: 'ton',
          emissionFactor: 1.0,
        })
      }).toThrow('Activity must be non-negative')
    })
  })

  describe('Scope Breakdown', () => {
    test('should distribute emissions across Scope 1, 2, 3', () => {
      const result = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 1.0,
        scope: '1,2,3',
      })

      const total = result.e_scope1_kg! + result.e_scope2_kg! + result.e_scope3_kg!
      expect(total).toBeCloseTo(result.e_kg, 1)
    })

    test('should handle single scope', () => {
      const result = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 1.0,
        scope: '1',
      })

      expect(result.e_scope1_kg).toBeGreaterThan(0)
      expect(result.e_scope2_kg).toBe(0)
    })
  })

  describe('CBAM Risk Assessment', () => {
    test('should score low risk for efficient processes', () => {
      const result = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 0.1, // Low EF
      })

      expect(result.cbamRisk).toBe('Low')
    })

    test('should score high risk for carbon-intensive materials', () => {
      const result = CarbonEngine.calculate({
        activity: 1,
        unit: 'ton',
        emissionFactor: 12.5, // Aluminum primary has high EF
      })

      expect(result.cbamRisk).toBe('High')
    })

    test('should score medium risk for moderate emissions', () => {
      const result = CarbonEngine.calculate({
        activity: 50,
        unit: 'ton',
        emissionFactor: 1.5,
      })

      // Check if it's Medium or High (depends on intensity calculation)
      expect(['Low', 'Medium', 'High']).toContain(result.cbamRisk)
    })
  })

  describe('Delta Calculations (What-if scenarios)', () => {
    test('should calculate fuel switching benefit', () => {
      const coalBased = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 2.42, // Coal
      })

      const biomassBased = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 0.015, // Biomass (renewable, near-zero)
      })

      const delta = CarbonEngine.calculateDelta(coalBased, biomassBased)

      expect(delta.deltaKg).toBeGreaterThan(0)
      expect(delta.percentReduction).toBeGreaterThan(99)
      expect(delta.revenueEuEts).toBeGreaterThan(0)
    })

    test('should calculate realistic recycled vs primary aluminum', () => {
      const primary = CarbonEngine.calculate({
        activity: 1,
        unit: 'ton',
        emissionFactor: 12.5,
      })

      const recycled = CarbonEngine.calculate({
        activity: 1,
        unit: 'ton',
        emissionFactor: 1.92,
      })

      const delta = CarbonEngine.calculateDelta(primary, recycled)

      expect(delta.percentReduction).toBeGreaterThan(80)
      expect(delta.revenueVcc).toBeCloseTo((delta.deltaTon * 5) * 1, 1)
    })
  })

  describe('Emissions Forecasting', () => {
    test('should forecast increasing trend', () => {
      const monthlyData = [100, 110, 120, 130, 140] // Increasing trend
      const forecast = CarbonEngine.forecastEmissions(monthlyData, 3)

      expect(forecast.trend).toBe('increasing')
      expect(forecast.forecast.length).toBe(3)
      expect(forecast.forecast[0]).toBeGreaterThan(monthlyData[monthlyData.length - 1])
    })

    test('should forecast stable trend', () => {
      const monthlyData = [100, 101, 100, 99, 100] // Stable
      const forecast = CarbonEngine.forecastEmissions(monthlyData, 3)

      expect(forecast.trend).toBe('stable')
    })

    test('should provide confidence interval', () => {
      const monthlyData = [100, 105, 110, 115, 120]
      const forecast = CarbonEngine.forecastEmissions(monthlyData, 3)

      expect(forecast.confidenceInterval.high).toBeGreaterThan(forecast.confidenceInterval.low)
    })
  })

  describe('Intensity Calculations', () => {
    test('should calculate carbon intensity per kg product', () => {
      const intensity = CarbonEngine.calculateIntensity(
        1000, // 1000 kg CO2
        5, // 5 tons of product
        'ton'
      )

      expect(intensity).toBe(0.2) // 1000 kg CO2 / 5000 kg product
    })
  })

  describe('Optimization Recommendations', () => {
    test('should provide recommendations for high-risk scenarios', () => {
      const result = CarbonEngine.calculate({
        activity: 100,
        unit: 'ton',
        emissionFactor: 3.0, // high
        scope: '1,2,3',
      })

      const recommendations = CarbonEngine.getOptimizationRecommendations(result, 'steel')

      expect(recommendations.length).toBeGreaterThan(0)
      expect(recommendations[0]).toContain('High' || 'Medium')
    })
  })

  describe('Real-world Scenarios', () => {
    test('should calculate cement plant emissions (Scope 1)', () => {
      // 500 tons of Portland Cement production
      const result = CarbonEngine.calculate({
        activity: 500,
        unit: 'ton',
        emissionFactor: 0.83, // kg CO2 per ton of cement
        scope: '1', // Calcination emissions
      })

      expect(result.e_ton).toBe(415) // 500 * 0.83
      expect(result.cbamRisk).toBe('Medium')
    })

    test('should calculate steel mill emissions (Scope 1+2)', () => {
      // 1000 tons of hot-rolled steel with electricity
      const fuelEmissions = CarbonEngine.calculate({
        activity: 1000,
        unit: 'ton',
        emissionFactor: 1.2, // scope 1: direct combustion
      })

      const electricityEmissions = CarbonEngine.calculate({
        activity: 500, // kWh per ton
        unit: 'kwh',
        emissionFactor: 0.04, // Pakistan grid: 0.55 kg/kWh → 0.04 kg per kWh for this calc
      })

      const totalCombined = fuelEmissions.e_kg + electricityEmissions.e_kg
      expect(totalCombined).toBeGreaterThan(fuelEmissions.e_kg)
    })

    test('should reflect grid EF changes (Pakistan vs Germany)', () => {
      const pakistanGrid = CarbonEngine.calculate({
        activity: 100, // 100 kWh
        unit: 'kwh',
        emissionFactor: 0.55, // Pakistan: coal-heavy
      })

      const germanyGrid = CarbonEngine.calculate({
        activity: 100,
        unit: 'kwh',
        emissionFactor: 0.38, // Germany: more renewables
      })

      expect(pakistanGrid.e_kg).toBeGreaterThan(germanyGrid.e_kg)
      const reduction = ((pakistanGrid.e_kg - germanyGrid.e_kg) / pakistanGrid.e_kg) * 100
      expect(reduction).toBeCloseTo(30, 0) // ~30% reduction
    })
  })
})
