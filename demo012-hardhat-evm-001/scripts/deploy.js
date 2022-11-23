// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
    const s1ContractFactory = await hre.ethers.getContractFactory('Storage001');
    const s1ContractObj = await s1ContractFactory.deploy();

    await s1ContractObj.deployed();

    console.log(`s1 deployed to ${s1ContractObj.address}`);

    const s2ContractFactory = await hre.ethers.getContractFactory('Storage002');
    const s2ContractObj = await s2ContractFactory.deploy();

    await s2ContractObj.deployed();

    console.log(`s2 deployed to ${s2ContractObj.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
