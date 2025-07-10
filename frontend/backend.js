const apiUrl = import.meta.env.VITE_ALCHEMY_URL;
const privateKey = import.meta.env.VITE_PRIVATE_KEY;

import artifact from './contract.json' with { type: "json" };
import {ethers} from "ethers";

const tokenAddress = "0xf7F47D4E7D1568c0863065bd07f7C197B4eD0Cca";

const accounts = [
    "0x9966E7692817B333165c93111640Fe4E20988399",
    "0x8f552A85bf0F96E7c1e19BD1b768526DcD6d0D6b",
    "0x6D74324f37770f2672D712761B91C4b5e33642bD",
    "0x5f2668f4CBBaC071501CaC6c1d5bE0EEE1FB1aDd",
    "0x95f3C09092bD7831a839Ea3FD0558cEFbDc50416"
];


export async function rebase(ratio) {

    if (isNaN(ratio)) {
      return {result: "Ratio must be a number"}
    }

    const ratioFloat = parseFloat(ratio);
    if (ratioFloat < 1) {
      return {msg: "Ratio must be greater or equal than 1 (currently no token burning logic is in place", status: false}
    }

    const provider = new ethers.JsonRpcProvider(apiUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);

    const supply = await contract.totalSupply(); // BigInt
    const newSupply = BigInt(Math.floor(Number(supply) * ratioFloat));

      const diff = newSupply - supply;
      const mintPerAccount = diff / BigInt(accounts.length + 1);

      for (const acc of accounts) {
        let tx = await contract.mintTo(acc, mintPerAccount);
        await tx.wait();
      }

      const finaltx = await contract.mintTo(tokenAddress, mintPerAccount);
      await finaltx.wait();

    return {msg: `Increased supply by ratio ${ratio}`, status: true}
}

export async function increaseSupply(pct) {
try {
  if (isNaN(pct)) {
    return {msg: "Error: no valid pct value", status: false}
  }
  pct = BigInt(Math.floor(parseFloat(pct)));

  const provider = new ethers.JsonRpcProvider(apiUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);

  const supply = await contract.totalSupply(); // BigInt
  const extraSupply = (supply * pct) / BigInt(10000); // divide by 10000 instead of 100 to support decimal %
  console.log('extrasupply:', extraSupply);
  const mintPerAccount = extraSupply / BigInt(accounts.length + 1);


  for (const acc of accounts) {
      let tx = await contract.mintTo(acc, mintPerAccount);
      await tx.wait();
    }
  const finaltx = await contract.mintTo(tokenAddress, mintPerAccount);
  await finaltx.wait();

  return {msg: `Increased supply by ${pct}%`, status: true}
} catch (e) {
    return {msg: `An error occured: ${e}`, status: false}
}
}

export async function getBalances() {
    try {

    const provider = new ethers.JsonRpcProvider(apiUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);

    let result = [];
    for (const acc of accounts) {
    const bal = await contract.balanceOf(acc);
    result.push(bal.toString());
    }
    result.push(tokenAddress);

    return {msg: "Fetched balances", result: result, status: true}
} catch (e) {
    return {msg: `An error occured: ${e}`, status: false}
}

}


const pythonBackend = "https://basic-needs-unit-token-backend.vercel.app";
//const pythonBackend = "http://127.0.0.1:8000"

export async function changeSimulationParams() {
  try {
  const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${pythonBackend}/newvalues/`,
    params
  )
  if (response.status === 200) {
    console.log('succes!');
    return {msg: 'Changed simulation values', val: await response.json(), status: true}
  }
} catch(e) {
  return {msg: `An error occured: ${e}`, status: false}
}
}


