# EVM - 内存布局
## solidity 基于 0.8.0 以上，solc 使用最新的 0.8.17
### 0 文档说明
```
Solidity EVM 内存布局
https://mirror.xyz/xyyme.eth/5eu3_7f7275rqY-fNMUP5BKS8izV9Tshmv8Z5H9bsec


使用单元测试
npx hardhat test



await provider.getStorageAt(s1Addr, 0);
第一个参数是部署的合约地址
第二个参数是插槽的位置，这里注意，如果是十进制，就直接写数字. 如果是十六进制，需要加上引号，例如 '0x0'
【固定长度数据类型】
Storage004.sol 合约的 a,b,c变量分别是 string, string, mapping(uint256 => uint256) 类型的
string，bytes 这种非固定长度的类型，它们的存储规则是：
    1. 如果数据长度小于等于 31 字节， 则它存储在高位字节（左对齐），
        最低位字节存储 length * 2。即最后一个字节存储长度。
    2. 如果数据长度超出 31 字节，
        A. 主插槽存储 length * 2 + 1。即最后一个字节存储长度。
        B. 数据存储在 keccak256(abi.encode(slotNo)) 中。
        C. 如果大于 32 字节，那么剩余的长度就会继续往下一个插槽
            【即 keccak256(abi.encode(slotNo)) + 1 】延伸
    3. 对于 mapping 类型，规则是：
        所处的插槽，空置，不存储内容，
        mapping 中的数据，存储在插槽 keccak256(key, slotNo) 中，也就是：
            keccak256(abi.encode(key, slotNo))
    4. 数组类型，它所满足的规则是：
        所处的插槽，存储数组的长度。随着数据变化而变化更新。
        数组内存储的元素，存储在以 keccak256(abi.encode(slotNo)) + arrIndex  插槽开始的位置
    5. 组合类型，例如 mapping(uint256 => uint256[])，那么就按照组合的规则，从外到里进行计算即可


```

### 1. 安装启动 ganache

```


npm install -g ganache-cli ganache

ganache --wallet.accounts 0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad,100000000000000000000 0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a,100000000000000000000 0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0,100000000000000000000 0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572,100000000000000000000  --server.ws true  --database.dbPath /data/tmp/ganache --wallet.accountKeysPath /data/tmp/ganache-privatekey.json  --wallet.defaultBalance 1000 --wallet.passphrase ""  --chain.chainId 30303 --server.host 127.0.0.1  --server.port 8545

ganache-cli --account 0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad,100000000000000000000 0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a,100000000000000000000 0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0,100000000000000000000 0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572,100000000000000000000  --db /data/tmp/ganache --account_keys_path /data/tmp/ganache-privatekey.json --chainId 30303


eth addr(和下面的私钥顺序对应)
0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D
0xE3205B97510cF1052DCe5b476f409731bbe3921E
0x7a125DC6dA2E5909Aa64965Bc4113386560AbBC9
0xA1c3e8cC2faCda678C861101bE1232c87625392f

eth private_key - 只是测试网络随机生成，测试数据用，没有实际意义.
0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad
0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a
0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0
0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572

```

### 2. hardhat 工程初始化

```
mkdir test
cd test
npm init --yes
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Create a JavaScript project


https://hardhat.org/hardhat-network/docs/overview
启动 fork 的节点(hardhat.config.js 配置好以后)
npx hardhat node
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<key>



编写代码
vim xxx.sol
vim xxx.js

```

### 3. 编译&测试&部署 合约

```

配置 eth 私钥
export ETH_PRIVATE_KEY=0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad

# truffle 使用的 HDWalletProvider 接收的私钥要去除私钥前面的 0x 前缀
export ETH_PRIVATE_KEY_RAW="77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad"



npx hardhat compile --force
npx hardhat test --network myself
npx hardhat run scripts/deploy.js --network myself

如果不指定部署网络，会默认在 hardhat 内置网络内部署 (Hardhat Network)
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network myself	// 指定网络







npx hardhat	// 查看 task 列表
npx hardhat help [task]  
npx hardhat compile // 执行 compile task
npx hardhat compile --force	// 强制重新编译
npx hardhat test	// 批量运行测试脚本
npx hardhat test test/SimpleToken.test.js	// 运行执行测试脚本


npx hardhat run scripts/deploy.js --network <network-name>  // 部署
npx hardhat run scripts/deploy.js --network myself	// 部署到指定网络

hardhat 的控制台模式，实时与链上交互。默认会启动 hardhat 内置网络
npx hardhat console
npx hardhat console --network myself


hardhat 提供了一个 console.log() 方法，可以在合约运行时打印日志，方便调试和测试。
【此方法仅在 hardhat 内置网络中运行有效】
在合约中引入 hardhat/console.sol 即可使用：
import "hardhat/console.sol";
```

