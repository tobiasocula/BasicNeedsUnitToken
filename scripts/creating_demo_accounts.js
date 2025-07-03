const { ethers } = require("ethers");

for (let i=0; i<5; i++) {
    const wallet = ethers.Wallet.createRandom();
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
    console.log();
}

