// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');
async function main() {
    // 这里的地址为前面部署的代理合约地址
    const proxyAddress = '0x89C64ccfc6Ca41cB7adb3DFCb6232D96405cf718';

    console.log('UUPS Proxy Address: ', proxyAddress);
    const DemoV2Factory = await hre.ethers.getContractFactory('DemoV3');

    /*
    UUPS 升级合约:
    1. 部署新的逻辑合约
    2. 调用代理合约的 upgradeTo 函数进行升级，参数是新的逻辑合约地址
    */
    const proxyContract = await hre.upgrades.upgradeProxy(proxyAddress, DemoV2Factory);
    console.log('Proxy Contract Address: ', proxyContract.address);

    const logicContractAddress = await hre.upgrades.erc1967.getImplementationAddress(
        proxyContract.address
    );
    console.log('Logic Contract Address: ', logicContractAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
