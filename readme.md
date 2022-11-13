# Blockchain Dapp Demo

**1. Solidity**

**2. Web3.js**

**3. Ether.js**

**4. Truffle**

**5. Hardhat**
## solidity 基于 0.8.0 以上，solc 使用最新的 0.8.17

### 1. 安装启动 ganache

```
npm install -g ganache-cli

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

### 2. web3.js 与  ethers.js 裸工程初始化

```
web3.js
mkdir test
cd test
npm init -y
npm install web3 fs solc@0.8.17 dotenv @openzeppelin/contracts

编写代码
vim xxx.sol
vim xxx.js

node xxx.js



ethers.js
mkdir test
cd test
npm init -y
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts

编写代码
vim xxx.sol
vim xxx.js

node xxx.js

```

### 3. Truffle 编译&测试&部署

```

配置 eth 私钥
export ETH_PRIVATE_KEY=0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad

# truffle 使用的 HDWalletProvider 接收的私钥要去除私钥前面的 0x 前缀
export ETH_PRIVATE_KEY_RAW="77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad"


npm install -g truffle
mkdir test
cd test
npm init -y
truffle init
npm install web3 solc@0.8.17 fs dotenv @openzeppelin/contracts @truffle/hdwallet-provider

编写代码
vim xxx.sol
vim xxx.js

编译
truffle compile --all
测试
truffle test --network mynetwork
部署
truffle migrate --network mynetwork




truffle compile
truffle compile --all  // 全部重新编译
truffle migrate  // 没有指定网络，默认部署到内置的  development 网络
truffle migrate --reset
truffle migrate --network goerli
truffle migrate --network mynetwork  --reset	// 强制重新部署


运行测试用例
truffle test
truffle test --network mynetwork // 在指定网络测试

运行 Solidity 测试用例:
truffle test ./test/TestMetacoin.sol
运行 JavaScript 测试用例
truffle test ./test/metacoin.js


进入控制台
truffle console
truffle console  --network mynetwork

进入dashboard
truffle dashboard	// 默认 http://127.0.0.1:24012，默认开启了一个名字叫  dashboard 的网络，也可以在这个网络部署和运行合约.
```

### 4. Hardhat 编译&测试&部署
```
配置 eth 私钥
export ETH_PRIVATE_KEY=0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad

# truffle 使用的 HDWalletProvider 接收的私钥要去除私钥前面的 0x 前缀
export ETH_PRIVATE_KEY_RAW="77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad"


mkdir test
cd test
npm init --yes
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Create a JavaScript project

编写代码
vim xxx.sol
vim xxx.js


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

### 5. 感谢 Dapp-Learning 项目提供如此好的学习资料集合

[Dapp-Learning](https://github.com/Dapp-Learning-DAO/Dapp-Learning)
