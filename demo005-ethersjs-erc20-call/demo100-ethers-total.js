// 需要导入 ethers 包
const { ethers } = require('ethers');
const solc = require('solc');
require('dotenv').config();
const contractFile = require('./compile-erc20');
const contractMyTest = require('./compile-mytest');

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

// 构建 provider，可以理解为与区块链交互的桥梁
// 1. 可使用最基础的 JsonRpcProvider 进行构建 provider
// const INFURA_ID = 'xxx..';
// const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545', 30303);

// 2. 也可使用封装好的特定 provider，例如 AlchemyProvider，InfuraProvider
// 使用 alchemy 的时候，第一个参数若为 null 则代表主网
// const ALCHEMY_ID = `xxx...`;
// const provider = new ethers.providers.AlchemyProvider('null', ALCHEMY_ID);

// 构建钱包有两种方法
// 1. 直接通过 provider 和 私钥 构建
const wallet = new ethers.Wallet(ETH_PRIVATE_KEY, provider);

// 2. 先通过 私钥 构建钱包，然后连接 provider
// wallet = new ethers.Wallet(ETH_PRIVATE_KEY);
// walletSigner = wallet.connect(provider);

const main = async () => {
    try {
        // 获取钱包地址
        let address = await wallet.getAddress();
        let address2 = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';
        console.log('address: ' + address);
        // 获取当前网络最新的区块号
        let blockNumber = await provider.getBlockNumber();
        console.log('blockNumber: ' + blockNumber);

        // 获取余额，参数为地址，返回值是 bignumber 格式，单位为 wei
        let balance = await provider.getBalance(address);
        console.log(`balance: ${balance} wei`);

        // 将 wei 格式转化为 ether 格式，bignumber 和 toString 格式都可以作为参数
        let balance_in_ether = ethers.utils.formatEther(balance);
        console.log(`balance: ${balance_in_ether} ether`);

        // 将 ether 转换为 wei 格式，返回值为 bignumber 格式
        // 返回值为 bignumber 格式的数据，如果要在控制台打印，需要使用 toString() 进行转换
        let result = ethers.utils.parseEther('1.0');

        // 获取 gas price，返回值为 bignumber 格式
        // 返回值为 bignumber 格式的数据，如果要在控制台打印，需要使用 toString() 进行转换
        let gasPrice = await provider.getGasPrice();
        console.log(`gasPrice: ${gasPrice.toString()}`);

        // 获取内存 storage slot
        // 第一个参数是合约地址，第二个参数是插槽位置
        // 插槽位置可以使用十进制或者十六进制，十六进制需要加引号
        // await provider.getStorageAt('0x...', 3);
        // await provider.getStorageAt('0x...', '0x121');

        // 获取地址的 nonce
        let nonce = await provider.getTransactionCount(address);
        console.log(`nonce: ${nonce}`);

        console.log('-------------------tx: send ether-----------------------------');
        // 发送链上原生货币（例如 ETH，BNB）
        // eth 转账
        // TransactionResponse
        // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse
        const tx = await wallet.sendTransaction({
            to: address2,
            value: ethers.utils.parseEther('0.1'), // ether 转为 wei
        });
        // 打印交易信息
        console.log(`tx: ${JSON.stringify(tx)}`);

        // 等待交易上链
        console.log('--------------------tx receipt: send ether----------------------------');
        // TransactionReceipt
        // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
        // 等待几个确认
        const receipt = await tx.wait(1);
        console.log(`receqipt: ${JSON.stringify(receipt)}`);

        console.log('--------------------erc20----------------------------');
        // 合约交互 - erc20
        // SimpleToken.sol
        const bytecode = contractFile.evm.bytecode.object;
        const abi = contractFile.abi;

        // 部署合约
        const deployContractIns = new ethers.ContractFactory(abi, bytecode, wallet);

        // 2 位小数总数是 10 * 10 * 10000 = 1000,000，注意test case 里面的数量
        // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
        const deployedContract = await deployContractIns.deploy('StamHe', 'STAM', 2, 10000, {
            // gasLimit: 8000000,
            // nonce: 1,
            gasPrice: 8000000,
        });
        // deploy 以后合约还没有被链上区块确认，也就是还没有部署成功.
        // 需要使用 deployed() 等待链上区块确认
        // 通过 deployedContract.deployTransaction 可以得到发送的交易数据详情.

        // Wait until the transaction is mined (i.e. contract is deployed)
        //  - returns the receipt(TransactionReceipt)   // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
        //  - throws on failure (the reciept is on the error)
        // const txReceipt = await deployedContract.deployTransaction.wait(1);    // 可以指定等待几个区块确认
        // 或者
        // https://docs.ethers.io/v5/api/contract/contract/
        const contractObj = await deployedContract.deployed();

        console.log(`Contract deployed at address: ${deployedContract.address}`);

        // Create Contract Instance
        // Call Transaction Interface Of Contract
        const transactionContract = new ethers.Contract(deployedContract.address, abi, wallet);

        const balanceVal0 = await transactionContract.balanceOf(address);
        console.log(`balance of ${address} is : ${balanceVal0}`);

        const targetAddr = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';
        console.log(`Transfer 10000 to address: ${targetAddr}`);

        // Call Contract
        // erc20 - https://docs.ethers.io/v5/api/contract/example/
        // TransactionResponse
        // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse
        const transferReceipt = await transactionContract.transfer(targetAddr, 10000);
        await transferReceipt.wait(1); // 等待几个区块确认，默认 1 个
        console.log(`Tx successful with hash: ${transferReceipt.hash}`);

        // Call Read Interface Of Contract
        const providerContract = new ethers.Contract(deployedContract.address, abi, provider);
        // BigNumber
        // https://docs.ethers.io/v5/api/utils/bignumber/
        const balanceVal = await providerContract.balanceOf(targetAddr);
        console.log(`balance of ${targetAddr} is : ${balanceVal}`);

        const balanceVal2 = await transactionContract.balanceOf(address);
        console.log(`balance of ${address} is : ${balanceVal2}`);

        // events
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

        console.log('-----------------------call contract-------------------------');
        // 先部署 MyTest 合约
        const MyTestBytecode = contractMyTest.evm.bytecode.object;
        const MyTestABI = contractMyTest.abi;

        // 部署合约
        const deployContractInsMyTest = new ethers.ContractFactory(
            MyTestABI,
            MyTestBytecode,
            wallet
        );

        // 2 位小数总数是 10 * 10 * 10000 = 1000,000，注意test case 里面的数量
        // const deployedContract = await deployContractInsMyTest.deploy('StamHe', 'STAM', 2, 10000, {
        // MyTest 构造函数没有参数，所以不用传参
        const deployedContractMyTest = await deployContractInsMyTest.deploy({
            // gasLimit: 8000000,
            gasPrice: 8000000,
        });
        await deployedContract.deployed();
        const MyTestAddress = deployedContractMyTest.address;

        console.log(`Contract deployed at address: ${deployedContractMyTest.address}`);

        // 可以直接通过 函数签名 构建 abi
        // 需要用到哪个函数就写哪个，不需要写出全部的函数签名
        const MyTestABI_MY = [
            'function getCount() public view returns (uint256)',
            'function addCount(uint256 step) public',
        ];

        // 通过 地址，abi，provider 构建合约对象
        const MyTestContractObj = new ethers.Contract(MyTestAddress, MyTestABI_MY, provider);
        // 调用合约只读方法;
        // 读取 getCount() 的值，返回的是 BigNumber
        const s1 = await MyTestContractObj.getCount();
        console.log(
            '1. getCount():',
            s1,
            `Dec: ${s1.toNumber()}, Hex: ${s1.toHexString()}, String: ${s1.toString()}, js BigInt:${s1.toBigInt()}`
        );
        // 调用合约的写方法
        // 合约连接钱包对象
        const MyTestContractWithWalletObj = MyTestContractObj.connect(wallet);

        await MyTestContractWithWalletObj.addCount(1);

        const s2 = await MyTestContractObj.getCount();
        console.log(
            '2. getCount():',
            s2,
            `Dec: ${s2.toNumber()}, Hex: ${s2.toHexString()}, String: ${s2.toString()}, js BigInt:${s2.toBigInt()}`
        );

        console.log('-----------------------sign-------------------------');
        // 签名 utf-8
        const msgRaw = 'hello world, 中国~';
        const signature = await wallet.signMessage(msgRaw);
        console.log(`1. signedMessage: ${signature}`);

        // 验证签名
        const sig1 = ethers.utils.splitSignature(signature);
        const res1 = ethers.utils.verifyMessage(msgRaw, signature);
        console.log(`1 expect addr: 0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D, res addr: ${res1}`);

        // 更常见的 case 是签名 hash，长度为 32 字节
        // 注意签名十六进制时，必须要将其转换为数组格式
        // This string is 66 characters long
        // msgRaw2 = '0x4c8f18581c0167eb90a761b4a304e009b924f03b619a0c0e8ea3adfce20aee64';
        msgRaw2 = 'hello world, 中国~';
        const msgHash = ethers.utils.id(msgRaw2);
        // This array representation is 32 bytes long
        msgBytes = ethers.utils.arrayify(msgHash);
        // To sign a hash, you most often want to sign the bytes
        const signature2 = await wallet.signMessage(msgBytes);
        console.log(`2. signedMessage: ${signature2}`);
        const res2 = ethers.utils.verifyMessage(msgBytes, signature2);
        console.log(`2 expect addr: 0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D, res addr: ${res2}`);
    } catch (err) {
        console.log(`error: ${err}`);
    }
};

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
