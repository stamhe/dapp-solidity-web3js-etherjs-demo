// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// UUPS 需要继承 UUPSUpgradeable 合约
contract Demo is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public a;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // 初始化函数，后面的修饰符 initializer 来自 Initializable.sol
    // 用于限制该函数只能调用一次
    function initialize(uint256 _a) public initializer {
        a = _a;

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function increaseA() external {
        ++a;
    }

    /*
    覆写 _authorizeUpgrade 函数
    由于 TransparentProxy 模式是由 ProxyAdmin 进行管理，也就是说只有 ProxyAdmin 有权限进行升级，
    那么我们只要保证 ProxyAdmin 合约的管理员权限安全即可保证整个可升级架构安全。
    而对于 UUPS 模式来说，升级合约的逻辑是需要调用代理合约的，这时的权限管理就需要开发者手动处理。
    具体来说，就是对于我们覆写的 _authorizeUpgrade 函数，需要加上权限管理：
        function _authorizeUpgrade(address) internal override onlyOwner {}
    这里加上了 onlyOwner 用于限制升级权限，否则任何人都可调用代理合约的 upgradeTo 进行升级。
    但要注意的是，我们这里只是简单加上了 onlyOwner 做为示例的权限管理，
    在实际开发中，由于升级的逻辑和业务逻辑都在逻辑合约中，
    因此需要区分业务场景的 owner 和合约升级架构的 owner。这里可能会对开发者带来困扰，因此需要多加注意。
*/
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
