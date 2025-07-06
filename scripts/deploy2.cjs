const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const Token = await ethers.getContractFactory("BasicNeedsUnitToken");

  const proxy = await upgrades.deployProxy(Token, [], {
    initializer: "initialize",
    kind: "uups",
  });

  console.log("Proxy deployed to:", await proxy.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
