const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const hre = require('hardhat');

describe('Demo', function () {
    async function s1LoadFixture() {
        const provider = hre.ethers.provider;

        const proxyAddress = '0xc8565B75737D0CbAE53BA0dcbCa28bD24CEe39dd';
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const s1Artifact = await hre.artifacts.readArtifact('Demo');
        // console.log(s1Artifact);

        const s1ContractObj = new hre.ethers.Contract(proxyAddress, s1Artifact.abi, provider);

        const s1Addr = s1ContractObj.address;
        console.log(`contract at ${s1Addr}`);

        const s1ContractWithSignerObj = s1ContractObj.connect(owner);

        return { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr };
    }

    describe('increaseA', function () {
        it('increaseA-Impl', async function () {
            // const { s1ContractObj, s1ContractWithSignerObj, provider, owner, s1Addr } = await loadFixture(s1LoadFixture);

            const provider = hre.ethers.provider;

            const proxyAddress = '0x89C64ccfc6Ca41cB7adb3DFCb6232D96405cf718';
            const [owner, otherAccount] = await hre.ethers.getSigners();
            const s1Artifact = await hre.artifacts.readArtifact('Demo');
            // console.log(s1Artifact);

            const s1ContractObj = new hre.ethers.Contract(proxyAddress, s1Artifact.abi, provider);

            const s1Addr = s1ContractObj.address;
            console.log(`contract at ${s1Addr}`);

            const s1ContractWithSignerObj = s1ContractObj.connect(owner);

            const res0 = await s1ContractWithSignerObj.a();
            console.log(
                'before: ',
                JSON.stringify(res0),
                `Dec: ${res0.toNumber()}, Hex: ${res0.toHexString()}, String: ${res0.toString()}, js BigInt:${res0.toBigInt()}`
            );

            await s1ContractWithSignerObj.increaseA();

            const res1 = await s1ContractWithSignerObj.a();
            console.log(
                'after: ',
                JSON.stringify(res1),
                `Dec: ${res1.toNumber()}, Hex: ${res1.toHexString()}, String: ${res1.toString()}, js BigInt:${res1.toBigInt()}`
            );
        });
    });
});
