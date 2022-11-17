// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Storage003 {
    uint8 public a;
    uint256 public b;
    uint8 public c;

    function foo() public {
        a = 1;
        b = 2;
        c = 123;
    }

    function bar()
        public
        view
        returns (
            uint8 _a,
            uint256 _b,
            uint8 _c
        )
    {
        _a = a;
        _b = b;
        _c = c;
    }
}
