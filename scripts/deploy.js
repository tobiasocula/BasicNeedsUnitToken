
require('dotenv').config({ path: __dirname + '/../.env' });

console.log("PRIVATE_KEY from .env:", process.env.PRIVATE_KEY);
const { upgrades } = require("hardhat");
const { ethers } = require("ethers");  // <-- from ethers package, NOT hardhat

const artifact = require('../artifacts/contracts/BasicNeedsUnitToken.sol/BasicNeedsUnitToken.json');


async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const Token = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  const balance = await wallet.provider.getBalance(wallet.address);
  console.log("Deploying proxy...");
  console.log('Deploying from:', wallet.address);
  console.log('Balance:', ethers.formatEther(balance), 'ETH');

  const TokenProxt = await upgrades.deployProxy(Token, [], { initializer: 'initialize' });
  //await costTokenProxy.deployed();

  console.log("CostToken deployed to:", await TokenProxt.getAddress());
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });