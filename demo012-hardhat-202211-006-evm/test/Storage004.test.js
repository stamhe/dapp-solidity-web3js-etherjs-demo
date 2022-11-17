const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
// const { ethers } = require('hardhat');

describe('Storage004', function () {
    async function s1LoadFixture() {
        const provider = ethers.provider;

        const [owner, otherAccount] = await ethers.getSigners();
        const s1ContractFactory = await ethers.getContractFactory('Storage004');
        const s1ContractObj = await s1ContractFactory.deploy();

        await s1ContractObj.deployed();
        console.log(`contract deployed to ${s1ContractObj.address}`);
        const s1Addr = s1ContractObj.address;

        const s1ContractWithSignerObj = s1ContractObj.connect(owner);

        // 初始化值
        await s1ContractWithSignerObj.foo();

        const res = await s1ContractWithSignerObj.bar();
        console.log('res: ', JSON.stringify(res));
        const res0 = res[0];
        console.log(
            '0. bar():',
            res0
            // `Dec: ${res0.toNumber()}, Hex: ${res0.toHexString()}, String: ${res0.toString()}, js BigInt:${res0.toBigInt()}`
        );

        const res1 = res[1];
        console.log(
            '1. bar():',
            res1
            // `Dec: ${res1.toNumber()}, Hex: ${res1.toHexString()}, String: ${res1.toString()}, js BigInt:${res1.toBigInt()}`
        );

        return { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr };
    }

    describe('getSlotInfo', function () {
        it('get slot', async function () {
            const { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr } =
                await loadFixture(s1LoadFixture);

            /* 
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
             */
            // ***** 字符串内存布局 *****
            console.log('********** 字符串内存布局 **********');
            let s0 = await provider.getStorageAt(s1Addr, 0);
            let s1Length = await provider.getStorageAt(s1Addr, 1);
            console.log(`s0 = ${s0}`);
            console.log(`s1Length = ${s1Length}`);

            // 计算出数据插槽的位置 keccak256(abi.encode(slotNo))，这也就是数据插槽的位置
            const abiCoder = ethers.utils.defaultAbiCoder;
            const keccak256 = ethers.utils.keccak256;
            const s1DataSlotNo = keccak256(abiCoder.encode(['uint256'], [1]));
            console.log(`s1DataSlotNo = ${s1DataSlotNo}`);

            // 第二个参数为插槽的位置，使用 ethersjs 库需要加引号，否则报错
            let s1Data = await provider.getStorageAt(s1Addr, s1DataSlotNo);
            console.log(`s1Data = ${s1Data}`);

            // ***** mapping 内存布局 *****
            console.log('********** mapping 内存布局 **********');
            const mappingSlotNo = 2;
            const mappingKey1 = 1;
            const mappingKey2 = 2;
            const mappingKey1DataSlot = keccak256(
                abiCoder.encode(['uint256', 'uint256'], [mappingKey1, mappingSlotNo])
            );
            const mappingKey2DataSlot = keccak256(
                abiCoder.encode(['uint256', 'uint256'], [mappingKey2, mappingSlotNo])
            );

            const mappingKey1Data = await provider.getStorageAt(s1Addr, mappingKey1DataSlot);
            const mappingKey2Data = await provider.getStorageAt(s1Addr, mappingKey2DataSlot);

            const mappingKey1DataRaw = ethers.BigNumber.from(mappingKey1Data).toString();
            const mappingKey2DataRaw = ethers.BigNumber.from(mappingKey2Data).toString();
            console.log(
                `mappingKey1Data = ${mappingKey1Data}, mappingKey1DataRaw = ${mappingKey1DataRaw}`
            );
            console.log(
                `mappingKey2Data = ${mappingKey2Data}, mappingKey2DataRaw = ${mappingKey2DataRaw}`
            );

            // ***** 数组内存布局 *****
            console.log('********** 数组内存布局 **********');
            const arrSlotNo = 3;
            const arrIndex0 = 0;
            const arrIndex1 = 1;
            const arrIndex0DataSlotRoot = keccak256(abiCoder.encode(['uint256'], [arrSlotNo]));
            const arrIndex0DataSlotRootBigNumber = ethers.BigNumber.from(arrIndex0DataSlotRoot);

            const arrIndex0DataSlot = arrIndex0DataSlotRootBigNumber.add(arrIndex0).toHexString();
            const arrIndex1DataSlot = arrIndex0DataSlotRootBigNumber.add(arrIndex1).toHexString();

            const arrIndex0Data = await provider.getStorageAt(s1Addr, arrIndex0DataSlot);
            const arrIndex1Data = await provider.getStorageAt(s1Addr, arrIndex1DataSlot);

            const arrIndex0DataRaw = ethers.BigNumber.from(arrIndex0Data).toString();
            const arrIndex1DataRaw = ethers.BigNumber.from(arrIndex1Data).toString();
            console.log(`arrIndex0Data = ${arrIndex0Data}, arrIndex0DataRaw = ${arrIndex0DataRaw}`);
            console.log(`arrIndex1Data = ${arrIndex1Data}, arrIndex1DataRaw = ${arrIndex1DataRaw}`);
        });
    });
});
