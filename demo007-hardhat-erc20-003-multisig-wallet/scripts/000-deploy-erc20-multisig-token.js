// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const chainid = (await hre.ethers.provider.getNetwork()).chainId;
    const provider = hre.ethers.provider;

    // 1. 部署 erc20 token 合约
    const MyERC20TokenFactory = await hre.ethers.getContractFactory("MyERC20Token");
    let tokenName = "MyERC20Token";
    let tokenSymbol = "MTOKEN";
    let totalSupply = 10000;
    const MyERC20TokenDeploy = await MyERC20TokenFactory.deploy(
        tokenName,
        tokenSymbol,
        totalSupply,
        {
            value: 0,
        }
    );

    await MyERC20TokenDeploy.deployed();
    const MyERC20TokenAddr = MyERC20TokenDeploy.address;
    console.log(`MyERC20Token deployed to ${MyERC20TokenAddr}`);

    const MyERC20TokenArtifact = hre.artifacts.readArtifact(
        "contracts/MyERC20Token.sol:MyERC20Token"
    );
    const MyERC20TokenAbi = (await MyERC20TokenArtifact).abi;
    const MyERC20Token = new hre.ethers.Contract(MyERC20TokenAddr, MyERC20TokenAbi, owner);
    const lockAmount = 100;

    // 2. 部署 MultisigWallet 合约
    const MultisigWalletFactory = await hre.ethers.getContractFactory("MultisigWallet");
    const lockTime = 15;
    const addr0 = await hre.ethers.provider.getSigner(0).getAddress();
    const addr1 = await hre.ethers.provider.getSigner(1).getAddress();
    const MultisigWalletDeploy = await MultisigWalletFactory.deploy(
        MyERC20TokenAddr,
        [addr0, addr1],
        2,
        {
            value: ethers.utils.parseEther("1"), // 同时给多签合约转账 1 ether
        }
    );

    await MultisigWalletDeploy.deployed();
    const MultisigWalletAddr = MultisigWalletDeploy.address;
    console.log(`MultisigWallet deployed to ${MultisigWalletAddr}`);

    const MultisigWalletArtifact = hre.artifacts.readArtifact(
        "contracts/MultisigWallet.sol:MultisigWallet"
    );
    const MultisigWalletAbi = (await MultisigWalletArtifact).abi;
    const MultisigWallet = new hre.ethers.Contract(MultisigWalletAddr, MultisigWalletAbi, owner);

    // 3. 给 多签合约 一定的 token
    await MyERC20Token.adminMint(MultisigWalletAddr, lockAmount);

    // 转账以后，等一个区块时间再执行后面的逻辑
    await new Promise(r => setTimeout(r, 5 * 1000));
    let balance0Tmp = await MyERC20Token.balanceOf(MultisigWalletAddr);
    let balance0 = ethers.utils.formatEther(balance0Tmp);

    const etherBalance0Tmp = await provider.getBalance(MultisigWalletAddr);
    const etherBalance0 = ethers.utils.formatEther(etherBalance0Tmp);

    console.log(
        `MultisigWallet addr = ${MyERC20TokenAddr}, lockAmount = ${balance0} ${tokenSymbol}, ${etherBalance0} ether`
    );

    // 4. 构造交易数据
    const _to = "0xA1c3e8cC2faCda678C861101bE1232c87625392f";
    const _amount = ethers.utils.parseEther("1.11");
    const tx1Hash = await MultisigWallet.encodeTokenTransfer(_to, _amount, 0, chainid);
    console.log("tx1Hash: ", tx1Hash);

    // 5. 对交易数据进行多签签名
    // This array representation is 32 bytes long
    const tx1Bytes = ethers.utils.arrayify(tx1Hash);
    // To sign a hash, you most often want to sign the bytes
    // const tx1Signature = await hre.ethers.provider.getSigner(0).signMessage(tx1Bytes);
    const tx1Signature0 = await hre.ethers.provider.getSigner(0).signMessage(tx1Bytes);
    const tx1Signature1 = await hre.ethers.provider.getSigner(1).signMessage(tx1Bytes);
    console.log(`tx1-0: ${tx1Signature0}, tx1-1: ${tx1Signature1}`);
    // 组装多签签名数据
    const tx1Signature = tx1Signature0.concat(tx1Signature1.substring(2));
    console.log(`tx1Signature: ${tx1Signature}`);

    // 6. 发起交易
    const tx1Res = await MultisigWallet.execTokenTransfer(_to, _amount, tx1Signature);
    console.log(`txRes: ${tx1Res}`);

    // BigNumber
    // https://docs.ethers.io/v5/api/utils/bignumber/
    // ethers.utils.parseEther(balanceInEther), // ether 转为 wei
    // ethers.utils.formatEther(balanceInWei) wei 转为 ether

    // 转账以后，等一个区块时间再执行后面的逻辑
    await new Promise(r => setTimeout(r, 5 * 1000));
    let balance1Tmp = await MyERC20Token.balanceOf(_to);
    let balance1 = ethers.utils.formatEther(balance1Tmp);
    console.log(
        `tar addr = ${_to} balance = ${balance1}, transfer amount = ${ethers.utils.formatEther(
            _amount
        )} ${tokenSymbol}`
    );

    let balance2Tmp = await MyERC20Token.balanceOf(MultisigWalletAddr);
    let balance2 = ethers.utils.formatEther(balance2Tmp);

    const etherBalance2Tmp = await provider.getBalance(MultisigWalletAddr);
    const etherBalance2 = ethers.utils.formatEther(etherBalance2Tmp);
    console.log(
        `MultisigWallet addr = ${MyERC20TokenAddr}, lockAmount = ${balance2} ${tokenSymbol}, ${etherBalance2} ether`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
