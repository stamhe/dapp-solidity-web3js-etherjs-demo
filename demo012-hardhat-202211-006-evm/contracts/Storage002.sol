// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Storage002 {
    uint8 public a;
    uint8 public b;
    uint256 public c;

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
            uint8 _b,
            uint256 _c
        )
    {
        _a = a;
        _b = b;
        _c = c;
    }
}
