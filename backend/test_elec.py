import pandas as pd
import numpy as np
import sys

# test file

population_US = 340_000_000
population_UK = 68_000_000
population_CAN = 40_000_000

total_population = population_US + population_UK + population_CAN

# get electricity demand data
demand = pd.read_csv('electricity_sample_data.csv') # kWh per capita per year
demand = demand[demand['Country Name'].isin(['United States', 'United Kingdom', 'Canada'])]
demand = demand.drop(['2024'], axis=1)

year_range = [str(a) for a in range(2010, 2023)]
us_mean = np.mean([demand.loc[demand['Country Name'] == 'United States', y] for y in year_range])
uk_mean = np.mean([demand.loc[demand['Country Name'] == 'United Kingdom', y] for y in year_range])
can_mean = np.mean([demand.loc[demand['Country Name'] == 'Canada', y] for y in year_range])

new_values_us = np.random.normal(us_mean, 200, size=3)
new_values_uk = np.random.normal(uk_mean, 200, size=3)
new_values_can = np.random.normal(can_mean, 200, size=3)

new_values = np.array([new_values_us, new_values_uk, new_values_can])

df2 = pd.DataFrame(new_values, index=[35, 81, 251], columns=['2024', '2025', '2026'])
demand = pd.concat([demand, df2], axis=1).drop(['Indicator Name', 'Country Code', 'Indicator Code', 'Unnamed: 69'], axis=1)
demand.set_index('Country Name', inplace=True)
for y in range(1960, 2027):
    demand.loc['United States', str(y)] *= population_US
    demand.loc['United Kingdom', str(y)] *= population_UK
    demand.loc['Canada', str(y)] *= population_CAN

# get supply data
supply = pd.read_csv('./elec-fossil-nuclear-renewables.csv')
supply = supply[supply['Entity'].isin(['United States', 'United Kingdom', 'Canada'])].set_index('Entity')
supply.drop(['Code'], axis=1, inplace=True)
colnames = ['Electricity from renewables - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)', 'Electricity from nuclear - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)', 'Electricity from fossil fuels - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)']
supply['Supply'] = sum(supply[k] for k in colnames)
supply.drop(colnames, axis=1, inplace=True)
supply = supply.reset_index()
supply = supply.pivot(index='Entity', columns='Year', values='Supply')

year_range = range(2010, 2023)
us_mean = supply.loc['United States', year_range].mean()
uk_mean = supply.loc['United Kingdom', year_range].mean()
can_mean = supply.loc['Canada', year_range].mean()

new_values_us = np.random.normal(us_mean, 200, size=3)
new_values_uk = np.random.normal(uk_mean, 200, size=3)
new_values_can = np.random.normal(can_mean, 200, size=3)

new_values = np.array([new_values_us, new_values_uk, new_values_can])
df2 = pd.DataFrame(new_values, index=['United States', 'United Kingdom', 'Canada'],
                   columns=[2025, 2026, 2027])

supply = pd.concat([supply, df2], axis=1)
for y in range(1985, 2028):
    supply[y] *= 1e9


supply.rename({
    'United States': 'US Supply',
    'United Kingdom': 'UK Supply',
    'Canada': 'CAN Supply'
    }, inplace=True)
supply.columns = supply.columns.astype(str)


demand.rename({
    'United States': 'US Demand',
    'United Kingdom': 'UK Demand',
    'Canada': 'CAN Demand'
    }, inplace=True)

final = pd.concat([supply, demand], axis=0)
# print()
# print(final)

print(supply)