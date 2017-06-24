# ETHLottery

The Ethereum Block Hash Lottery

ETHLottery is a 100% fair lottery based on Ethereum blockchain technology, where the result is chosen based on a certain Ethereum Block Hash created in the future, therefore impossible to guess and temper with.

ETHLottery was designed to save as much gas as possible keeping the interactions to a minimum and a tidy contract code and logic.

## How it works

Each round starts with an empty Ethereum smart contract, where participants can make bets by sending a minimal fee and trying to guess which is the exact last byte of a certain Ethereum Block Hash generated only and really *only* after the lottery is closed.

The Ethereum Block Hash used as lottery result belongs to the 10th block after the block containing the only transaction made from the ETHLottery smart contract to the lottery owner's Ethereum wallet with the payment of the owner fee, this happens only once and only when the lottery is closed.

The lottery closes after the prize reaches the jackpot.

The lottery fee, the owner fee and the jackpot are values set when the contract is created and are 100% public and immutable in the blockchain.

## How to play with geth on CLI

To send a bet, create a transaction to the contract address calling the function play() with your guess and the payment for the minimal fee.

### Preparations
```shell
// set the ETHLottery contract ABI
var abi = [{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"total","type":"uint256"}],"name":"Total","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"open","type":"bool"}],"name":"Open","type":"event"}];

// set the ETHLottery contract address
var address = "0xa55e4642e1630d6b49d6727b700dc15cac19fe72";

// set the participant / player address (to use gas and fee from)
var participant = "0xa2a069c92c8f41e8433adf1609e335af035eb17b";

// instatiate the ETHLottery contract
var ETHLottery = eth.contract(abi).at(address);
```

### Public methods (read only)

```shell
// See lottery status, open (true/false) 
ETHLottery.open()

// See total prize accumulate 
ETHLottery.total()

// See jackpot amount 
ETHLottery.jackpot()

// See betting minimum fee amount
ETHLottery.fee()

// See owner fee amount in percentage of total
ETHLottery.owner_fee()

// See lottery result, only when open=false
ETHLottery.result()
```

### Betting / Playing
```shell
// set the amount to pay the minimum fee to 1 ETH
var amount = web3.toWei(1, "ether");

// unlock the participant account / wallet
web3.personal.unlockAccount(participant, "YOUR_VERY_SECRET_PASSWORD");

// call the play function passing the guess as a single byte in hex (0x00 to 0xff)
ETHLottery.play(0x31, {from: participant, value: amount});

// make sure you lock the account again
web3.personal.lockAccount(participant);
```

### Withdraw prize
```shell
// unlock the participant account / wallet
web3.personal.unlockAccount(participant, "YOUR_VERY_SECRET_PASSWORD");

// withdraw the prize, after ETHLottery is closed, only for winners
ETHLottery.withdraw({from: participant});

// make sure you lock the account again
web3.personal.lockAccount(participant);
```

## How to play with js GUI

### Install dependency
```shell
npm install web3 bignumber
```

## How to run your own ETHLottery

### Create a new lottery
```shell
// Set betting minimum fee amount to 1 ETH
var fee = 1;

// Set jackpot amount to 10 ETH
var jackpot = 10;

// Set owner fee amount in percentage of total
var owner_fee = 2;

// Set the owner
var owner = web3.eth.accounts[0];

// Set the ABI for the current contract version
// created with: solc --abi ETHLottery.sol
var abi = [{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"total","type":"uint256"}],"name":"Total","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"open","type":"bool"}],"name":"Open","type":"event"}];

// Set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x6060604052341561000c57fe5b604051606080610d08833981016040528080519060200190919080519060200190919080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600060146101000a81548160ff021916908315150217905550670de0b6b3a76400008302600381905550670de0b6b3a76400008202600181905550806004819055507fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600060149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b5050505b610bea8061011e6000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806314ce4059146100c55780632b68b9c6146100eb5780632ddbd13a146100fd5780633ccfd60b14610123578063494d93cc14610135578063653721471461015b5780636b31ee01146101c55780638da5cb5b146101eb578063ba13a5721461023d578063be3e33d51461024f578063ca92a13614610289578063ddca3f43146102b7578063fcfff16f146102dd575bfe5b34156100cd57fe5b6100d5610307565b6040518082815260200191505060405180910390f35b34156100f357fe5b6100fb61030d565b005b341561010557fe5b61010d6103c6565b6040518082815260200191505060405180910390f35b341561012b57fe5b6101336103cc565b005b341561013d57fe5b61014561054a565b6040518082815260200191505060405180910390f35b341561016357fe5b61016b610550565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156101cd57fe5b6101d5610582565b6040518082815260200191505060405180910390f35b34156101f357fe5b6101fb610588565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561024557fe5b61024d6105ae565b005b61028760048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19169060200190919050506108df565b005b341561029157fe5b610299610b4e565b60405180826000191660001916815260200191505060405180910390f35b34156102bf57fe5b6102c7610b54565b6040518082815260200191505060405180910390f35b34156102e557fe5b6102ed610b5a565b604051808215151515815260200191505060405180910390f35b60045481565b600060149054906101000a900460ff1615151561032a5760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103875760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b60025481565b6000600060149054906101000a900460ff161515156103eb5760006000fd5b6000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561043a5760006000fd5b600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f1935050505015156105445780600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5b5b50565b60055481565b600760009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000281565b60015481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006000600060149054906101000a900460ff161515156105d15760006000fd5b60055443101580156105e95750610100600554014311155b8015610602575060065460001916600554406000191614155b151561060e5760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561066b5760006000fd5b6005544060068160001916905550600654601f60208110151561068a57fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600760006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060086000600760009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020925060008380549050111561082d57828054905060025481151561078c57fe5b049150600090505b828054905081101561082c57816009600085848154811015156107b357fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610794565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600760009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b5b505050565b6000600060149054906101000a900460ff1615156108fd5760006000fd5b600354341015151561090f5760006000fd5b60086000837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002080548060010182816109789190610b6d565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505034600260008282540192505081905550600154600254101515610b0e576000600060146101000a81548160ff021916908315150217905550600a4301600581905550606460045460025402811515610a1c57fe5b04905080600260008282540392505081905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f193505050501515610ac357806002600082825401925050819055506001600060146101000a81548160ff02191690831515021790555060006005819055505b7fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600060149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b7f52943ff53e8b9337883aec1e8f6e90805dcc4243c9cb97464c1500f1b35f07236002546040518082815260200191505060405180910390a15b5b5b5050565b60065481565b60035481565b600060149054906101000a900460ff1681565b815481835581811511610b9457818360005260206000209182019101610b939190610b99565b5b505050565b610bbb91905b80821115610bb7576000816000905550600101610b9f565b5090565b905600a165627a7a72305820adbcb77acc1f1b61130db0ce64bf8fdb57ec7819dfcaa24a5c4eaabaf0a22b2c0029";

// Unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// create contract
var contract = web3.eth.contract(abi);
var ETHLottery = contract.new(fee, jackpot, owner_fee, { from: owner, data: code, gas: 1000000 });

// Make sure you lock the owner account
web3.personal.lockAccount(owner);
```

### Send the result and find out the winners 

```shell
// After the lottery closes you can send the 10th block hash via lottery

// Unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// call the lottery method while the 10th block is still available 
ETHLottery.lottery();

// Make sure you lock the owner account
web3.personal.lockAccount(owner);
```
