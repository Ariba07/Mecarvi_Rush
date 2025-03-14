// components/helperUtils/cityCountryUtils/cityCountryUtils.ts
import {Country, City} from 'country-state-city';

interface CityWithCountry {
  cityName: string;
  countryName: string;
  label: string;
  value: string;
}

const fetchCitiesWithCountries = (): CityWithCountry[] => {
  // Get all countries and filter for the USA
  const countries = Country.getAllCountries();
  const usa = countries.find(country => country.isoCode === 'US');

  if (!usa) {
    console.error('USA not found in country list');
    return [];
  }

  // Get cities for the USA
  const cities = City.getCitiesOfCountry(usa.isoCode) || [];

  // Map the cities to the desired format
  const allCitiesWithCountries: CityWithCountry[] = cities
    .map(city => ({
      cityName: city.name,
      countryName: usa.name,
      label: `${city.name}, ${usa.name}`, // Format: "City, USA"
      value: `${city.name}, ${usa.name}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label

  return allCitiesWithCountries;
};

export default fetchCitiesWithCountries;
