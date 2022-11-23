const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const hre = require('hardhat');

describe('Demo', function () {
    async function s1LoadFixture() {
        const provider = hre.ethers.provider;

        const proxyAddress = '0xAC961Fd25A70B1974C8232C8667FCa83DD32A82D';
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

            const proxyAddress = '0xAC961Fd25A70B1974C8232C8667FCa83DD32A82D';
            const [owner, otherAccount] = await hre.ethers.getSigners();
            const s1Artifact = await hre.artifacts.readArtifact('Demo');
            // console.log(s1Artifact);

            const s1ContractObj = new hre.ethers.Contract(proxyAddress, s1Artifact.abi, provider);

            const s1Addr = s1ContractObj.address;
            console.log(`contract at ${s1Addr}`);

            const s1ContractWithSignerObj = s1ContractObj.connect(owner);

            await s1ContractWithSignerObj.increaseA();

            const res1 = await s1ContractWithSignerObj.a();
            console.log(
                'res: ',
                JSON.stringify(res1),
                `Dec: ${res1.toNumber()}, Hex: ${res1.toHexString()}, String: ${res1.toString()}, js BigInt:${res1.toBigInt()}`
            );
        });
    });
});
