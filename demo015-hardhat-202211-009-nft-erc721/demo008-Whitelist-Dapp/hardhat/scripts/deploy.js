// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const whitelistContract = await ethers.getContractFactory("Whitelist");

    // here we deploy the contract
    const deployedWhitelistContract = await whitelistContract.deploy(10);
    // 10 is the Maximum number of whitelisted addresses allowed

    // Wait for it to finish deploying
    await deployedWhitelistContract.deployed();

    // print the address of the deployed contract
    console.log("Whitelist Contract Address: ", deployedWhitelistContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
