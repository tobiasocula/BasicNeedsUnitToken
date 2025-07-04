
require('dotenv').config({ path: __dirname + '/../.env' });

const { upgrades } = require("hardhat");
const { ethers } = require("ethers");

const artifact = require('../artifacts/contracts/BasicNeedsUnitToken.sol/BasicNeedsUnitToken.json');


async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const Token = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Deploying proxy...");
  console.log('Deploying from:', wallet.address);

  const TokenProxy = await upgrades.deployProxy(Token, [], { initializer: 'initialize' });
  //await costTokenProxy.deployed();

  console.log("Deployed to:", await TokenProxy.getAddress());
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });