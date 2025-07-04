# Readme

Files for (only demo for now) "Basic Needs Unit Token" project.

The idea is to make a cryptographic token, completely independent on any fiat currency.
It uses a "basket" of goods consisting of a few human "basic needs", currently containing protein, fat, energy, electricity and water.
The global demand and supply (in yearly terms, of a whole country) of these goods gets collected and compared, and a supply/demand ratio is computed. Currently, this is happening for three sample countries, being the US, UK and Canada.
The data was fetched from https://data.worldbank.org/ and https://www.worldwater.org/water-data/.
I have experimented with CPI data before, but figured that this method is not entirely independent from any form of fiat currency, since inflation itself gets measured in it. However, adding CPI data into the mix might be an idea for diversification of the derivation of "value".

This repository serves to create a demo implementation / visualisation for this project.
This project is obviously not finished and lots more improvements / refinements are needed.
This just serves as a demo.

If this project makes it into production, the idea is to use a trading pool (like Uniswap) so people could exchange other currencies (like ETH) in exchange for some BNU Token.
Currently it uses the contract itself as a pool (for the demo).

Another thing to implement is the fetching of new resource data. This could happen every month or every year. The total supply gets updated based on the new ratio of the supply / demand of the resources. The system could either use an airdrop mechanism (like is happening in the demo) or 