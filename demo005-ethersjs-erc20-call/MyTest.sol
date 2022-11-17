// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// 0xbACceffa37F477E5d55207678BEAb91f125feB5f
contract MyTest {
    uint256 public count = 100;
    bytes32 public dataTest;
    address public addressTest;

    function getCount() public view returns (uint256) {
        return count;
    }

    function addCount(uint256 step) public {
        count += step;
    }

    function setData(bytes32 _data) public returns (bytes32) {
        dataTest = _data;
        return dataTest;
    }

    function getData() public view returns (bytes32) {
        return dataTest;
    }

    function setAddress(address _address) public returns (address) {
        addressTest = _address;
        return addressTest;
    }

    function getAddress() public view returns (address) {
        return addressTest;
    }
}
