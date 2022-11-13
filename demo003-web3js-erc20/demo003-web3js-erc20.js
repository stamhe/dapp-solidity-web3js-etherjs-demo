const Web3 = require('web3');
const fs = require('fs');

// 本 demo 的 compile.js 加入了 循环引入依赖的 sol 文件 的功能
const contractFile = require('./compile');

require('dotenv').config();
const privatekey = process.env.ETH_PRIVATE_KEY;
/*
   -- Define Provider & Variables --
*/
// 第二组私钥的地址，用于接收 erc20-token
const receiver = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';

const ganacheAddr = '127.0.0.1:8545';

// Provider
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${ganacheAddr}`));

//account
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
    privateKey: account.privateKey,
    accountaddress: account.address,
};

// sol ---> abi + bin
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

/*
   -- Deploy Contract --
*/
const Trans = async () => {
    console.log(`Attempting to deploy from account ${account_from.accountaddress}`);
    web3.eth.getBlockNumber(function (error, result) {
        console.log(result);
    });
    // Create deploy Contract Instance
    const deployContract = new web3.eth.Contract(abi);

    // method 1
    // Create Constructor Tx
    const deployTx = deployContract.deploy({
        data: bytecode,
        arguments: ['StamHe', 'STAM', 2, 10000], // 2 位小数，总数就是 10 * 10 * 10000 = 1000,000
    });

    // Sign Transacation and Send
    const deployTransaction = await web3.eth.accounts.signTransaction(
        {
            data: deployTx.encodeABI(),
            gas: 4000000, // 部署合约需要更多的 gas
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    // Send Tx and Wait for Receipt
    const deployReceipt = await web3.eth.sendSignedTransaction(deployTransaction.rawTransaction);
    console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);

    const erc20Contract = new web3.eth.Contract(abi, deployReceipt.contractAddress);

    // build the Tx，转移 erc20-token
    const transferTx = erc20Contract.methods.transfer(receiver, 10000).encodeABI();

    // Sign Tx with PK
    const transferTransaction = await web3.eth.accounts.signTransaction(
        {
            to: deployReceipt.contractAddress,
            data: transferTx,
            gas: 4000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    // Send Tx and Wait for Receipt
    await web3.eth.sendSignedTransaction(transferTransaction.rawTransaction);

    // 查询接收地址的 erc20-token 余额
    await erc20Contract.methods
        .balanceOf(receiver)
        .call()
        .then(result => {
            console.log(`The balance of receiver is ${result}`);
        });
};

Trans()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
