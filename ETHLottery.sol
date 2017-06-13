pragma solidity ^0.4.11;

contract ETHLottery {
    address public owner;
    bool public open;
    uint256 public jackpot;
    uint256 public total;
    uint256 public fee;
    uint256 public owner_fee;
    bytes1 public result;

    mapping (bytes1 => address[]) bettings;
    mapping (address => uint256) winners;

    function ETHLottery(uint256 _fee, uint256 _jackpot, uint256 _owner_fee) {
        owner = msg.sender;
        open = true;
        fee = _fee * 1000000000000000000;
        jackpot = _jackpot * 1000000000000000000;
        owner_fee = _owner_fee;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isOpen() {
        require(open);
        _;
    }

    modifier isClosed() {
        require(!open);
        _;
    }

    modifier isPaid() {
        require(msg.value >= fee);
        _;
    }

    modifier hasPrize() {
        require(winners[msg.sender] > 0);
        _;
    }
    
    function getValue () public payable returns (uint256) {
        return msg.value;
    }

    function play(bytes1 _char) public payable isOpen isPaid {
        bettings[_char].push(msg.sender);
        total += msg.value;
        if (total >= jackpot) {
            open = false;
            uint256 owner_fee_amount = (total * owner_fee) / 100;
            total -= owner_fee_amount;
            // this is the transaction which
            // will generate the txHash used
            // for the lottery result.
            if (!owner.send(owner_fee_amount)) {
                total += owner_fee_amount;
                open = true;
            }
        }
    }

    // txHash last char is passed to lottery
    function lottery(bytes1 _char) public isClosed isOwner {
        result = _char;
        address[] players = bettings[result];
        uint256 prize = total / players.length;
        for (uint256 i = 0; i < players.length; i++) {
            winners[players[i]] = prize;
        }
    }

    function withdraw() public isClosed hasPrize {
        uint256 prize = winners[msg.sender];
        // zero winner prize before send
        // preventing re-entrancy
        winners[msg.sender] = 0;
        if (!msg.sender.send(prize)) {
            // when transfer fails
            // prize still available for withdraw
            winners[msg.sender] = prize;
        }
    }

    function destruct() public isClosed isOwner {
        selfdestruct(owner);
    }
}
