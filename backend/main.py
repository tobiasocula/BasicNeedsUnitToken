import os
os.environ['MPLCONFIGDIR'] = '/tmp'

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
#from pydantic import BaseModel
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import sys
import matplotlib
matplotlib.use('Agg') # non gui backend

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.options("/newvalues")
# def preflight_newvalues():
#     return JSONResponse(
#         content={},
#         headers={
#             "Access-Control-Allow-Origin": "*",
#             "Access-Control-Allow-Methods": "POST, OPTIONS",
#             "Access-Control-Allow-Headers": "*",
#         },
#     )

population_US = 340_000_000
population_UK = 68_000_000
population_CAN = 40_000_000

# total_population = population_US + population_UK + population_CAN





def random_array(mean, std, n):
    result = []
    for i in range(n):
        result.append(np.random.normal(mean if i==0 else result[-1], std))
    return result

def protein():
    demand_value = 60 # gram / day / person
    
    df = pd.read_csv('sample_kcal_fat_protein_data.csv')
    df = df[df['Element'] == 'Protein supply quantity (g/capita/day)']
    df.drop(['Domain Code', 'Domain', 'Flag', 'Flag Description', 'Note', 'Area Code (M49)',
            'Element Code'], axis=1, inplace=True)
    df.set_index('Area', inplace=True)
    df['Element'] = df['Element'].replace({'Protein supply quantity (g/capita/day)': 'Protein (g/capita/day)'})
    df = df.groupby(['Area', 'Year']).sum()
    print('!!!')
    

    # us_ref = df.loc['United States of America', 'Value'].mean()
    # uk_ref = df.loc['United Kingdom of Great Britain and Northern Ireland', 'Value'].mean()
    # can_ref = df.loc['Canada', 'Value'].mean()
    

    us_ref = df.loc[('United States of America', 2022)]['Value']
    uk_ref = df.loc[('United Kingdom of Great Britain and Northern Ireland', 2022)]['Value']
    can_ref = df.loc[('Canada', 2022)]['Value']
    print('us ref:', us_ref)

    df.reset_index(inplace=True)
    df = df.pivot(index='Area', columns='Year', values='Value')
    df.index = df.index.map(lambda x: x + ' Supply')
    
    df = pd.concat([df, pd.DataFrame(
        np.array([
            random_array(us_ref, us_ref*0.05, 17),
            random_array(uk_ref, uk_ref*0.05, 17),
            random_array(can_ref, can_ref*0.05, 17)
        ]),
        index=[
            'United States of America Supply',
            'United Kingdom of Great Britain and Northern Ireland Supply',
            'Canada Supply'
        ],
        columns=range(2023, 2040)
    )], axis=1)

    

    df = pd.concat([df, pd.DataFrame(
        np.array([
            random_array(demand_value, demand_value*0.05, 30),
            random_array(demand_value, demand_value*0.05, 30),
            random_array(demand_value, demand_value*0.05, 30)
        ]),
        index=[
            'United States of America Demand',
            'United Kingdom of Great Britain and Northern Ireland Demand',
            'Canada Demand'
        ],
        columns=range(2010, 2040)
    )])
    df.to_csv('tbd.csv')
    df.loc['Canada Supply'] *= population_CAN * 365
    df.loc['Canada Demand'] *= population_CAN * 365
    df.loc['United States of America Demand'] *= population_US * 365
    df.loc['United States of America Supply'] *= population_US * 365
    df.loc['United Kingdom of Great Britain and Northern Ireland Demand'] *= population_UK * 365
    df.loc['United Kingdom of Great Britain and Northern Ireland Supply'] *= population_UK * 365

    d = df.loc[['United States of America Demand', 'Canada Demand', 'United Kingdom of Great Britain and Northern Ireland Demand']].sum(axis=0)
    s = df.loc[['United States of America Supply', 'Canada Supply', 'United Kingdom of Great Britain and Northern Ireland Supply']].sum(axis=0)
    df.loc['Total Supply'] = s
    df.loc['Total Demand'] = d

    df.loc['Ratio'] = df.loc['Total Supply'] / df.loc['Total Demand']
    df.to_csv('protein_final.csv') # for debugging
    return df
    


def water():
    def get_type(series_name):
        if series_name[0] == 'A':
            return "demand"
        return 'supply'
    df = pd.read_csv('./water_sample_data.csv').drop(['Country Code', 'Series Code'], axis=1)
    df['Country Name'] = df['Country Name'] + " " + df['Series Name'].apply(get_type)
    df.set_index('Country Name', inplace=True)
    df.drop(['Series Name'], axis=1, inplace=True)
    df.rename({f'{y} [YR{y}]':str(y) for y in range(2010, 2022)}, inplace=True, axis=1)
    df.drop([f'{y} [YR{y}]' for y in range(2022, 2025)], inplace=True, axis=1)

    # us_ref_d = df.loc['United States demand', [str(s) for s in range(2010, 2022)]].mean()
    # uk_ref_d = df.loc['United Kingdom demand', [str(s) for s in range(2010, 2022)]].mean()
    # can_ref_d = df.loc['Canada demand', [str(s) for s in range(2010, 2022)]].mean()
    # us_ref_s = df.loc['United States supply', [str(s) for s in range(2010, 2022)]].mean()
    # uk_ref_s = df.loc['United Kingdom supply', [str(s) for s in range(2010, 2022)]].mean()
    # can_ref_s = df.loc['Canada supply', [str(s) for s in range(2010, 2022)]].mean()
    us_ref_d = df.loc['United States demand', '2021']
    uk_ref_d = df.loc['United Kingdom demand', '2021']
    can_ref_d = df.loc['Canada demand', '2021']
    us_ref_s = df.loc['United States supply', '2021']
    uk_ref_s = df.loc['United Kingdom supply', '2021']
    can_ref_s = df.loc['Canada supply', '2021']
    df = pd.concat([df, pd.DataFrame(
        np.array([
            random_array(us_ref_d, us_ref_d*0.05, 18),
            random_array(uk_ref_d, uk_ref_d*0.05, 18),
            random_array(can_ref_d, can_ref_d*0.05, 18),
            random_array(us_ref_s, us_ref_s*0.05, 18),
            random_array(uk_ref_s, uk_ref_s*0.05, 18),
            random_array(can_ref_s, can_ref_s*0.05, 18)
        ]),
        index=['United States demand', 'United Kingdom demand', 'Canada demand',
               'United States supply', 'United Kingdom supply', 'Canada supply'],
        columns=[str(s) for s in range(2022, 2040)]
    )], axis=1)

    d = df.loc[['United States demand', 'Canada demand', 'United Kingdom demand']].sum(axis=0)
    s = df.loc[['United States supply', 'Canada supply', 'United Kingdom supply']].sum(axis=0)
    df.loc['Total Supply'] = s
    df.loc['Total Demand'] = d
    df.loc['Ratio'] = df.loc['Total Supply'] / df.loc['Total Demand']
    df.to_csv('water_final.csv') # for debugging
    return df


def elec():
    demand = pd.read_csv('electricity_sample_data.csv') # kWh per capita per year
    demand = demand[demand['Country Name'].isin(['United States', 'United Kingdom', 'Canada'])]
    demand = demand.drop(['Unnamed: 69', '2024'], axis=1)
    demand.set_index('Country Name', inplace=True)
    #us_ref = demand.loc['United States', [str(s) for s in range(2010, 2024)]].mean()
    #uk_ref = demand.loc['United Kingdom', [str(s) for s in range(2010, 2024)]].mean()
    #can_ref = demand.loc['Canada', [str(s) for s in range(2010, 2024)]].mean()
    us_ref = demand.loc['United States', '2023']
    uk_ref = demand.loc['United Kingdom', '2023']
    can_ref = demand.loc['Canada', '2023']
    demand = pd.concat([demand, pd.DataFrame(
        np.array([
            random_array(us_ref, us_ref*0.05, 16),
            random_array(uk_ref, uk_ref*0.05, 16),
            random_array(can_ref, can_ref*0.05, 16)
        ]),
        index=['United States', 'United Kingdom', 'Canada'],
        columns=[str(s) for s in range(2024, 2040)]
    )], axis=1).drop(
        ['Indicator Name', 'Country Code', 'Indicator Code'] + [str(k) for k in range(1960, 1985)],
        axis=1)
    
    demand.index = demand.index.map(lambda x: x + ' Demand')

    supply = pd.read_csv('./elec-fossil-nuclear-renewables.csv')
    supply = supply[supply['Entity'].isin(['United States', 'United Kingdom', 'Canada'])].set_index('Entity')
    supply.drop(['Code'], axis=1, inplace=True)
    colnames = ['Electricity from renewables - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)', 'Electricity from nuclear - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)', 'Electricity from fossil fuels - TWh (adapted for visualization of chart elec-fossil-nuclear-renewables)']
    supply['Supply'] = sum(supply[k] for k in colnames)
    supply = supply.reset_index()
    supply = supply.pivot(index='Entity', columns='Year', values='Supply')
    

    us_ref = supply.loc['United States', range(2010, 2024)].mean()
    uk_ref = supply.loc['United Kingdom', range(2010, 2024)].mean()
    can_ref = supply.loc['Canada', range(2010, 2024)].mean()
    
    supply = pd.concat([supply, pd.DataFrame(
        np.array([
            random_array(us_ref, us_ref*0.05, 15),
            random_array(uk_ref, uk_ref*0.05, 15),
            random_array(can_ref, can_ref*0.05, 15)
        ]),
        index=['United States', 'United Kingdom', 'Canada'],
        columns=[str(s) for s in range(2025, 2040)]
    )], axis=1)
    supply.index = supply.index.map(lambda x: x + ' Supply')
    
    supply.columns = set(str(k) for k in supply.columns)

    supply.columns = [str(col) for col in supply.columns]
    demand.columns = [str(col) for col in demand.columns]
    df = pd.concat([demand, supply], axis=0)

    d = df.loc[['United States Demand', 'Canada Demand', 'United Kingdom Demand']].sum(axis=0)
    s = df.loc[['United States Supply', 'Canada Supply', 'United Kingdom Supply']].sum(axis=0)
    df.loc['Total Supply'] = s
    df.loc['Total Demand'] = d

    df.loc['Ratio'] = df.loc['Total Supply'] / df.loc['Total Demand']
    df = df.drop([str(k) for k in range(1985, 2010)], axis=1)
    df.to_csv('elec_final.csv') # for debugging
    return df
    

@app.post("/newvalues")
def newvalues():
    elec_df = elec()
    water_df = water()
    protein_df = protein()
    protein_df.columns = protein_df.columns.map(lambda x: str(x))

    water_ref_ratio = np.mean([water_df.loc['Ratio'][str(k)] for k in range(2010, 2020)])
    elec_ref_ratio = np.mean([elec_df.loc['Ratio'][str(k)] for k in range(2010, 2020)])
    protein_ref_ratio = np.mean([protein_df.loc['Ratio'][str(k)] for k in range(2010, 2020)])

    fig, ax = plt.subplots()
    ax.plot(range(2010, 2040), elec_df.loc['Ratio'], label="Electricity")
    ax.plot(range(2010, 2040), water_df.loc['Ratio'], label="Water")
    ax.plot(range(2010, 2040), protein_df.loc['Ratio'], label="Protein")
    ax.legend()
    ax.set_xlabel("Year")
    ax.set_ylabel("Supply / Demand Ratio")

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    base64_img1 = base64.b64encode(buf.getvalue()).decode('utf-8')

    fig, ax = plt.subplots()
    e_ratio = elec_df.loc['Ratio'] / elec_ref_ratio
    w_ratio = water_df.loc['Ratio'] / water_ref_ratio
    p_ratio = protein_df.loc['Ratio'] / protein_ref_ratio
    ax.plot(range(2010, 2040), e_ratio, label="Electricity", linestyle="dotted")
    ax.plot(range(2010, 2040), w_ratio, label="Water", linestyle="dotted")
    ax.plot(range(2010, 2040), p_ratio, label="Protein", linestyle="dotted")
    ax.plot(range(2010, 2040), (
        e_ratio + w_ratio + p_ratio
    ) / 3, label="Total supply normalized")
    ax.legend()
    ax.set_xlabel("Year")
    ax.set_ylabel("Supply / Demand Ratio")

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    base64_img2 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {'image1': f"data:image/png;base64,{base64_img1}",
            'image2': f"data:image/png;base64,{base64_img2}"}
    # return JSONResponse(
    #     content={
    #         'image1': f"data:image/png;base64,{base64_img1}",
    #         'image2': f"data:image/png;base64,{base64_img2}",
    #     },
    #     headers={
    #         "Access-Control-Allow-Origin": "*"
    #     },
    # )