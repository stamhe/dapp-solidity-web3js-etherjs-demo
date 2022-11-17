require('@nomicfoundation/hardhat-toolbox');
const fs = require('fs');
require('dotenv').config();

require('@openzeppelin/hardhat-upgrades');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

function mnemonic() {
    return process.env.PRIVATE_KEY;
}
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_GOERLI_PRIVATE_KEY = process.env.ETH_GOERLI_PRIVATE_KEY;
const ETH_GOERLI_INFURA_ID = process.env.ETH_GOERLI_INFURA_ID;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
    defaultNetwork: 'myself',
    networks: {
        myself: {
            url: 'http://127.0.0.1:8545',
            chainId: 30303,
            // 可以设置一个固定的gasPrice，在测试gas消耗的时候会很有用
            gasPrice: 80000000,
            // 测试账号列表
            accounts: [
                ETH_PRIVATE_KEY,
                '0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a',
                '0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0',
            ],
        },
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: mainnetRpcUrl
            // }
        },
        goerli: {
            url: 'https://goerli.infura.io/v3/' + ETH_GOERLI_INFURA_ID, //<---- YOUR INFURA ID! (or it won't work)
            // url: 'wss://goerli.infura.io/ws/v3/' + ETH_GOERLI_INFURA_ID, //<---- YOUR INFURA ID! (or it won't work)
            accounts: [ETH_GOERLI_PRIVATE_KEY],
            // 可以设置一个固定的gasPrice，在测试gas消耗的时候会很有用
            gasPrice: 100000000000, // 100 gwei
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        feeCollector: {
            default: 1,
        },
    },
    solidity: {
        version: '0.8.17', // 合约编译的版本，必填
        settings: {
            // 编译设置，选填
            optimizer: {
                // 优化设置
                enabled: true,
                runs: 200,
            },
        },
    },
    etherscan: {
        apiKey: '1234',
    },
    mocha: {
        timeout: 6000000000000000,
    },
};
