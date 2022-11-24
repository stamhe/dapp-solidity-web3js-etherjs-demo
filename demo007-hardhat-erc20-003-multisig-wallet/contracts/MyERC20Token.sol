// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC20Token is ERC20, Ownable {
    // Price of one MyERC20Token token
    uint256 public constant tokenPrice = 0.01 ether;
    uint256 public immutable maxTotalSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) payable ERC20(name_, symbol_) {
        maxTotalSupply = totalSupply_ * 10**18;
    }

    // 管理员分配
    function adminMint(address _addr, uint256 amount) public onlyOwner {
        uint256 amountWithDecimals = amount * 10**18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(_addr, amountWithDecimals);
    }

    /**
     * @dev Mints `amount` number of MyERC20Token
     * Requirements:
     * - `msg.value` should be equal or greater than the tokenPrice * amount
     */
    function mint(uint256 amount) public payable {
        // the value of ether that should be equal or greater than tokenPrice * amount;
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        // total tokens + amount <= 10000, otherwise revert the transaction
        uint256 amountWithDecimals = amount * 10**18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        // call the internal function from Openzeppelin's ERC20 contract
        _mint(msg.sender, amountWithDecimals);
    }

    /**
     * @dev withdraws all ETH and tokens sent to the contract
     * Requirements:
     * wallet connected must be owner's address
     */
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
