import { findCountryId, getCountryOptions } from './countryOptions'
import { mockCountries } from '../../../test/fixtures/countries'

describe('getCountryOptions', () => {
  it('deduplicates country names and keeps the current employee country', () => {
    const options = getCountryOptions(
      [
        ...mockCountries,
        { id: '99', country: 'India', createdAt: '2026-01-01T00:00:00.000Z' },
      ],
      'Norway',
    )

    expect(options.map((option) => option.name)).toEqual([
      'Ecuador',
      'India',
      'Norway',
      'Peru',
    ])
  })

  it('finds a country id by name', () => {
    expect(findCountryId(getCountryOptions(mockCountries), 'india')).toBe('1')
  })
})
