import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define 50 common raw materials with their default EF
const MATERIALS = [
  // Steel & Metals
  { name: 'Steel (Cold Rolled)', category: 'Steel', unit: 'ton', ef: 1.85 },
  { name: 'Steel (Hot Rolled)', category: 'Steel', unit: 'ton', ef: 1.78 },
  { name: 'Stainless Steel 304', category: 'Steel', unit: 'ton', ef: 5.92 },
  { name: 'Aluminum (Primary)', category: 'Aluminum', unit: 'ton', ef: 12.5 },
  { name: 'Aluminum (Secondary/Recycled)', category: 'Aluminum', unit: 'ton', ef: 1.92 },
  { name: 'Copper', category: 'Metal', unit: 'ton', ef: 3.5 },
  { name: 'Lead', category: 'Metal', unit: 'ton', ef: 1.2 },
  
  // Cement & Building Materials
  { name: 'Portland Cement', category: 'Cement', unit: 'ton', ef: 0.83 },
  { name: 'Concrete (20 MPa)', category: 'Cement', unit: 'm3', ef: 0.11 },
  { name: 'Brick (fired clay)', category: 'Building Material', unit: 'ton', ef: 0.24 },
  { name: 'Glass (clear)', category: 'Building Material', unit: 'ton', ef: 0.78 },
  
  // Chemicals & Plastics
  { name: 'Polyethylene (LDPE)', category: 'Plastic', unit: 'ton', ef: 2.84 },
  { name: 'Polyethylene Terephthalate (PET)', category: 'Plastic', unit: 'ton', ef: 3.18 },
  { name: 'Polypropylene (PP)', category: 'Plastic', unit: 'ton', ef: 2.75 },
  { name: 'Sodium Hydroxide (NaOH)', category: 'Chemical', unit: 'ton', ef: 0.95 },
  { name: 'Sulfuric Acid', category: 'Chemical', unit: 'ton', ef: 0.15 },
  { name: 'Nitrogen (N)', category: 'Chemical', unit: 'ton', ef: 1.88 },
  { name: 'Phosphate Rock', category: 'Chemical', unit: 'ton', ef: 0.08 },
  
  // Fuels & Energy Sources
  { name: 'Natural Gas (combusted)', category: 'Fuel', unit: 'liter', ef: 0.002 },
  { name: 'Coal (bituminous)', category: 'Fuel', unit: 'ton', ef: 2.42 },
  { name: 'Diesel Oil', category: 'Fuel', unit: 'liter', ef: 0.0027 },
  { name: 'Crude Oil', category: 'Fuel', unit: 'liter', ef: 0.0025 },
  { name: 'LPG (Liquified Petroleum Gas)', category: 'Fuel', unit: 'ton', ef: 3.0 },
  
  // Paper & Pulp
  { name: 'Virgin Pulp', category: 'Paper', unit: 'ton', ef: 1.1 },
  { name: 'Recycled Pulp', category: 'Paper', unit: 'ton', ef: 0.35 },
  { name: 'Printing Paper', category: 'Paper', unit: 'ton', ef: 1.9 },
  
  // Agricultural & Natural
  { name: 'Wheat', category: 'Agricultural', unit: 'ton', ef: 0.89 },
  { name: 'Corn', category: 'Agricultural', unit: 'ton', ef: 0.71 },
  { name: 'Beef (primary production)', category: 'Agricultural', unit: 'ton', ef: 27.0 },
  { name: 'Pork', category: 'Agricultural', unit: 'ton', ef: 12.3 },
  { name: 'Chicken', category: 'Agricultural', unit: 'ton', ef: 6.9 },
  { name: 'Dairy (milk)', category: 'Agricultural', unit: 'ton', ef: 1.28 },
  { name: 'Biomass (wood chips)', category: 'Fuel', unit: 'ton', ef: 0.015 },
  
  // Textiles
  { name: 'Cotton (raw)', category: 'Textile', unit: 'ton', ef: 2.85 },
  { name: 'Polyester Fiber', category: 'Textile', unit: 'ton', ef: 4.12 },
  { name: 'Wool', category: 'Textile', unit: 'ton', ef: 16.5 },
  
  // Electronics
  { name: 'Silicon', category: 'Electronic', unit: 'ton', ef: 12.1 },
  { name: 'Copper Wire', category: 'Electronic', unit: 'ton', ef: 2.8 },
  { name: 'PCB (Printed Circuit Board)', category: 'Electronic', unit: 'ton', ef: 15.0 },
  
  // Rare Materials
  { name: 'Lithium', category: 'Rare Metal', unit: 'ton', ef: 15.0 },
  { name: 'Cobalt', category: 'Rare Metal', unit: 'ton', ef: 8.2 },
  { name: 'Nickel', category: 'Metal', unit: 'ton', ef: 7.5 },
]

// Define 150 countries with their grid EF
const COUNTRIES = [
  // Europe (extremely low EF due to renewables)
  { name: 'Iceland', code: 'IS', ef: 0.02 },
  { name: 'Norway', code: 'NO', ef: 0.1 },
  { name: 'Switzerland', code: 'CH', ef: 0.12 },
  { name: 'Austria', code: 'AT', ef: 0.18 },
  { name: 'Sweden', code: 'SE', ef: 0.09 },
  { name: 'Denmark', code: 'DK', ef: 0.18 },
  { name: 'Germany', code: 'DE', ef: 0.38 },
  { name: 'France', code: 'FR', ef: 0.06 },
  { name: 'Italy', code: 'IT', ef: 0.36 },
  { name: 'Spain', code: 'ES', ef: 0.27 },
  { name: 'Portugal', code: 'PT', ef: 0.24 },
  { name: 'Poland', code: 'PL', ef: 0.78 },
  { name: 'Netherlands', code: 'NL', ef: 0.35 },
  { name: 'Belgium', code: 'BE', ef: 0.22 },
  { name: 'United Kingdom', code: 'GB', ef: 0.31 },
  { name: 'Ireland', code: 'IE', ef: 0.28 },
  { name: 'Greece', code: 'GR', ef: 0.45 },
  { name: 'Czech Republic', code: 'CZ', ef: 0.52 },
  { name: 'Hungary', code: 'HU', ef: 0.34 },
  { name: 'Romania', code: 'RO', ef: 0.48 },
  { name: 'Bulgaria', code: 'BG', ef: 0.61 },
  { name: 'Slovakia', code: 'SK', ef: 0.27 },
  { name: 'Slovenia', code: 'SI', ef: 0.29 },
  { name: 'Croatia', code: 'HR', ef: 0.31 },
  { name: 'Serbia', code: 'RS', ef: 0.72 },
  
  // Americas (mixed, North America higher)
  { name: 'United States', code: 'US', ef: 0.42 },
  { name: 'Canada', code: 'CA', ef: 0.15 },
  { name: 'Mexico', code: 'MX', ef: 0.48 },
  { name: 'Brazil', code: 'BR', ef: 0.09 },
  { name: 'Argentina', code: 'AR', ef: 0.12 },
  { name: 'Chile', code: 'CL', ef: 0.18 },
  { name: 'Colombia', code: 'CO', ef: 0.11 },
  { name: 'Peru', code: 'PE', ef: 0.15 },
  { name: 'Venezuela', code: 'VE', ef: 0.14 },
  
  // Asia (high variation, many coal-heavy)
  { name: 'China', code: 'CN', ef: 0.61 },
  { name: 'Japan', code: 'JP', ef: 0.48 },
  { name: 'South Korea', code: 'KR', ef: 0.54 },
  { name: 'India', code: 'IN', ef: 0.72 },
  { name: 'Pakistan', code: 'PK', ef: 0.55 },
  { name: 'Bangladesh', code: 'BD', ef: 0.64 },
  { name: 'Vietnam', code: 'VN', ef: 0.52 },
  { name: 'Thailand', code: 'TH', ef: 0.43 },
  { name: 'Malaysia', code: 'MY', ef: 0.52 },
  { name: 'Indonesia', code: 'ID', ef: 0.56 },
  { name: 'Philippines', code: 'PH', ef: 0.54 },
  { name: 'Singapore', code: 'SG', ef: 0.41 },
  { name: 'Hong Kong', code: 'HK', ef: 0.48 },
  { name: 'Taiwan', code: 'TW', ef: 0.52 },
  { name: 'Thailand', code: 'TH', ef: 0.43 },
  { name: 'Iran', code: 'IR', ef: 0.58 },
  { name: 'Saudi Arabia', code: 'SA', ef: 0.68 },
  { name: 'United Arab Emirates', code: 'AE', ef: 0.59 },
  { name: 'Turkey', code: 'TR', ef: 0.53 },
  { name: 'Israel', code: 'IL', ef: 0.55 },
  
  // Africa (mostly middle-high EF)
  { name: 'South Africa', code: 'ZA', ef: 0.98 },
  { name: 'Egypt', code: 'EG', ef: 0.52 },
  { name: 'Nigeria', code: 'NG', ef: 0.71 },
  { name: 'Kenya', code: 'KE', ef: 0.22 },
  { name: 'Ethiopia', code: 'ET', ef: 0.18 },
  { name: 'Morocco', code: 'MA', ef: 0.28 },
  { name: 'Algeria', code: 'DZ', ef: 0.65 },
  { name: 'Tunisia', code: 'TN', ef: 0.45 },
  { name: 'Ghana', code: 'GH', ef: 0.52 },
  { name: 'Ivory Coast', code: 'CI', ef: 0.22 },
  
  // Oceania
  { name: 'Australia', code: 'AU', ef: 0.68 },
  { name: 'New Zealand', code: 'NZ', ef: 0.18 },
  { name: 'Fiji', code: 'FJ', ef: 0.38 },
  
  // Additional countries for diversity
  { name: 'Russia', code: 'RU', ef: 0.48 },
  { name: 'Ukraine', code: 'UA', ef: 0.68 },
  { name: 'Belarus', code: 'BY', ef: 0.52 },
  { name: 'Kazakhstan', code: 'KZ', ef: 0.85 },
  { name: 'Uzbekistan', code: 'UZ', ef: 0.62 },
  { name: 'Mongolia', code: 'MN', ef: 0.95 },
  { name: 'Myanmar', code: 'MM', ef: 0.48 },
  { name: 'Cambodia', code: 'KH', ef: 0.38 },
  { name: 'Laos', code: 'LA', ef: 0.15 },
  { name: 'Papua New Guinea', code: 'PG', ef: 0.28 },
  { name: 'Sri Lanka', code: 'LK', ef: 0.38 },
  { name: 'Nepal', code: 'NP', ef: 0.18 },
  { name: 'Afghanistan', code: 'AF', ef: 0.42 },
  { name: 'Iraq', code: 'IQ', ef: 0.72 },
  { name: 'Syria', code: 'SY', ef: 0.58 },
  { name: 'Lebanon', code: 'LB', ef: 0.62 },
  { name: 'Palestine', code: 'PS', ef: 0.65 },
  { name: 'Jordan', code: 'JO', ef: 0.68 },
  { name: 'Yemen', code: 'YE', ef: 0.72 },
  { name: 'Oman', code: 'OM', ef: 0.65 },
  { name: 'Qatar', code: 'QA', ef: 0.72 },
  { name: 'Bahrain', code: 'BH', ef: 0.68 },
  { name: 'Kuwait', code: 'KW', ef: 0.71 },
  { name: 'Libya', code: 'LY', ef: 0.71 },
  { name: 'Sudan', code: 'SD', ef: 0.58 },
  { name: 'Somalia', code: 'SO', ef: 0.48 },
  { name: 'Tanzania', code: 'TZ', ef: 0.22 },
  { name: 'Uganda', code: 'UG', ef: 0.15 },
  { name: 'Rwanda', code: 'RW', ef: 0.18 },
  { name: 'Cameroon', code: 'CM', ef: 0.25 },
  { name: 'Senegal', code: 'SN', ef: 0.35 },
  { name: 'Mali', code: 'ML', ef: 0.28 },
  { name: 'Burkina Faso', code: 'BF', ef: 0.22 },
  { name: 'Niger', code: 'NE', ef: 0.18 },
  { name: 'Chad', code: 'TD', ef: 0.15 },
  { name: 'Angola', code: 'AO', ef: 0.35 },
  { name: 'Zambia', code: 'ZM', ef: 0.18 },
  { name: 'Zimbabwe', code: 'ZW', ef: 0.42 },
  { name: 'Botswana', code: 'BW', ef: 0.45 },
  { name: 'Namibia', code: 'NA', ef: 0.32 },
  { name: 'Mauritius', code: 'MU', ef: 0.48 },
  { name: 'Seychelles', code: 'SC', ef: 0.55 },
  { name: 'El Salvador', code: 'SV', ef: 0.35 },
  { name: 'Guatemala', code: 'GT', ef: 0.28 },
  { name: 'Honduras', code: 'HN', ef: 0.32 },
  { name: 'Nicaragua', code: 'NI', ef: 0.18 },
  { name: 'Costa Rica', code: 'CR', ef: 0.08 },
  { name: 'Panama', code: 'PA', ef: 0.25 },
  { name: 'Cuba', code: 'CU', ef: 0.48 },
  { name: 'Dominican Republic', code: 'DO', ef: 0.38 },
  { name: 'Jamaica', code: 'JM', ef: 0.42 },
  { name: 'Barbados', code: 'BB', ef: 0.55 },
  { name: 'Bolivia', code: 'BO', ef: 0.28 },
  { name: 'Ecuador', code: 'EC', ef: 0.18 },
  { name: 'Suriname', code: 'SR', ef: 0.22 },
  { name: 'Paraguay', code: 'PY', ef: 0.18 },
  { name: 'Uruguay', code: 'UY', ef: 0.12 },
  { name: 'Malta', code: 'MT', ef: 0.65 },
  { name: 'Cyprus', code: 'CY', ef: 0.58 },
  { name: 'Iceland', code: 'IS', ef: 0.02 },
  { name: 'Luxembourg', code: 'LU', ef: 0.25 },
  { name: 'Bosnia and Herzegovina', code: 'BA', ef: 0.65 },
  { name: 'North Macedonia', code: 'MK', ef: 0.48 },
  { name: 'Albania', code: 'AL', ef: 0.35 },
  { name: 'Montenegro', code: 'ME', ef: 0.32 },
  { name: 'Moldova', code: 'MD', ef: 0.55 },
  { name: 'Georgia', code: 'GE', ef: 0.28 },
  { name: 'Armenia', code: 'AM', ef: 0.65 },
  { name: 'Azerbaijan', code: 'AZ', ef: 0.72 },
  { name: 'Turkmenistan', code: 'TM', ef: 0.68 },
  { name: 'Tajikistan', code: 'TJ', ef: 0.25 },
  { name: 'Kyrgyzstan', code: 'KG', ef: 0.18 },
  { name: 'Albania', code: 'AL', ef: 0.35 },
  { name: 'Timor-Leste', code: 'TL', ef: 0.28 },
  { name: 'Solomon Islands', code: 'SB', ef: 0.35 },
  { name: 'Vanuatu', code: 'VU', ef: 0.22 },
  { name: 'Samoa', code: 'WS', ef: 0.42 },
  { name: 'Tonga', code: 'TO', ef: 0.38 },
  { name: 'Kiribati', code: 'KI', ef: 0.48 },
  { name: 'Marshall Islands', code: 'MH', ef: 0.52 },
  { name: 'Palau', code: 'PW', ef: 0.48 },
  { name: 'Micronesia', code: 'FM', ef: 0.55 },
  { name: 'Comoros', code: 'KM', ef: 0.38 },
  { name: 'Djibouti', code: 'DJ', ef: 0.62 },
  { name: 'Mauritania', code: 'MR', ef: 0.58 },
].slice(0, 150) // Ensure we have exactly 150

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create all grid factors for countries
  console.log('\n📍 Creating grid factors for 150 countries...')
  const gridFactors = await Promise.all(
    COUNTRIES.map((country) =>
      prisma.gridFactor.upsert({
        where: { country_code: country.code },
        update: {},
        create: {
          country: country.name,
          country_code: country.code,
          ef_kg_co2_kwh: country.ef,
          data_source: 'IEA World Energy Balances 2024',
          year_published: 2024,
        },
      })
    )
  )
  console.log(`✅ Created ${gridFactors.length} grid factors`)

  // 2. Create all raw materials
  console.log('\n📚 Creating 50 raw materials...')
  const materials = await Promise.all(
    MATERIALS.map((mat) =>
      prisma.rawMaterial.upsert({
        where: { name: mat.name },
        update: {},
        create: {
          name: mat.name,
          category: mat.category,
          base_unit: mat.unit,
          default_ef_kg_co2: mat.ef,
          description: `${mat.category} material with default EF of ${mat.ef} kg CO2/${mat.unit}`,
        },
      })
    )
  )
  console.log(`✅ Created ${materials.length} raw materials`)

  // 3. Create material factors (linking materials to countries)
  // For each material, create a factor for a subset of countries  console.log('\n🔗 Creating material factors (material × country combinations)...')
  let factorCount = 0
  for (const material of materials) {
    // Link each material to ~10-15 random countries for realistic data
    const randomIndices = Array.from(
      { length: Math.min(15, gridFactors.length) },
      () => Math.floor(Math.random() * gridFactors.length)
    )
    const uniqueIndices = [...new Set(randomIndices)]

    for (const idx of uniqueIndices) {
      const grid = gridFactors[idx]
      const scopeVariation = Math.random() > 0.5 ? '1,2,3' : '1,3'
      const gwpVariation = Math.random() > 0.7 ? 1.5 : 1.0

      await prisma.materialFactor.upsert({
        where: {
          material_id_grid_id: {
            material_id: material.id,
            grid_id: grid.id,
          },
        },
        update: {},
        create: {
          material_id: material.id,
          grid_id: grid.id,
          ef_kg_co2_unit: material.default_ef_kg_co2 * (0.8 + Math.random() * 0.4), // Vary by ±20%
          scope: scopeVariation,
          gwp_factor: gwpVariation,
          lifecycle_stage: 'Cradle-to-Gate',
        },
      })
      factorCount++
    }
  }
  console.log(`✅ Created ${factorCount} material factors`)

  // 4. Create a sample tenant
  console.log('\n🏢 Creating sample tenant...')
  const tenant = await prisma.tenant.upsert({
    where: { name: 'AuraCarbon Demo' },
    update: {},
    create: {
      name: 'AuraCarbon Demo',
      country: 'Pakistan',
      industry_type: 'Steel Manufacturing',
      subscription_tier: 'ENTERPRISE',
    },
  })
  console.log(`✅ Created tenant: ${tenant.name}`)

  console.log('\n✨ Seed completed successfully!')
  console.log(`
  Summary:
  - Countries: ${gridFactors.length}
  - Raw Materials: ${materials.length}
  - Material Factors: ${factorCount}
  - Tenant: 1
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
