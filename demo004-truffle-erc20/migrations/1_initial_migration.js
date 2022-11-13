const SimpleToken = artifacts.require('SimpleToken');

module.exports = function (deployer, network, accounts) {
    // 2 位小数，总数是 10 * 10 * 10000 = 1000,000
    deployer.deploy(SimpleToken, 'StamHe', 'STAM', 2, 10000, {
        gas: 3500000, // Set a maximum amount of gas and `from` address for the deployment
        from: accounts[0], // 从指定钱包的哪一个账户部署
        // overwrite: false,   // Don't deploy this contract if it has already been deployed
    });
};
