# 多签钱包合约 - 基于 eth 链
### 基于多签合约管理 token 和 ether 资产

```
多签合约教程
https://github.com/AmazingAng/WTF-Solidity/blob/main/50_MultisigWallet/readme.md


mkdir test
cd test
npm init --yes
npm install ethers fs solc@0.8.17 dotenv @openzeppelin/contracts hardhat @nomicfoundation/hardhat-toolbox

npx hardhat  # Create a JavaScript project

测试(注意 ganache 里面要添加上 --miner.blockTime 参数，否则区块时间不能递增)
npx hardhat run scripts/000-deploy-erc20-multisig-token.js
npx hardhat run scripts/001-deploy-erc20-multisig-ether.js




ganache --wallet.accounts 0x77732d9f821695f3d4644e4b5f9d2528bf2a93c9a5b8733a6cdbb2c56f18c6ad,100000000000000000000 0x2d7ebdb29614e40846274bcb7f3a591a53472d2107c2586886e1a7f72c38235a,100000000000000000000 0x532f5aad84ac90976760037798e1469df169e856e49c6b12893008d997bc2ea0,100000000000000000000 0xbb9c5f23fd14febf9a98fd00ccf6cc18ad93b0edc439e6ab5d3184ab5bcb3572,100000000000000000000  --miner.coinbase 0xa2bb801AD4424f54CC9962053cfD9e58E8f5Fb2D  --server.ws true  --database.dbPath /data/tmp/ganache --wallet.accountKeysPath /data/tmp/ganache-privatekey.json  --wallet.defaultBalance 1000 --wallet.passphrase ""  --chain.chainId 30303 --server.host 127.0.0.1  --server.port 8545 --miner.blockTime 5
```