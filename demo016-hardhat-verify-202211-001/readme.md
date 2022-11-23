# hardhat etherscan contract verify and opensource demo

```
hardhat 发布合约代码到 etherscan 开源和验证
文档
https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan

mkdir test
cd test
npm init --yes
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Create a JavaScript project



修改
hardhat.config.js
etherscan: {
    apiKey: ETH_ETHERSCAN_API_KEY,
},

部署
npx hardhat run scripts/deploy.js --network goerli

部署成功，获取到输入合约地址和合约的构造参数入参
合约地址
0xA081A1Ba54d0790FfdBAeed76BB66bc6E9179cE6
Lock.sol 的部署入参
1669277998

验证合约
npx hardhat verify --network goerli 0xA081A1Ba54d0790FfdBAeed76BB66bc6E9179cE6 1669277998


https://goerli.etherscan.io/address/0xa081a1ba54d0790ffdbaeed76bb66bc6e9179ce6


```