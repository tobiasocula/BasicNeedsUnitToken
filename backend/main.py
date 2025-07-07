from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

population_US = 340_000_000
population_UK = 68_000_000
population_CAN = 40_000_000

total_population = population_US + population_UK + population_CAN

app = FastAPI()

# Allow frontend to access API (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def protein():
    """
    reference values (in):
    Canada demand                                                  106.593708
    United Kingdom of Great Britain and Northern Ireland demand    103.371944
    United States of America demand                                121.248296
    United States of America supply                                 58.068780
    United Kingdom of Great Britain and Northern Ireland supply     58.376587
    Canada supply                                                   51.767575
    Name: 2023, dtype: float64
    """
    us_demand_base = 121.248296
    us_supply_base = 58.068780
    uk_demand_base = 103.371944
    uk_supply_base = 58.376587
    can_demand_base = 106.593708
    can_supply_base = 51.767575

    us_demand = []
    us_supply = []
    uk_demand = []
    uk_supply = []
    can_demand = []
    can_supply = []

    total_demand = []
    total_supply = []

    for _ in range(6):
        us_demand.append(np.random.normal(
            us_demand[-1] if us_demand else us_demand_base,
            500
        ))
        us_supply.append(np.random.normal(
            us_supply[-1] if us_supply else us_supply_base,
            500
        ))
        uk_demand.append(np.random.normal(
            uk_demand[-1] if uk_demand else uk_demand_base,
            500
        ))
        uk_supply.append(np.random.normal(
            uk_supply[-1] if uk_supply else uk_supply_base,
            500
        ))
        can_demand.append(np.random.normal(
            can_demand[-1] if can_demand else can_demand_base,
            500
        ))
        can_supply.append(np.random.normal(
            can_supply[-1] if can_supply else can_supply_base,
            500
        ))
        total_demand.append(us_demand[-1] + uk_demand[-1] + can_demand[-1])
        total_supply.append(us_supply[-1] + uk_supply[-1] + can_supply[-1])

        return {
            'US Protein Demand': us_demand,
            'US Protein Supply': us_supply,
            'UK Protein Demand': uk_demand,
            'UK Protein Supply': uk_supply,
            'CAN Protein Demand': can_demand,
            'CAN Protein Supply': can_supply,
            'Total Protein Demand': total_demand,
            'Total Protein Supply': total_supply
        }



def water():

    """
    reference values (in billion m^3 per year):
    United States demand      444.396112
    United States supply     2818.000000
    United Kingdom demand       8.419000
    United Kingdom supply     145.000000
    Canada demand              36.253000
    Canada supply            2850.000000
    Name: 2021 [YR2021], dtype: float64
    """
    us_demand_base = 444.396112
    us_supply_base = 2818.000000
    uk_demand_base = 8.419000
    uk_supply_base = 145.000000
    can_demand_base = 36.253000
    can_supply_base = 2850.000000

    us_demand = []
    us_supply = []
    uk_demand = []
    uk_supply = []
    can_demand = []
    can_supply = []

    total_demand = []
    total_supply = []

    for _ in range(6):
        us_demand.append(np.random.normal(
            us_demand[-1] if us_demand else us_demand_base,
            500
        ))
        us_supply.append(np.random.normal(
            us_supply[-1] if us_supply else us_supply_base,
            500
        ))
        uk_demand.append(np.random.normal(
            uk_demand[-1] if uk_demand else uk_demand_base,
            500
        ))
        uk_supply.append(np.random.normal(
            uk_supply[-1] if uk_supply else uk_supply_base,
            500
        ))
        can_demand.append(np.random.normal(
            can_demand[-1] if can_demand else can_demand_base,
            500
        ))
        can_supply.append(np.random.normal(
            can_supply[-1] if can_supply else can_supply_base,
            500
        ))
        total_demand.append(us_demand[-1] + uk_demand[-1] + can_demand[-1])
        total_supply.append(us_supply[-1] + uk_supply[-1] + can_supply[-1])

        return {
            'US Water Demand': us_demand,
            'US Water Supply': us_supply,
            'UK Water Demand': uk_demand,
            'UK Water Supply': uk_supply,
            'CAN Water Demand': can_demand,
            'CAN Water Supply': can_supply,
            'Total Water Demand': total_demand,
            'Total Water Supply': total_supply
        }
    

def elec():

    """
    reference values: (in kWh per year):
    CAN Supply    6.589500e+11
    UK Supply     3.222900e+11
    US Supply     4.286890e+12
    CAN Demand    5.836994e+11
    UK Demand     2.948008e+11
    US Demand     4.409175e+12
    Name: 2022, dtype: float64
    """
    us_demand_base = 4.409175e+12
    us_supply_base = 4.286890e+12
    uk_demand_base = 4.409175e+12
    uk_supply_base = 4.286890e+12
    can_demand_base = 4.409175e+12
    can_supply_base = 4.286890e+12

    us_elec_demand = []
    us_elec_supply = []
    uk_elec_demand = []
    uk_elec_supply = []
    can_elec_demand = []
    can_elec_supply = []

    total_elec_demand = []
    total_elec_supply = []

    for _ in range(6):
        us_elec_demand.append(np.random.normal(
            us_elec_demand[-1] if us_elec_demand else us_demand_base,
            500
        ))
        us_elec_supply.append(np.random.normal(
            us_elec_supply[-1] if us_elec_supply else us_supply_base,
            500
        ))
        uk_elec_demand.append(np.random.normal(
            uk_elec_demand[-1] if uk_elec_demand else uk_demand_base,
            500
        ))
        uk_elec_supply.append(np.random.normal(
            uk_elec_supply[-1] if uk_elec_supply else uk_supply_base,
            500
        ))
        can_elec_demand.append(np.random.normal(
            can_elec_demand[-1] if can_elec_demand else can_demand_base,
            500
        ))
        can_elec_supply.append(np.random.normal(
            can_elec_supply[-1] if can_elec_supply else can_supply_base,
            500
        ))
        total_elec_demand.append(us_elec_demand[-1] + uk_elec_demand[-1] + can_elec_demand[-1])
        total_elec_supply.append(us_elec_supply[-1] + uk_elec_supply[-1] + can_elec_supply[-1])

    return {
        'US Elec Demand': us_elec_demand,
        'US Elec Supply': us_elec_supply,
        'UK Elec Demand': uk_elec_demand,
        'UK Elec Supply': uk_elec_supply,
        'CAN Elec Demand': can_elec_demand,
        'CAN Elec Supply': can_elec_supply,
        'Total Elec Demand': total_elec_demand,
        'Total Elec Supply': total_elec_supply
    }

def ratios(p, w, e):
    return {

    }


@app.post("/newvalues")
def newvalues():
    p = protein()
    w = water()
    e = elec()
    return {
        'Protein': p,
        'Water': w,
        'Electricity': e,
        'Ratios': ratios(p, w, e)
    }
    


class Generate(BaseModel):
    values: list


def generate_raw(values):
    fig, ax = plt.subplots()
    # plotting
    ratios = values[-1] # is a dict
    ax.plot(ratios['Year'], ratios['Electricity Ratios'])
    ax.plot(ratios['Year'], ratios['Fat Ratios'])
    ax.plot(ratios['Year'], ratios['Kcal (Energy) Ratios'])
    ax.plot(ratios['Year'], ratios['Protein Ratios'])
    ax.plot(ratios['Year'], ratios['Water Ratios'])

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)
    base64_img = base64.b64encode(buf.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{base64_img}"

def generate_combined(values):
    fig, ax = plt.subplots()
    # plotting


@app.post("/generate")
def generate(query: Generate):
    # query.values: array
    # query.values[i]: {"Year": Array, "US Electricity Demand": Array, ...}
    
    return {"image1": generate_raw(query.values),
            "image2": generate_combined(query.values)}