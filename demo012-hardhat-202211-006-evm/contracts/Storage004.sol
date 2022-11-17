// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// 非固定长度类型
contract Storage004 {
    string public a; // 插槽编号 0
    string public b; // 插槽编号 1
    mapping(uint256 => uint256) public c; // 插槽编号 2
    uint256[] public d; // 插槽编号 3

    function foo() public {
        // a是31个字节，b是32个字节
        a = "abcabcabcabcabcabcabcabcabcabca";
        b = "abcabcabcabcabcabcabcabcabcabcab";
        c[1] = 123;
        c[2] = 345;

        d.push(12);
        d.push(34);
    }

    function bar() public view returns (string memory _a, string memory _b) {
        _a = a;
        _b = b;
    }
}
