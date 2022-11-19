const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();
const keccak256 = require('keccak256');

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_GOERLI_PRIVATE_KEY = process.env.ETH_GOERLI_PRIVATE_KEY;
const ETH_GOERLI_INFURA_ID = process.env.ETH_GOERLI_INFURA_ID;

const provider = new ethers.providers.JsonRpcProvider(
    'http://127.0.0.1:8545'
    // `https://goerli.infura.io/v3/${ETH_GOERLI_INFURA_ID}`
    // `https://mainnet.infura.io/v3/${ETH_GOERLI_INFURA_ID}`
);

// 利用私钥和provider创建wallet对象 wtf test goerli private key
const privateKey = ETH_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const abi = ['function test1() public view returns (address)', 'function test2(uint256) public'];

const contractAddr = '0x2785cd7caa9c3a14f6bd4867cc5cc2555cec88be';

// 声明可写合约
const contractObj = new ethers.Contract(contractAddr, abi, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {
    try {
        const address = await wallet.getAddress();
        console.log(`0. wallet address: ${address}`);
        // call test1
        const res0 = await provider.call({ to: contractAddr, data: '0x6b59084d' });
        console.log(`1. owner address: ${res0}`);
        const slot0Value = await provider.getStorageAt(contractAddr, 0);
        console.log(`1. slot0Value: ${slot0Value}`);
        const slot1Value001 = await provider.getStorageAt(contractAddr, 1);
        console.log(`1. slot1Value001: ${slot1Value001}`);

        // call test2
        const tx = {
            to: contractAddr,
            data: '0xcaf446830000000000000000000000000000000000000000000000000000000000000005',
        };
        // iii. 发送交易，获得收据
        console.log(`2. 等待交易在区块链确认（需要几分钟）`);
        const receipt = await wallet.sendTransaction(tx);
        await receipt.wait(1); // 等待链上确认交易，可以写几个确认.
        // console.log(`\n3. ${receipt}`);
        const slot1Value002 = await provider.getStorageAt(contractAddr, 1);
        console.log(`4. slot1Value002: ${slot1Value002}`);
    } catch (err) {
        console.log(err);
    }
};
main();
