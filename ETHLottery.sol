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
    mapping (address => uint256) credits;

    event Total(uint256 total);
    event Result(bytes1 result);
    event Open(bool open);

    function ETHLottery(uint256 _fee, uint256 _jackpot, uint256 _owner_fee) {
        owner = msg.sender;
        open = true;
        fee = _fee * 1000000000000000000;
        jackpot = _jackpot * 1000000000000000000;
        owner_fee = _owner_fee;
        Open(open);
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
        require(credits[msg.sender] > 0);
        _;
    }
    
    function play(bytes1 _char) payable isOpen isPaid {
        bettings[_char].push(msg.sender);
        total += msg.value;
        if (total >= jackpot) {
            open = false;
            uint256 owner_fee_amount = (total * owner_fee) / 100;
            total -= owner_fee_amount;
            // this is the transaction which
            // will generate the block used
            // to count until the 10th in order
            // to get the lottery result.
            if (!owner.send(owner_fee_amount)) {
                total += owner_fee_amount;
                open = true;
            }
            Open(open);
        }
        Total(total);
    }

    // block hash last char is passed to lottery
    function lottery(bytes1 _char) isClosed isOwner {
        result = _char;
        address[] winners = bettings[result];
        if (winners.length > 1) {
            uint256 credit = total / winners.length;
            for (uint256 i = 0; i < winners.length; i++) {
                credits[winners[i]] = credit;
            }
        }
        Result(result);
    }

    function withdraw() isClosed hasPrize {
        uint256 credit = credits[msg.sender];
        // zero credit before send preventing re-entrancy
        credits[msg.sender] = 0;
        if (!msg.sender.send(credit)) {
            // transfer failed, return credit for withdraw
            credits[msg.sender] = credit;
        }
    }

    function destruct() isClosed isOwner {
        selfdestruct(owner);
    }
}
