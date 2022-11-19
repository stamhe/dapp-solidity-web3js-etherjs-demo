// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/*
【固定长度数据类型】合并使用插槽如何读取他们的偏移量？
1. 使用 内联汇编
2. 使用 变量被内置的 .slot 和 .offset 分别得到槽号和偏移量.
*/
contract Storage005 {
    uint64 a = 1;
    uint64 b = 2;
    uint128 c = 3;
    uint256 d = 100;

    function getSlotNumbers()
        public
        pure
        returns (
            uint256 slotA,
            uint256 slotB,
            uint256 slotC,
            uint256 slotD
        )
    {
        assembly {
            slotA := a.slot
            slotB := b.slot
            slotC := c.slot
            slotD := d.slot
        }
    }

    function getVariableOffsets()
        public
        pure
        returns (
            uint256 offsetA,
            uint256 offsetB,
            uint256 offsetC,
            uint256 offsetD
        )
    {
        assembly {
            offsetA := a.offset
            offsetB := b.offset
            offsetC := c.offset
            offsetD := d.offset
        }
    }
}
