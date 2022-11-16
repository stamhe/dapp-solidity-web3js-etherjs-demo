# react - hardhat - ethers.js - erc20
## solidity 基于 0.8.0 以上，solc 使用最新的 0.8.17

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


npm install @nomicfoundation/hardhat-toolbox
Add the highlighted line to your hardhat.config.js so that it looks like this:

require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};



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

### 4. 初始化 react 工程
```
npm install -g create-react-app
cd test
create-react-app frontend
cd frontend

A. 将步骤 3 编译得到的 artifacts 目录的 文件同步到 frontend/src 目录下
B. 再 react 工程新建 Greeter.js 组件，引入 Greeter.sol 合约的 abi 信息
C. 编写完组件代码，启动界面

npm start
```

### 5. 感谢 Dapp-Learning 项目提供如此好的学习资料集合

[Dapp-Learning](https://github.com/Dapp-Learning-DAO/Dapp-Learning)
