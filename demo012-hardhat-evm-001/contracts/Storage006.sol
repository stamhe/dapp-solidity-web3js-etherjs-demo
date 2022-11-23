// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract Storage006 {
    address public owner;
    uint public prize;

    constructor() {
        owner = msg.sender;
    }

    function test1() public view returns (address) {
        return owner;
    }

    function test2(uint p) public {
        prize += p;
    }
}
