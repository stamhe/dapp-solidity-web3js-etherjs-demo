const Web3 = require('web3');
const fs = require('fs');
const contractOfIncrementer = require('./compile');

require('dotenv').config();
const privatekey = process.env.ETH_PRIVATE_KEY;

/*
   -- Define Provider --
*/
const ganacheAddr = '127.0.0.1:8545';

web3Provider = new Web3.providers.HttpProvider(`http://${ganacheAddr}`);
var web3 = new Web3(web3Provider);

// Create account with privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
    privateKey: privatekey,
    accountAddress: account.address,
};

// Get abi & bin
const bytecode = contractOfIncrementer.evm.bytecode.object;
const abi = contractOfIncrementer.abi;

/*
*
*
*   -- Verify Deployment --
*

*/
const Trans = async () => {
    console.log('============================ 1. Deploy Contract');
    console.log(`Attempting to deploy from account ${account.address}`);

    // Create Contract Instance
    const deployContract = new web3.eth.Contract(abi);

    // Create Deployment Tx
    const deployTx = deployContract.deploy({
        data: bytecode,
        arguments: [5], // 构造函数初始化传参
    });

    // Sign Tx
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            data: deployTx.encodeABI(),
            gas: 2000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    // Get Transaction Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Contract deployed at address: ${createReceipt.contractAddress}`);

    const deployedBlockNumber = createReceipt.blockNumber;

    /*
     *
     *
     *
     * -- Verify Interface of Increment --
     *
     *
     */
    // Create the contract with contract address
    console.log();
    console.log('============================ 2. Call Contract Interface getNumber');
    let incrementer = new web3.eth.Contract(abi, createReceipt.contractAddress);

    console.log(`Making a call to contract at address: ${createReceipt.contractAddress}`);

    let number = await incrementer.methods.getNumber().call();
    console.log(`The current number stored is: ${number}`);

    // Add 3 to Contract Public Variable
    console.log();
    console.log('============================ 3. Call Contract Interface increment');
    const _value = 3;
    let incrementTx = incrementer.methods.increment(_value);

    // Sign with Pk
    let incrementTransaction = await web3.eth.accounts.signTransaction(
        {
            to: createReceipt.contractAddress,
            data: incrementTx.encodeABI(),
            gas: 2000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    // Send Transactoin and Get TransactionHash
    const incrementReceipt = await web3.eth.sendSignedTransaction(
        incrementTransaction.rawTransaction
    );
    console.log(`Tx successful with hash: ${incrementReceipt.transactionHash}`);

    number = await incrementer.methods.getNumber().call();
    console.log(`After increment, the current number stored is: ${number}`);

    /*
     *
     *
     *
     * -- Verify Interface of Reset --
     *
     *
     */
    console.log();
    console.log('============================ 4. Call Contract Interface reset');
    const resetTx = incrementer.methods.reset();

    const resetTransaction = await web3.eth.accounts.signTransaction(
        {
            to: createReceipt.contractAddress,
            data: resetTx.encodeABI(),
            gas: 2000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    const resetcReceipt = await web3.eth.sendSignedTransaction(resetTransaction.rawTransaction);
    console.log(`Tx successful with hash: ${resetcReceipt.transactionHash}`);
    number = await incrementer.methods.getNumber().call();
    console.log(`After reset, the current number stored is: ${number}`);

    /*
     *
     *
     *
     * -- Listen to Event Increment --
     *
     *
     */
    console.log();
    console.log('============================ 5. Listen to Events');
    console.log(' Listen to Increment Event only once && continuouslly');

    // 只有 websocket 才支持 event
    // ganache-cli 默认启动 websocket
    const web3Socket = new Web3(new Web3.providers.WebsocketProvider(`ws://${ganacheAddr}`));

    incrementer = new web3Socket.eth.Contract(abi, createReceipt.contractAddress);

    // listen to  Increment event only once
    incrementer.once('Increment', (error, event) => {
        console.log('I am a onetime event listner, I am going to die now');
    });

    // listen to Increment event continuously
    incrementer.events.Increment(() => {
        console.log('I am a longlive event listener, I get a event now');
    });

    for (let step = 0; step < 3; step++) {
        incrementTransaction = await web3.eth.accounts.signTransaction(
            {
                to: createReceipt.contractAddress,
                data: incrementTx.encodeABI(),
                gas: 2000000,
                gasPrice: 15137387880,
            },
            account_from.privateKey
        );

        await web3.eth.sendSignedTransaction(incrementTransaction.rawTransaction);

        if (step == 2) {
            // clear all the listeners
            web3Socket.eth.clearSubscriptions();
            console.log('Clearing all the events listeners !!!!');
        }
    }

    /*
     *
     *
     *
     * -- Get past events --
     *
     *
     */
    console.log();
    console.log('============================ 6. Going to get past events');
    const pastEvents = await incrementer.getPastEvents('Increment', {
        fromBlock: deployedBlockNumber,
        toBlock: 'latest',
    });

    pastEvents.map(event => {
        console.log(event);
    });

    /*
     *
     *
     *
     * -- Check Transaction Error --
     *
     *
     */
    console.log();
    console.log('============================ 7. Check the transaction error');
    // 合约里面做了检查，increment() 函数必须传参大于 0
    incrementTx = incrementer.methods.increment(0);
    incrementTransaction = await web3.eth.accounts.signTransaction(
        {
            to: createReceipt.contractAddress,
            data: incrementTx.encodeABI(),
            gas: 2000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    await web3.eth
        .sendSignedTransaction(incrementTransaction.rawTransaction)
        .on('error', console.error);
};

Trans()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
