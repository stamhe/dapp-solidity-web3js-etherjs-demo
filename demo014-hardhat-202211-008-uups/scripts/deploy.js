// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
    const Demo = await hre.ethers.getContractFactory('Demo');
    console.log('Deploying Demo...');
    // initializer 后面的参数为初始化函数的名字，这里为 initialize
    // 中括号的参数为初始化函数的参数，UUPS 升级合约这里添加了参数 => kind: 'uups'
    const demo = await hre.upgrades.deployProxy(Demo, [101], {
        initializer: 'initialize',
        kind: 'uups',
    });
    await demo.deployed();
    // 这里打印的地址为代理合约的地址
    console.log('Proxy Contract Address: ', demo.address);
    const logicContractAddress = await hre.upgrades.erc1967.getImplementationAddress(demo.address);
    console.log('Logic Contract Address: ', logicContractAddress);
}

// 这里也可以简化为 main()，后面的都省略也可以
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
