const { ethers } = require('ethers');
const fs = require('fs');
const contractFile = require('./compile');
//var sleep = require('sleep');

require('dotenv').config();
const privatekey = process.env.ETH_PRIVATE_KEY;

/*
   -- Define Provider & Variables --
*/
// Provider

// http provider
// const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", 30303);

// websocket provider
const provider = new ethers.providers.WebSocketProvider('ws://127.0.0.1:8545', 30303);

// Variables
const account_from = {
    privateKey: privatekey,
};

const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// Create Wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

/*
   -- Deploy Contract --
*/
// Create Contract Instance with Signer
const deployContractIns = new ethers.ContractFactory(abi, bytecode, wallet);

const Trans = async () => {
    console.log('===============================1. Deploy Contract');
    console.log(`Attempting to deploy from account: ${wallet.address}`);

    // Send Tx (Initial Value set to 5) and Wait for Receipt
    // 2 位小数总数是 10 * 10 * 10000 = 1000,000，注意test case 里面的数量
    const deployedContract = await deployContractIns.deploy('StamHe', 'STAM', 2, 10000, {
        gasLimit: 4000000,
        gasPrice: 4000000,
    });
    await deployedContract.deployed();

    console.log(`Contract deployed at address: ${deployedContract.address}`);

    /*
   -- Send Function --
   */
    // Create Contract Instance
    console.log();
    console.log('===============================2. Call Transaction Interface Of Contract');
    const transactionContract = new ethers.Contract(deployedContract.address, abi, wallet);

    const targetAddr = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';
    console.log(`Transfer 10000 to address: ${targetAddr}`);

    // Call Contract
    const transferReceipt = await transactionContract.transfer(targetAddr, 10000);
    await transferReceipt.wait();

    console.log(`Tx successful with hash: ${transferReceipt.hash}`);

    /*
   -- Call Function --
   */
    // Create Contract Instance
    console.log();
    console.log('===============================3. Call Read Interface Of Contract');
    const providerContract = new ethers.Contract(deployedContract.address, abi, provider);

    // Call Contract
    const balanceVal = await providerContract.balanceOf(targetAddr);

    console.log(`balance of ${targetAddr} is : ${balanceVal}`);

    /*
   -- Listen to Events --
   */
    console.log();
    console.log('===============================4. Listen To Events');

    // Listen to event once
    providerContract.once('Transfer', (from, to, value) => {
        console.log(
            `I am a once Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
        );
    });

    // Listen to events continuously
    providerContract.on('Transfer', (from, to, value) => {
        console.log(
            `I am a longstanding Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
        );
    });

    // Listen to events with filter
    let topic = ethers.utils.id('Transfer(address,address,uint256)');
    let filter = {
        address: deployedContract.address,
        topics: [topic],
        fromBlock: await provider.getBlockNumber(),
    };

    providerContract.on(filter, (from, to, value) => {
        console.log(
            `I am a filter Event Listener, I have got an event Transfer, from: ${from}   to: ${to}   value: ${value}`
        );
    });

    for (let step = 0; step < 3; step++) {
        let transferTransaction = await transactionContract.transfer(targetAddr, 10);
        await transferTransaction.wait();

        if (step == 2) {
            console.log('Going to remove all Listeners');
            providerContract.removeAllListeners();
        }
    }
};

Trans()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
