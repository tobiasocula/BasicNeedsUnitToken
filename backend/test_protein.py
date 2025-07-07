
import pandas as pd
import numpy as np
import sys

# test file

demand_value = 60, # gram / day / person

df = pd.read_csv('./sample_kcal_fat_protein_data.csv')
df = df[df['Element'] == 'Protein supply quantity (g/capita/day)']
df.drop(['Domain Code', 'Domain', 'Flag', 'Flag Description', 'Note', 'Area Code (M49)',
         'Element Code'], axis=1, inplace=True)
df.set_index('Area', inplace=True)
df['Element'] = df['Element'].replace({'Protein supply quantity (g/capita/day)': 'Protein (g/capita/day)'})
print(df)
df = df.groupby(['Area', 'Year']).sum()
df.to_csv('tbd.csv')
us_mean = df.loc['United States of America', 'Value'].mean()
uk_mean = df.loc['United Kingdom of Great Britain and Northern Ireland', 'Value'].mean()
can_mean = df.loc['Canada', 'Value'].mean()

new_values_us = np.random.normal(us_mean, 5, size=3)
new_values_uk = np.random.normal(uk_mean, 5, size=3)
new_values_can = np.random.normal(can_mean, 5, size=3)


future = pd.DataFrame(np.array([new_values_us, new_values_uk, new_values_can,
                                np.random.normal(60, 5, size=3),
                                np.random.normal(60, 5, size=3),
                                np.random.normal(60, 5, size=3)]),
                      index=['United States of America demand',
                               'United Kingdom of Great Britain and Northern Ireland demand',
                               'Canada demand',
                               'United States of America supply',
                               'United Kingdom of Great Britain and Northern Ireland supply',
                               'Canada supply'],
                        columns=range(2023, 2026))
print('FUTURE:'); print(future)
df.reset_index(inplace=True)
new_df = df.pivot(index='Area', columns='Year', values='Value')



# supply
new_values_us = np.random.normal(60, 5, size=13)
new_values_uk = np.random.normal(60, 5, size=13)
new_values_can = np.random.normal(60, 5, size=13)

new_df.index = new_df.index.map(lambda x: x + ' demand')

new_df = pd.concat([new_df, pd.DataFrame(
    np.array([new_values_us, new_values_uk, new_values_can]),
    columns=range(2010, 2023), index=['United States of America supply',
                               'United Kingdom of Great Britain and Northern Ireland supply',
                               'Canada supply']
)], axis=0)

print(new_df)

newnew_df = pd.concat([new_df, future], axis=1)
print(newnew_df)

print()
print(newnew_df[2023])
