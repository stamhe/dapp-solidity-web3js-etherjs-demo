const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
// const { ethers } = require('hardhat');

describe('Storage001', function () {
    async function s1LoadFixture() {
        const provider = ethers.provider;

        const [owner, otherAccount] = await ethers.getSigners();
        const s1ContractFactory = await ethers.getContractFactory('Storage001');
        const s1ContractObj = await s1ContractFactory.deploy();

        await s1ContractObj.deployed();
        console.log(`contract deployed to ${s1ContractObj.address}`);
        const s1Addr = s1ContractObj.address;

        const s1ContractWithSignerObj = s1ContractObj.connect(owner);

        // 初始化值
        await s1ContractWithSignerObj.foo();

        const res = await s1ContractWithSignerObj.bar();
        // console.log('res: ', res);
        const res0 = res[0];
        console.log(
            '0. bar():',
            res0,
            `Dec: ${res0.toNumber()}, Hex: ${res0.toHexString()}, String: ${res0.toString()}, js BigInt:${res0.toBigInt()}`
        );

        const res1 = res[1];
        console.log(
            '1. bar():',
            res1,
            `Dec: ${res1.toNumber()}, Hex: ${res1.toHexString()}, String: ${res1.toString()}, js BigInt:${res1.toBigInt()}`
        );
        const res2 = res[2];
        console.log(
            '2. bar():',
            res2,
            `Dec: ${res2.toNumber()}, Hex: ${res2.toHexString()}, String: ${res2.toString()}, js BigInt:${res2.toBigInt()}`
        );

        return { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr };
    }

    describe('getSlotInfo', function () {
        it('get slot', async function () {
            const { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr } =
                await loadFixture(s1LoadFixture);

            // 第一个参数是部署的合约地址
            // 第二个参数是插槽的位置，这里注意，如果是十进制，就直接写数字
            // 如果是十六进制，需要加上引号，例如 '0x0'
            // 【固定长度数据类型】
            // Storage001.sol 合约的 a,b,c 三个变量都是 uint256 类型的，
            // 恰好每个变量都占用了一个插槽，分别是插槽0，1，2
            let s0 = await provider.getStorageAt(s1Addr, 0);
            let s1 = await provider.getStorageAt(s1Addr, 1);
            let s2 = await provider.getStorageAt(s1Addr, 2);

            const s0Raw = ethers.BigNumber.from(s0).toString();
            const s1Raw = ethers.BigNumber.from(s1).toString();
            const s2Raw = ethers.BigNumber.from(s2).toString();

            console.log(`s0 = ${s0}, s0Raw = ${s0Raw}`);
            console.log(`s1 = ${s1}, s1Raw = ${s1Raw}`);
            console.log(`s2 = ${s2}, s2Raw = ${s2Raw}`);
        });
    });
});
