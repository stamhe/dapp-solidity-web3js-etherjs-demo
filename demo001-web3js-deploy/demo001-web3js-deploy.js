// npm install web3 solc@0.8.17 fs dotenv @openzeppelin/contracts
let Web3 = require('web3');
let solc = require('solc');
let fs = require('fs');

// Get privatekey from environment
require('dotenv').config();
const privatekey = process.env.ETH_PRIVATE_KEY;

// Load contract
const source = fs.readFileSync('Incrementer.sol', 'utf8');

// compile solidity
// https://docs.soliditylang.org/en/v0.8.0/using-the-compiler.html#compiler-input-and-output-json-description
const input = {
    language: 'Solidity',
    sources: {
        'Incrementer.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = tempFile.contracts['Incrementer.sol']['Incrementer'];

// Get bin & abi
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
var web3 = new Web3(web3Provider);

// Create account from privatekey
const account = web3.eth.accounts.privateKeyToAccount(privatekey);
const account_from = {
    privateKey: privatekey,
    accountAddress: account.address,
};

/*
   -- Deploy Contract --
*/
const Deploy = async () => {
    // Create contract instance
    const deployContract = new web3.eth.Contract(abi);

    // Create Tx
    const deployTx = deployContract.deploy({
        data: bytecode,
        arguments: [100], // Pass arguments to the contract constructor on deployment(_initialNumber in Incremental.sol)
    });

    // Sign Tx
    const deployTransaction = await web3.eth.accounts.signTransaction(
        {
            data: deployTx.encodeABI(),
            gas: 2000000,
            gasPrice: 15137387880,
        },
        account_from.privateKey
    );

    const deployReceipt = await web3.eth.sendSignedTransaction(deployTransaction.rawTransaction);

    // Your deployed contrac can be viewed at: https://goerli.etherscan.io/address/${deployReceipt.contractAddress}
    // You can change goerli in above url to your selected testnet.
    console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
Deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
