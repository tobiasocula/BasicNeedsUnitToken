require("dotenv").config({ path: __dirname + "/../.env" });

const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xf7F47D4E7D1568c0863065bd07f7C197B4eD0Cca";

  const Token = await ethers.getContractFactory("BasicNeedsUnitToken");

  console.log("Upgrading contract");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Token); 

  console.log("proxy address:", upgraded.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
