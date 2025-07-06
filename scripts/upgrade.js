require("dotenv").config({ path: __dirname + "/../.env" });

const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xd0994625782155Fe371E8749696001E3c57eEdfe";

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
