require("dotenv").config({ path: __dirname + "/../.env" });

// latest implementation address: 0x38F3B7484728CF32Ab8e56129De80327844EEE5D

const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = "0xE8a23AB5b39F5FD1B00912B36c43fAfFD148e593";

  const Token = await ethers.getContractFactory("BasicNeedsUnitToken");

  console.log("Upgrading contract");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Token); 

  console.log("proxy address:", await upgraded.getAddress());
  console.log('implementation address:', await upgrades.erc1967.getImplementationAddress(proxyAddress));

}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
