const hre = require('hardhat');
require('@nomiclabs/hardhat-web3');
const { BigNumber } = require('ethers');
require('dotenv').config();
const { readDeployment } = require('./utils');
const { ethers } = require('hardhat');

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_GOERLI_PRIVATE_KEY = process.env.ETH_GOERLI_PRIVATE_KEY;
const ETH_GOERLI_INFURA_ID = process.env.ETH_GOERLI_INFURA_ID;

async function main() {
    const provider = new ethers.providers.WebSocketProvider(
        `wss://goerli.infura.io/ws/v3/${ETH_GOERLI_INFURA_ID}`
    );

    const signer = new ethers.Wallet(ETH_GOERLI_PRIVATE_KEY, provider);

    const {
        abi: LinkRandomNumberComsumerV2ABI,
    } = require('../artifacts/contracts/LinkRandomNumberComsumerV2.sol/LinkRandomNumberConsumerV2.json');

    const deployment = readDeployment();
    const addr = deployment.LinkRandomNumberConsumerV2;

    if (!addr) {
        console.log('Please deploy contract LinkRandomNumberComsumerV2 first');
        return;
    }

    let randomNumberConsumer, iface;

    randomNumberConsumer = new ethers.Contract(addr, LinkRandomNumberComsumerV2ABI, provider);
    iface = new ethers.utils.Interface(LinkRandomNumberComsumerV2ABI);

    let random0ID, random0Res;

    // 监听randomNumberConsumer 的请求随机数事件
    const filterCall = {
        address: addr,
        topics: [ethers.utils.id('RequestId(address,uint256)')],
    };
    // 监听chainlink VRF Coordinator 的随机数回写事件
    const filterRes = {
        address: addr,
        topics: [ethers.utils.id('FulfillRandomness(uint256,uint256[])')],
    };

    console.log(`Listen on random number call...`);
    provider.on(filterCall, (log, event) => {
        console.log('event RequestId(address,uint256)');
        const { args } = iface.parseLog(log);
        if (args[0] === signer.address) {
            random0ID = args[1];
            console.log('random0 requestID: ', random0ID);
        } else {
            console.log('msg.sender not matched.');
        }
    });

    console.log(`Listen on random number result...`);
    provider.on(filterRes, (log, event) => {
        console.log('event FulfillRandomness(uint256,uint256[])');
        const { args } = iface.parseLog(log);
        console.log('args[0] :', args[0]);
        if (BigNumber.from(args[0]).eq(random0ID)) {
            random0Res = args[1];
            console.log('random0Res: ', random0Res.toString());
        } else {
            console.log('requestID not matched.');
        }
    });

    const tx0 = await randomNumberConsumer.connect(signer).requestRandomWords({
        // for sometimes , it will be fail if not specify the gasLimit
        gasLimit: 500000,
        gasPrice: 100000000000,
        // nonce: 8,
    });
    console.log('first transaction hash:', tx0.hash);

    // wait for the result event
    for (let i = 0; i < 500; i++) {
        if (random0Res) break;
        console.log(`${i}: Please be patient, it will take a little long time to get the result`);
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
