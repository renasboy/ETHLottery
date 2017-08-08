pragma solidity ^0.4.11;

contract ETHLotteryInterface {
    address public owner;
}

contract ETHLotteryManager {
    address public owner;
    address[] _lotteries;

    event Register(address lottery);

    function ETHLotteryManager() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isOwnerLottery() {
        ETHLotteryInterface lottery = ETHLotteryInterface(msg.sender);
        require(lottery.owner() == owner);
        _;
    }

    function lotteries() returns (address[]) {
        return _lotteries;
    }

    function register() isOwnerLottery {
        _lotteries.push(msg.sender);
        Register(msg.sender);
    }

    function destruct() isOwner {
        selfdestruct(owner);
    }
}
