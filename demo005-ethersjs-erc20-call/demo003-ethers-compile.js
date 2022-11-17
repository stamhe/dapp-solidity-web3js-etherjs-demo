// https://docs.moonbeam.network/cn/builders/build/eth-api/libraries/ethersjs/

// 1. Import packages
const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");

// 2. Get path and load contract
const contractName = "MyTest";
const contractSourceContent = fs.readFileSync("MyTest.sol", "utf8");

// 3. Create input object
// https://learnblockchain.cn/docs/solidity/using-the-compiler.html
const input = {
    language: "Solidity",
    sources: {
        "MyTest.sol": {
            content: contractSourceContent,
        },
    },
    settings: {
        outputSelection: {
            // 使用通配符*，则表示所有合约
            "*": {
                // `*`可以用作通配符来请求所有内容
                "*": ["*"],
            },
        },
        // 指定需编译的EVM的版本。会影响代码的生成和类型检查。可用的版本为：homestead，tangerineWhistle，spuriousDragon，byzantium，constantinople
        evmVersion: "byzantium",
    },
};
// 4. Compile the contract
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const compiledContractObj = tempFile.contracts["MyTest.sol"][contractName];

// 5. Export contract data, 获取 abi 与 bytecode
const contractMyTestBytecode = compiledContractObj.evm.bytecode.object;
const contractMyTestAbi = compiledContractObj.abi;
var contractMyTestObj;
var contractMyTestAddr;

const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545",
    30303
);
const PrivateKey =
    "0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad";
const addr = "0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D";

const App = {
    // ethers 部署合约
    deployContract: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            factory = new ethers.ContractFactory(
                contractMyTestAbi,
                contractMyTestBytecode,
                signer
            );

            // 部署合约，参数会传递给合约的构造函数
            // let contract = await factory.deploy(100, 200);
            let contract = await factory.deploy();

            //合约还没有部署;我们必须等到它被挖出
            await contract.deployTransaction
                .wait(1)
                .then((txReceipt) => {
                    console.log(txReceipt);
                    // 部署交易有一旦挖出，合约地址就可用
                    contractMyTestAddr = contract.address;
                    console.log("new contract address:", contract.address);
                    console.log(
                        "new contract txhash: ",
                        contract.deployTransaction.hash
                    );
                })
                .catch((err) => {
                    console.log(err);
                });

            // 内部阻塞调用新合约
            this.MyTestSetAddress();
            return contract.address;
        } catch (err) {
            console.log(err);
        }
    },
    MyTestSetAddress: function () {
        try {
            let testAddress = "0x2c199aE0C0D32Bd86f7E441659aa5229F9508C28";

            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(
                contractMyTestAddr,
                contractMyTestAbi,
                signer
            );
            myTest
                .setAddress(testAddress, {
                    gasLimit: 1000000,
                    gasPrice: 15137387880,
                })
                .then((tx) => {
                    console.log(tx);
                    // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
                    provider
                        .waitForTransaction(tx.hash, 1)
                        .then((txReceipt) => {
                            console.log(
                                "MyTestSetAddress blockNo: ",
                                txReceipt.blockNumber,
                                " txHash: ",
                                tx.hash,
                                "txStatus: ",
                                txReceipt.status,
                                "txConfirmations: ",
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
    MyTestGetData: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(
                contractMyTestAddr,
                contractMyTestAbi,
                signer
            );
            let res = await myTest.getData();
            console.log("MyTestGetData res: ", res);
        } catch (err) {
            console.log(err);
        }
    },
    MyTestGetAddress: async function () {
        try {
            const signer = new ethers.Wallet(PrivateKey, provider);
            const myTest = new ethers.Contract(
                contractMyTestAddr,
                contractMyTestAbi,
                signer
            );
            let addrRes = await myTest.getAddress();
            console.log("MyTestGetAddress addrRes: ", addrRes);
            return addrRes;
        } catch (err) {
            console.log(err);
        }
    },
};

// 合约部署
App.deployContract().then((value) => {
    console.log("newContractAddress:", value);
});
