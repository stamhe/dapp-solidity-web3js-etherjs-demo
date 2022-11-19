// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

/* 
contract Memory001 {
    // 0x37
    uint256 a = 55; 
    string b = "hequan";

    constructor() {
        // 0x42
        a = 66; 
        b = "stamhe";
    }

    function test() public returns (uint256) {
        // 0x4d
        uint8 z = 77; 
        // 0x58
        a = 88; 
        b = "hestamhe";
        return a;
    }
} */

contract Memory001 {
    // 0x37
    uint256 a = 55;

    constructor() {
        // 0x42
        a = 66;
    }

    function test() public returns (uint256) {
        // 0x4d
        uint8 z = 77;
        // 0x58
        a = 88;
        return a;
    }
}
