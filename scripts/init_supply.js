
import {ethers} from "ethers";
import dotenv from "dotenv";
dotenv.config();

const tokenAddress = "0xf7F47D4E7D1568c0863065bd07f7C197B4eD0Cca";

const accounts = [
    "0x9966E7692817B333165c93111640Fe4E20988399",
    "0x8f552A85bf0F96E7c1e19BD1b768526DcD6d0D6b",
    "0x6D74324f37770f2672D712761B91C4b5e33642bD",
    "0x5f2668f4CBBaC071501CaC6c1d5bE0EEE1FB1aDd",
    "0x95f3C09092bD7831a839Ea3FD0558cEFbDc50416"
];

import artifact from './contract.json' with { type: "json" };

async function initAirdrop() {
try {
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);
  console.log('created initials');

    // estimate gas
    // const gasEstimate = await contract.mintTo.estimateGas(await wallet.getAddress(), ethers.utils.parseUnits('1000', 18));
    // const gasPrice = await provider.getGasPrice();
    // const totalCost = gasEstimate * gasPrice;
    // console.log(`Estimated gas: ${gasEstimate.toString()}`);
    // console.log(`Gas price: ${gasPrice.toString()}`);
    // console.log(`Estimated total cost (wei): ${totalCost.toString()}`);


  for (const acc of accounts) {
      let tx = await contract.mintTo(acc, ethers.utils.parseUnits('1000', 18));
      await tx.wait();
      console.log('minted');
    }
    tx = await contract.mintTo(tokenAddress, ethers.utils.parseUnits('1000', 18));
    await tx.wait();
  return {msg: "Airdrop done", status: true}
} catch (e) {
    console.log('failed with:', e);
    return {msg: `An error occured: ${e}`, status: false}
}
}

initAirdrop();