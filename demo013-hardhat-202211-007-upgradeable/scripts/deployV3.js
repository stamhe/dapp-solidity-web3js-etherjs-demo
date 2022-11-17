// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');
async function main() {
    // 这里的地址为前面部署的代理合约地址
    const proxyAddress = '0xAC961Fd25A70B1974C8232C8667FCa83DD32A82D';

    const DemoV3 = await hre.ethers.getContractFactory('DemoV3');
    console.log('Preparing upgrade...');
    /*
    透明代理模式升级合约时， upgradeProxy 中一共有两个步骤：
    1. 部署新的逻辑合约
    2. 调用 ProxyAdmin 合约的 upgrade 函数来更换新合约，两个参数分别是代理合约和新逻辑合约的地址

    https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#upgrade-proxy
    */
    await hre.upgrades.upgradeProxy(proxyAddress, DemoV3);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
