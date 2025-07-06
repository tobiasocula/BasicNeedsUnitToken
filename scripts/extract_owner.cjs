const { ethers } = require("ethers");
require('dotenv').config({ path: __dirname + '/../.env' });
const artifact = require('./contract.json');

async function main() {
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
const deployer = "0xd0994625782155Fe371E8749696001E3c57eEdfe";
const nonce = await provider.getTransactionCount(deployer, 8704262-1);
const proxyAddress = ethers.utils.getContractAddress({ from: deployer, nonce: nonce });
console.log('address:', proxyAddress);
}

// transaction: 0x13fde60cc8381a3f68c90d42e9677e173adf8adb12de8702534fd217029b89d7

async function check1() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const code = await provider.getCode("0xd227b302bf58331F1dcE306e6203584793a69D5c");
    console.log(code === '0x' ? "No contract code found" : "Contract deployed");
}
async function check2() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const proxy = new ethers.Contract("0xf7F47D4E7D1568c0863065bd07f7C197B4eD0Cca",
        artifact.abi, provider);
    console.log(await proxy.name()); // returns "BasicNeedsUnitToken"
}

//main();
//check1();
check2();