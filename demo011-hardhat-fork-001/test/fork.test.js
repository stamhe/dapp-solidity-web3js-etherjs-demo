const { ethers } = require('hardhat');

describe('Testing fork data', function () {
    it('Latest Block Number', async function () {
        console.log((await ethers.provider.getBlockNumber()).toString());
    });
});
