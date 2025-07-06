
require('dotenv').config({ path: __dirname + '/../.env' });

const { upgrades } = require("hardhat");
const hre = require("hardhat");

const artifact = require('../artifacts/contracts/BasicNeedsUnitToken.sol/BasicNeedsUnitToken.json');




async function main() {
  const provider = new hre.ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
  const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const Token = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Deploying proxy...");
  console.log('Deploying from:', wallet.address);

  const TokenProxy = await upgrades.deployProxy(Token, [], {
  initializer: 'initialize',
  timeout: 600000,           // Wait up to 10 minutes (milliseconds)
  pollingInterval: 5000      // Check every 5 seconds
});

  console.log("Deployed to:", await TokenProxy.getAddress());
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });