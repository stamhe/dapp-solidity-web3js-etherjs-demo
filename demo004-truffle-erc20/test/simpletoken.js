const SimpleToken = artifacts.require('SimpleToken');

contract('SimpleToken', accounts => {
    it(`Should put 1000000 to the ${accounts[0]}`, async () => {
        const simpleTokenIns = await SimpleToken.deployed();
        const balance = (await simpleTokenIns.balanceOf.call(accounts[0])).toNumber();
        // 这里的 1000000 要和 migration 里面部署脚本的总数对应上
        assert.equal(balance, 1000000, `the balance of ${accounts[0]} wasn not 1000000`);
    });

    // change the account
    it('Transfer 1000 to other account', async () => {
        const simpleTokenIns = await SimpleToken.deployed();
        // 接收 erc20-token 的地址
        const target = '0xE3205B97510cF1052DCe5b476f409731bbe3921E';
        // transfer 1000 to other account
        await simpleTokenIns.transfer(target, 1000);

        // check the balance of target
        const balance = (await simpleTokenIns.balanceOf.call(target)).toNumber();
        assert.equal(balance, 1000, `the balance of ${target} wasn't 1000`);
    });
});
