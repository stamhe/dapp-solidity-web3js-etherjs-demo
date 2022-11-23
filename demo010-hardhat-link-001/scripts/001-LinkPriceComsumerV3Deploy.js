// const { ethers } = require('hardhat');
const hat = require('hardhat'); // 如果使用这个，那么下面的要用 hat.ethers.getSigners() 了...
require('@nomiclabs/hardhat-web3');

async function main() {
    const [deployer] = await hat.ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    // PRICE_FEED_CONTRACT 在 goerli 上的合约地址
    const PRICE_FEED_CONTRACT = '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e';

    // 部署 PriceConsumerV3 合约
    const priceConsumerV3 = await hat.ethers.getContractFactory('LinkPriceConsumerV3');
    console.log('start deploy....');
    const PriceConsumerV3Ins = await priceConsumerV3.deploy(PRICE_FEED_CONTRACT, {
        // nonce: 9,
    });
    console.log('waiting to be deployed...');
    await PriceConsumerV3Ins.deployed();

    console.log('----------------------------------------------------');
    console.log('LinkPriceConsumerV3 contract address:', PriceConsumerV3Ins.address);

    //await priceConsumerV3.deployed()
    console.log('Read Price from  PRICE_FEED: ');

    await PriceConsumerV3Ins.getLatestPrice().then(function (data) {
        console.log('price data: ', data);
        // console.log('Current price of ETH / USD is: ', web3.utils.hexToNumber(data._hex));
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
