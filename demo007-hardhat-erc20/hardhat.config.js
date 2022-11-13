require('@nomicfoundation/hardhat-toolbox');
// require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

// 自定义任务
// npx hardhat accountlist
task('accountlist', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    paths: {
        sources: './contracts', // 合约目录
        tests: './test', // 测试文件目录
        cache: './cache', // 缓存目录，由hardhat自动生成
        artifacts: './artifacts',
    },
    // defaultNetwork: "hardhat", // @nomicfoundation/hardhat-network-helpers 好像不能通用
    defaultNetwork: 'myself',
    networks: {
        myself: {
            url: 'http://127.0.0.1:8545',
            chainId: 30303,
            // 可以设置一个固定的gasPrice，在测试gas消耗的时候会很有用
            gasPrice: 4000000,
            // 测试账号列表
            accounts: [
                ETH_PRIVATE_KEY,
                '0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a',
                '0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0',
            ],
        },
        hardhat: {
            // 可以设置一个固定的gasPrice，在测试gas消耗的时候会很有用
            gasPrice: 4000000,
        },
        // rinkeby: {
        //   url: RINKEBY_RPC_URL,
        //   accounts: [RINKEBY_PRIVATE_KEY],
        //   chainId: 4,
        // },
    },
    // 测试框架设置
    mocha: {
        timeout: 20000, // 运行单元测试的最大等待时间
    },
};
