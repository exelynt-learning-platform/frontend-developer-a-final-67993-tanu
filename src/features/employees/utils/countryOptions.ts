import type { Country } from '../../countries/types'

export interface CountryOption {
  id: string
  name: string
}

export function getCountryOptions(
  countries: Country[],
  currentCountry?: string,
): CountryOption[] {
  const optionsByName = new Map<string, CountryOption>()

  for (const country of countries) {
    const name = country.country.trim()
    const key = name.toLowerCase()

    if (!name || optionsByName.has(key)) {
      continue
    }

    optionsByName.set(key, { id: country.id, name })
  }

  const currentName = currentCountry?.trim()

  if (currentName && !optionsByName.has(currentName.toLowerCase())) {
    optionsByName.set(currentName.toLowerCase(), {
      id: '',
      name: currentName,
    })
  }

  return [...optionsByName.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )
}

export function findCountryId(
  options: CountryOption[],
  countryName: string,
): string | undefined {
  const match = options.find(
    (option) => option.name.toLowerCase() === countryName.trim().toLowerCase(),
  )

  return match?.id || undefined
}
