
import dotenv from 'dotenv';
dotenv.config(); // loads .env file into process.env

import { ethers } from 'ethers';
import artifact from './../artifacts/contracts/BasicNeedsUnitToken.sol/BasicNeedsUnitToken.json' with { type: 'json' };

const sampleNewRatio = 1.02 // mint 2% of total supply to users & exchange pool (in this case contract itself)

const tokenAddress = "0xb8b7Fd8003d0c975694F4c7A348a2946fEE4E33B";

async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const token = new ethers.Contract(tokenAddress, artifact.abi, wallet);
    
    await token.


}

main();