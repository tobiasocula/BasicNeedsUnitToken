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

appp = FastAPI()

# Allow frontend to access API (adjust origins as needed)
appp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def elec():
    df = pd.read_csv('electricity_sample_data.csv') # kWh per capita per year
    df = df[df['Country Name'].isin(['United States', 'United Kingdom', 'Canada'])]
    print(df)
    df = df.drop(['2024'], axis=1)

@appp.post("/newvalues")
def newvalues():
    elec()
    

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


@appp.post("/generate")
def generate(query: Generate):
    # query.values: array
    # query.values[i]: {"Year": Array, "US Electricity Demand": Array, ...}
    
    return {"image1": generate_raw(query.values),
            "image2": generate_combined(query.values)}