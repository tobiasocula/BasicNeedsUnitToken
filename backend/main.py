from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

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



@app.post("/newvalues")
def newvalues():

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


class Generate(BaseModel):
    values: list

@app.post("/generate")
def generate(query: Generate):
    values = query.values
    return {'result': values}
