// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);
    const ethBalanceStr = (await deployer.getBalance()).toString();

    const ethBalanceStr2 = ethers.utils.formatUnits(ethers.BigNumber.from(ethBalanceStr), 'ether');

    console.log('Account ETH balance: ', ethBalanceStr2);

    const Token = await ethers.getContractFactory('SimpleToken');
    // 2 位小数总数是 10 * 10 * 10000 = 1000,000，注意test case 里面的数量
    const contracctObj = await Token.deploy('StamHe', 'STAM', 2, 10000);

    console.log('new contract address:', contracctObj.address);

    let balance = await contracctObj.balanceOf(deployer.address);
    console.log(`${deployer.address} token balance: ${balance.toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
