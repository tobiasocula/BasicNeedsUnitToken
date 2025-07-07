import pandas as pd
import numpy as np
import sys

def get_type(series_name):
    if series_name[0] == 'A':
        return "demand"
    return 'supply'

water = pd.read_csv('./water_sample_data.csv').drop(['Country Code', 'Series Code'], axis=1)
water['Country Name'] = water['Country Name'] + " " + water['Series Name'].apply(get_type)
water.set_index('Country Name', inplace=True)
water.drop(['Series Name'], axis=1, inplace=True)
# units are in billion m^3 of water
print(water)
year_range = [f'{a} [YR{a}]' for a in range(2010, 2022)]
us_mean = np.mean([water.loc['United States demand', y] for y in year_range])
uk_mean = np.mean([water.loc['United Kingdom demand', y] for y in year_range])
can_mean = np.mean([water.loc['Canada demand', y] for y in year_range])

new_values_us_demand = np.random.normal(us_mean, 20, size=3)
new_values_uk_demand = np.random.normal(uk_mean, 0.5, size=3)
new_values_can_demand = np.random.normal(can_mean, 1, size=3)

us_mean = np.mean([water.loc['United States supply', y] for y in year_range])
uk_mean = np.mean([water.loc['United Kingdom supply', y] for y in year_range])
can_mean = np.mean([water.loc['Canada supply', y] for y in year_range])

new_values_us_supply = np.random.normal(us_mean, 20, size=3)
new_values_uk_supply = np.random.normal(uk_mean, 0.5, size=3)
new_values_can_supply = np.random.normal(can_mean, 1, size=3)

new_values = np.array([
    new_values_us_demand,
    new_values_us_supply,
    new_values_uk_demand,
    new_values_uk_supply,
    new_values_can_demand,
    new_values_can_supply,
])

new = pd.DataFrame(new_values, index=[
    'United States demand',
    'United States supply',
    'United Kingdom demand',
    'United Kingdom supply',
    'Canada demand',
    'Canada supply'
    ], columns=['2024 [YR2024]', '2025 [YR2024]', '2026 [YR2024]'])
print(new)

final = pd.concat([water, new], axis=1)

print(final)
print(final['2021 [YR2021]'])
