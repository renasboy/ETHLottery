pragma solidity ^0.4.11;

contract ETHLotteryManagerInterface {
    function register();
}

contract ETHLottery {
    bytes32 public name = 'ETHLottery - Last 1 Byte Lottery';
    address public manager_address;
    address public owner;
    bool public open;
    uint256 public jackpot;
    uint256 public fee;
    uint256 public owner_fee;
    uint256 public create_block;
    uint256 public result_block;
    uint256 public winners_count;
    bytes32 public result_hash;
    bytes1 public result;

    mapping (bytes1 => address[]) bettings;
    mapping (address => uint256) credits;

    event Balance(uint256 _balance);
    event Result(bytes1 _result);
    event Open(bool _open);
    event Play(address indexed _sender, bytes1 _byte, uint256 _time);
    event Withdraw(address indexed _sender, uint256 _amount, uint256 _time);
    event Destroy();
    event Accumulate(uint256 _amount);

    function ETHLottery(address _manager, uint256 _fee, uint256 _jackpot, uint256 _owner_fee) {
        owner = msg.sender;
        open = true;
        create_block = block.number; 
        manager_address = _manager;
        fee = _fee;
        jackpot = _jackpot;
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

    modifier hasResultHash() {
        require(
            block.number >= result_block &&
            block.number <= result_block + 256 &&
            block.blockhash(result_block) != result_hash
            );
        _;
    }
    
    function play(bytes1 _byte) payable isOpen isPaid {
        bettings[_byte].push(msg.sender);
        if (this.balance >= jackpot) {
            open = false;
            // block offset hardcoded to 10
            result_block = block.number + 10;
            uint256 owner_fee_amount = (this.balance * owner_fee) / 100;
            // this is the transaction which
            // will generate the block used
            // to count until the 10th in order
            // to get the lottery result.
            if (!owner.send(owner_fee_amount)) {
                open = true;
                result_block = 0;
            }
            Open(open);
        }
        Balance(this.balance);
        Play(msg.sender, _byte, now);
    }

    // This method is only used for testing purposes
    // When on production network, the lottery() method
    // will be used instead and this one removed.
    function manual_lottery(bytes32 _result_hash) isClosed isOwner {
        result_hash = _result_hash;
        result = result_hash[31];
        address[] storage winners = bettings[result];
        winners_count = winners.length;
        if (winners_count > 0) {
            uint256 credit = this.balance / winners_count;
            for (uint256 i = 0; i < winners_count; i++) {
                credits[winners[i]] = credit;
            }
        }
        Result(result);
    }

    function lottery() isClosed hasResultHash isOwner {
        result_hash = block.blockhash(result_block);
        // get last byte (31st) from block hash as result
        result = result_hash[31];
        address[] storage winners = bettings[result];
        winners_count = winners.length;
        if (winners_count > 0) {
            uint256 credit = this.balance / winners_count;
            for (uint256 i = 0; i < winners_count; i++) {
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
        Withdraw(msg.sender, credit, now);
    }

    function register() isOwner {
        ETHLotteryManagerInterface manager = ETHLotteryManagerInterface(manager_address);
        manager.register();
    }

    function accumulate(address _lottery) isClosed isOwner {
        Accumulate(this.balance);
        selfdestruct(_lottery);
    }

    function destruct() isClosed isOwner {
        Destroy();
        selfdestruct(owner);
    }
}
