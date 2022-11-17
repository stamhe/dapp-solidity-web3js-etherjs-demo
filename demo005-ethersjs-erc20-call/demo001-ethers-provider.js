// ethers 5.7.2
const { ethers } = require('ethers');
const fs = require('fs');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545', 30303);
const PrivateKey = '0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad';
const addr = '0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D';
const addr2 = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';
const App = {
    getBalance: async function (address) {
        try {
            balance = await provider.getBalance(address);
            console.log(balance);

            // Often you need to format the output to something more user-friendly,
            // such as in ether (instead of wei)
            balanceStr = ethers.utils.formatEther(balance);
            // '0.182826475815887608'
            console.log(balanceStr, ' ether');

            // If a user enters a string in an input field, you may need
            // to convert it from ether (as a string) to wei (as a BigNumber)
            ethers.utils.parseEther('1.0');
            // { BigNumber: "1000000000000000000" }
        } catch (err) {
            console.log(err);
        }
    },
    getBlock: async function (blockNo) {
        try {
            let block;
            await provider.getBlock(blockNo).then(value => {
                block = value;
                return value;
            });
            console.log(block);
        } catch (err) {
            console.log(err);
        }
    },
    sendTx: async function (from, to, value) {
        try {
            let signer = provider.getSigner(from);
            const tx = await signer.sendTransaction({
                from: from,
                to: to,
                value: ethers.utils.parseEther(value),
            });
            // console.log(tx);
            console.log('txid = ', tx.hash);
        } catch (err) {
            console.log(err);
        }
    },
    totalVotesFor: async function (voteForAddr) {
        try {
            // Read-Only; By connecting to a Provider, allows:
            // const myVote = new ethers.Contract(contractAddr, contractAbi, provider);

            // Read-Write; By connecting to a Signer, allows:
            let signer = provider.getSigner(addr);
            // const signer = new ethers.Wallet(PrivateKey, provider);
            const myVote = new ethers.Contract(contractAddr, contractAbi, signer);
            // or let myVote = contract.connect(wallet);

            let voteForAddrTmp = ethers.utils.hexZeroPad(voteForAddr, 32);
            let currentValue = await myVote.totalVotesFor(voteForAddrTmp);
            console.log(voteForAddr, ' ', currentValue, ' tickets...');
        } catch (err) {
            console.log(err);
        }
    },
    voteForCandidate: async function (voteForAddr) {
        try {
            // Read-Only; By connecting to a Provider, allows:
            // let signer = provider.getSigner(addr);
            // const erc20 = new ethers.Contract(address, abi, provider);

            // Read-Write; By connecting to a Signer, allows:
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myVote = new ethers.Contract(contractAddr, contractAbi, signer);
            let voteForAddrTmp = ethers.utils.hexZeroPad(voteForAddr, 32);
            // await myVote.voteForCandidate(voteForAddrTmp, {
            //     gasLimit: 1000000,
            //     gasPrice: 15137387880
            // });

            // const gasPrice = signer.gasPrice();
            const gasLimit = await myVote.estimateGas
                .voteForCandidate(voteForAddrTmp)
                .then(value => {
                    return value;
                });
            // console.log("gasPrice: ", gasPrice);
            console.log('gasLimit: ', gasLimit);
        } catch (err) {
            console.log(err);
        }
    },
    MyTestGetCount: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            let totalCount = await myTest.getCount();
            console.log(
                'MyTestGetCount totalCount: ',
                totalCount.toNumber(),
                ' totalCountStr: ',
                totalCount.toString()
            );
        } catch (err) {
            console.log(err);
        }
    },
    MyTestAddCount: function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            myTest
                .addCount(3, {
                    gasLimit: 1000000,
                    gasPrice: 15137387880,
                })
                .then(tx => {
                    console.log(tx);
                    // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
                    provider.waitForTransaction(tx.hash, 1).then(txReceipt => {
                        console.log(
                            'MyTestAddCount blockNo: ',
                            txReceipt.blockNumber,
                            ' txHash: ',
                            tx.hash,
                            'txStatus: ',
                            txReceipt.status,
                            'txConfirmations: ',
                            txReceipt.confirmations
                        );
                        this.MyTestGetCount();
                    });
                    return tx;
                });
        } catch (err) {
            console.log(err);
        }
    },
    MyTestSetData: function () {
        try {
            let testAddress = '0x2c199aE0C0D32Bd86f7E441659aa5229F9508C28';
            let bytes32Data = ethers.utils.hexZeroPad(testAddress, 32);

            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            myTest
                .setData(bytes32Data, {
                    gasLimit: 1000000,
                    gasPrice: 15137387880,
                })
                .then(tx => {
                    console.log(tx);
                    // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
                    provider.waitForTransaction(tx.hash, 1).then(txReceipt => {
                        console.log(
                            'MyTestSetData blockNo: ',
                            txReceipt.blockNumber,
                            ' txHash: ',
                            tx.hash,
                            'txStatus: ',
                            txReceipt.status,
                            'txConfirmations: ',
                            txReceipt.confirmations
                        );
                        // this.MyTestGetCount();
                        this.MyTestSetAddress();
                    });
                    return tx;
                });
        } catch (err) {
            console.log(err);
        }
    },
    MyTestSetAddress: function () {
        try {
            let testAddress = '0x2c199aE0C0D32Bd86f7E441659aa5229F9508C28';

            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            myTest
                .setAddress(testAddress, {
                    gasLimit: 1000000,
                    gasPrice: 15137387880,
                })
                .then(tx => {
                    console.log(tx);
                    // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
                    provider.waitForTransaction(tx.hash, 1).then(txReceipt => {
                        console.log(
                            'MyTestSetAddress blockNo: ',
                            txReceipt.blockNumber,
                            ' txHash: ',
                            tx.hash,
                            'txStatus: ',
                            txReceipt.status,
                            'txConfirmations: ',
                            txReceipt.confirmations
                        );
                        this.MyTestGetAddress();
                        this.MyTestGetData();
                    });
                    return tx;
                });
        } catch (err) {
            console.log(err);
        }
    },
    MyTestGetAddress: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            let addrRes = await myTest.getAddress();
            console.log('MyTestGetAddress addrRes: ', addrRes);
        } catch (err) {
            console.log(err);
        }
    },
    MyTestGetData: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(contractMyTestAddr, contractMyTestAbi, signer);
            let res = await myTest.getData();
            console.log('MyTestGetData res: ', res);
        } catch (err) {
            console.log(err);
        }
    },
};

// provider.getBlockNumber().then(function (latestBlockNo) {
//     console.log("latestBlockNo = ", latestBlockNo);
// });

// App.getBlock(1);
// App.sendTx(addr, addr2, "0.1");
// App.getBalance(addr);

console.log('==========================================');

const contractAddr = '0xF304B3a22fDf755F705F44f6BB9cf4FE2F50Da4b';
const contractMyTestAddr = '0xbACceffa37F477E5d55207678BEAb91f125feB5f';

const aInBytes32 = '0x2c199aE0C0D32Bd86f7E441659aa5229F9508C28';
const bInBytes32 = '0x5365Cf626bA01349228D13e2B5c130e762515f3E';

// truffle
// var jsonFile = "build/contracts/MyVote.json";
// var parsed = JSON.parse(fs.readFileSync(jsonFile));
// var contractAbi = parsed.abi;

// ethers
// var jsonFile = "build/contracts/MyVote2.json";
// var contractAbi = JSON.parse(fs.readFileSync(jsonFile));

// myVote
const contractAbi = [
    'function voteForCandidate(bytes32 candidateName) public ',
    'function totalVotesFor(bytes32 candidateName) public view returns(uint8)',
];

// MyTest
// const contractMyTestAbi = [
//     "function getCount() public view returns (uint256)",
//     "function addCount(uint256 step) public",
//     "function setData(bytes32 _data) public returns (bytes32)",
//     "function getData() public view returns (bytes32)",
//     "function setAddress(address _address) public returns (address)",
//     "function getAddress() public view returns (address)",
// ];
var jsonFile = 'build/contracts/MyTest.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var contractMyTestAbi = parsed.abi;

// App.totalVotesFor(aInBytes32);
// App.voteForCandidate(aInBytes32);

App.MyTestGetCount();
// App.MyTestAddCount();
// App.MyTestGetCount();

App.MyTestSetData();
