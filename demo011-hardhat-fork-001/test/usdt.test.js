// 需要将 usdt 的 abi 保存在本地
const USDT_ABI = require('../usdt_abi.json');
// usdt 合约的主网地址
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const { ethers } = require('hardhat');

// https://hardhat.org/hardhat-network/docs/overview
describe('Fork', function () {
    it('Testing fork data', async function () {
        const provider = ethers.provider;
        // 构造 usdt 合约对象
        const USDT = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
        // 调用 usdt 的 totalSupply
        // https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7
        let totalSupply = await USDT.totalSupply();
        console.log(totalSupply.toString());
    });

    it('Impersonating accounts', async function () {
        const provider = ethers.provider;
        // 构造 usdt 合约对象
        const USDT = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
        // 调用 usdt 的 totalSupply
        // https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7
        let totalSupply = await USDT.totalSupply();
        const mockAddress = '0x49e274450bed00aeec426b59dff1295cae7cc620';

        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [mockAddress],
        });

        const signer = await ethers.provider.getSigner(mockAddress);

        let ETHBalance = await signer.getBalance();
        console.log(`ETH balance is ${ETHBalance.toString() / 1e18} ether`);

        let USDTBalance = (await USDT.balanceOf(signer.getAddress())) / 1e6;
        console.log(`USDT balance is ${USDTBalance.toString()}`);

        // 模拟该账户发送交易，假设需要向其他地址发送 100 USDT
        // 打印转账前的账户余额
        const targetAddr = '0x652361ED2a8FB7E9b15Fe073AAb9fE2cFacb0B52';
        let USDTBalanceA = (await USDT.balanceOf(signer.getAddress())) / 1e6;
        console.log(`USDT balance before transfer is ${USDTBalanceA.toString()}`);

        let USDTBalanceB = (await USDT.balanceOf(targetAddr)) / 1e6;
        console.log(`USDT balance of targetAddr before transfer is ${USDTBalanceB.toString()}`);

        console.log('========Transfering========');

        // 转账操作，假设需要向其他地址发送 100 USDT
        await USDT.connect(signer).transfer(targetAddr, ethers.utils.parseUnits('100', 6));

        // 打印转账后的账户余额
        USDTBalanceA = (await USDT.balanceOf(signer.getAddress())) / 1e6;
        console.log(`USDT balance after transfer is ${USDTBalanceA.toString()}`);

        USDTBalanceB = (await USDT.balanceOf(targetAddr)) / 1e6;
        console.log(`USDT balance of targetAddr after transfer is ${USDTBalanceB.toString()}`);

        // 设置账户 ether 余额
        await network.provider.send('hardhat_setBalance', [
            await signer.getAddress(),
            `${ethers.utils.parseUnits('101010', 18).toHexString()}`,
            // '0x1010101010101010101010',
        ]);
        let ETHBalance2 = await signer.getBalance();
        console.log(`ETH balance after setBalance is ${ETHBalance2.toString() / 1e18} ether`);
        // 设置账户 nonce
        await network.provider.send('hardhat_setNonce', [targetAddr, '0x21']);
    });
});
