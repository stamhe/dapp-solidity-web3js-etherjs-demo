require('@nomiclabs/hardhat-web3');
require('dotenv').config();
const { saveDeployment } = require('./utils');
// const { ethers } = require('hardhat');
const hre = require('hardhat'); // 如果使用这个，那么下面的要用 hre.ethers.getSigners() 了...

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_GOERLI_PRIVATE_KEY = process.env.ETH_GOERLI_PRIVATE_KEY;
const ETH_GOERLI_INFURA_ID = process.env.ETH_GOERLI_INFURA_ID;
const LinkSubscriptionId = process.env.ETH_GOERLI_LINK_ID;

async function main() {
    try {
        const [deployer] = await hre.ethers.getSigners();

        console.log('Deploying contracts with the account:', deployer.address);

        // 部署 LinkRandomNumberConsumerV2 合约， 只能使用 goerli 网络，不能使用本地的网络...
        const link = await hre.ethers.getContractFactory('LinkRandomNumberConsumerV2');
        console.log('start deploy....');
        // const instance = await link.deploy(LinkSubscriptionId, { nonce: 6 });
        const instance = await link.deploy(LinkSubscriptionId);
        // console.log(instance);
        console.log('waiting to be deployed...');
        await instance.deployed();

        console.log('----------------------------------------------------');
        console.log('LinkRandomNumberConsumerV2 contract address:', instance.address);

        // save contract address to file
        saveDeployment({
            LinkRandomNumberConsumerV2: instance.address,
        });
    } catch (err) {
        console.log('deploy failed: ', err);
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
