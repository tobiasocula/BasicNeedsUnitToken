# Readme

Files for (only demo for now) "Basic Needs Unit Token" project.

Imagine a cryptographic token that is completely independent on any fiat currency and that maintains its value over time.
That is what this project is aiming for.

It uses a "basket" of goods consisting of a few human "basic needs" to define a measure of "value", currently containing protein, electricity and water.
The global demand and supply (in yearly terms, of a whole country) of these goods gets collected and compared, and a supply/demand ratio is computed. Currently, this is happening for three sample countries, being the US, UK and Canada.
The data was fetched from https://data.worldbank.org/ and https://www.worldwater.org/water-data/.
I have experimented with CPI data before, but figured that this method is not entirely independent from any form of fiat currency, since inflation itself gets measured in it. However, adding CPI data into the mix might be an idea for diversification of the derivation of "value".
In the future, it might be an idea to also throw in other sources of "value" in the mix, such as stock market indices, but this is just an idea.

This repository serves to create a demo implementation / visualisation for the project.
The contract has been deployed to Sepolia as well as 5 demo accounts, for the demo prototype.

Roadmap:
-Use a trading pool (like Uniswap) so people could exchange other currencies (like ETH) in exchange for BNU Token. (Currently it uses the contract itself as a pool (for the demo)).
-Use L2-technology to enhance cheap and high-speed transactions.
-Use ZK-proofs to ensure data transparency and trustlessness
-Implementing oracle implementations to provide real-time resource supply / demand data

Frontend demo application available at https://basic-needs-unit-token.vercel.app/.
