
"""
This python file generates two graphs:
One displaying the raw supply/demand ratios for different resources,
and one displaying the total (normalized) ratios and the new supposed supply ratio
The csv data got downloaded from https://data.worldbank.org/ and https://www.worldwater.org/water-data/.
"""


import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv('../backend/sample_kcal_fat_protein_data.csv')

population_US = 340_000_000
population_UK = 68_000_000
population_CAN = 40_000_000

total_population = population_US + population_UK + population_CAN

demand_dict = {
    'Protein supply quantity (g/capita/day)': 60, # gram / day / person
    'Fat supply quantity (g/capita/day)': 67, # gram / day / person
    'Food supply (kcal/capita/day)': 2000, # kcal / day / person
}

fig, ax = plt.subplots()


# food data

y_protein = []
y_fat = []
y_kcal = []

for y in range(2010, 2023):
    d1 = df[df['Year'] == y]
    for i, t in enumerate(['Protein supply quantity (g/capita/day)', 'Fat supply quantity (g/capita/day)', 'Food supply (kcal/capita/day)']):
        d2 = d1[d1['Element'] == t]
        sup = (
            d2[d2['Area'] == 'United Kingdom of Great Britain and Northern Ireland']['Value'].sum() * population_UK +
            d2[d2['Area'] == 'United States of America']['Value'].sum() * population_US +
            d2[d2['Area'] == 'Canada']['Value'].sum() * population_CAN
        )
        demand = demand_dict[t] * total_population
        ratio = sup / demand
        if i==0:
            y_protein.append(ratio)
        elif i==1:
            y_fat.append(ratio)
        else:
            y_kcal.append(ratio)


ax.plot(range(2010, 2023), y_protein, label='Protein')
ax.plot(range(2010, 2023), y_fat, label='Fat')
ax.plot(range(2010, 2023), y_kcal, label='Calories')


# electricity data

y_elec = []

demand = pd.read_csv('../backend/electricity_sample_data.csv') # kWh per capita per year
demand = demand[demand['Country Name'].isin(['United States', 'United Kingdom', 'Canada'])]
supply = pd.read_csv('../backend/elec-fossil-nuclear-renewables.csv')
supply = supply[supply['Entity'].isin(['United States', 'United Kingdom', 'Canada'])]
for y in range(2010, 2023):
    d = (
         pd.to_numeric(demand.loc[demand['Country Name'] == 'United States', str(y)].values[0], errors='coerce') * population_US +
         pd.to_numeric(demand.loc[demand['Country Name'] == 'United Kingdom', str(y)].values[0], errors='coerce') * population_UK +
         pd.to_numeric(demand.loc[demand['Country Name'] == 'Canada', str(y)].values[0], errors='coerce') * population_CAN
    )
    s = (
        supply.loc[(supply['Entity'] == 'United States') & (supply['Year'] == y)].values[0][3] +
        supply.loc[(supply['Entity'] == 'United States') & (supply['Year'] == y)].values[0][4] +
        supply.loc[(supply['Entity'] == 'United States') & (supply['Year'] == y)].values[0][5]
        +
        supply.loc[(supply['Entity'] == 'United Kingdom') & (supply['Year'] == y)].values[0][3] +
        supply.loc[(supply['Entity'] == 'United Kingdom') & (supply['Year'] == y)].values[0][4] +
        supply.loc[(supply['Entity'] == 'United Kingdom') & (supply['Year'] == y)].values[0][5]
        +
        supply.loc[(supply['Entity'] == 'Canada') & (supply['Year'] == y)].values[0][3] +
        supply.loc[(supply['Entity'] == 'Canada') & (supply['Year'] == y)].values[0][4] +
        supply.loc[(supply['Entity'] == 'Canada') & (supply['Year'] == y)].values[0][5]
    ) * 1e9

    y_elec.append(s/d)


ax.plot(range(2010, 2023), y_elec, label='Electricity')



# water data

y_water = []
water = pd.read_csv('../backend/water_sample_data.csv')
for y in range(2010, 2022):
    index = y - 2006
    d = (
        water.loc[(water['Series Name'] == 'Annual freshwater withdrawals, total (billion cubic meters)') & (water['Country Name'] == 'United States')].values[0][index] +
        water.loc[(water['Series Name'] == 'Annual freshwater withdrawals, total (billion cubic meters)') & (water['Country Name'] == 'United Kingdom')].values[0][index] +
        water.loc[(water['Series Name'] == 'Annual freshwater withdrawals, total (billion cubic meters)') & (water['Country Name'] == 'Canada')].values[0][index]
    )
    s = (
        water.loc[(water['Series Name'] == 'Renewable internal freshwater resources, total (billion cubic meters)') & (water['Country Name'] == 'United States')].values[0][index] +
        water.loc[(water['Series Name'] == 'Renewable internal freshwater resources, total (billion cubic meters)') & (water['Country Name'] == 'United Kingdom')].values[0][index] +
        water.loc[(water['Series Name'] == 'Renewable internal freshwater resources, total (billion cubic meters)') & (water['Country Name'] == 'Canada')].values[0][index]
    )
    y_water.append(s/d)

ax.plot(range(2010, 2022), y_water, label='Water')
ax.set_xlabel("Year")
ax.set_ylabel("Supply / Demand Ratio")
ax.legend()
plt.savefig('raw_ratios.png')

# normalizing data

ydata = [y_protein, y_fat, y_kcal, y_elec, y_water]
ideals = [1.9, 2.50, 1.88, 0.97, 11.5] # sample "ideal" values
ydata_normalised = [
    [ydata[i][y-2010] / ideals[i] for i in range(5)]
    for y in range(2010, 2022)
]
resources_weights = np.array([0.2] * 5) # constant weights
supply_normalized = np.array([
    np.dot(resources_weights, ydata_normalised[i-2010])
    for i in range(2010, 2022)
])
    
# graphing of normalized data

fig, ax = plt.subplots()

ax.plot(range(2010, 2022), supply_normalized, label='Total supply normalized')

resource_mapping = ['Protein', 'Fat', 'Kcal', 'Electricity', 'Water']
for v in range(5):
    ax.plot(range(2010, 2022), [k[v] for k in ydata_normalised], label=resource_mapping[v])


ax.set_xlabel("Year")
ax.set_ylabel("Normalized ratios")
ax.legend()
plt.show()
plt.savefig('normalized supply & ratios')
