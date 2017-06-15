# ETHLottery

The Ethereum TX Hash Lottery

ETHLottery is a 100% fair lottery based on Ethereum blockchain technology, where the result is chosen based on a certain Ethereum Tx Hash made in the future, therefore impossible to guess and temper with.

## How it works

Each round starts with an empty Ethereum smart contract, where participants can make bets by sending a minimal fee and trying to guess which is the exact last character of the Ethereum Tx Hash generated only and really *only* after the lottery is closed.

The Ethereum Tx Hash used as lottery result belongs to the only transaction made from the ETHLottery smart contract to the lottery owner's Ethereum wallet with the payment of the owner fee, this happens only once and only when the lottery is closed.

The lottery closes after the prize reaches the jackpot.

The lottery fee, the owner fee and the jackpot are values set when the contract is created and are 100% public and immutable in the blockchain.

## How to play with geth on CLI

To send a bet create a transaction to the contract address with your bet and the minimal fee.

### Preparations
```shell
// set the ETHLottery contract ABI
var abi = [{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"}];

// set the ETHLottery contract address
var address = "0x4b8ed55eac499816532a5388373bfff0398c8203";

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
web3.personal.unlockAccount(participant, "YOUR_VERY_SECRET_PASSWORD")

// call the play function passing the guess as a single char string
ETHLottery.play("a", {from: participant, value: amount});

// make sure you lock the account again
web3.personal.lockAccount(participant)
```

### Withdraw prize
```shell
// unlock the participant account / wallet
web3.personal.unlockAccount(participant, "YOUR_VERY_SECRET_PASSWORD")

// withdraw the prize, after ETHLottery is closed, only for winners
ETHLottery.withdraw({from: participant);

// make sure you lock the account again
web3.personal.lockAccount(participant)
```

## How to play with js GUI

### Install dependency
```shell
npm install web3 bignumber
```

## How to run your own ETHLottery

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
var abi = [{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"}];

// Set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x6060604052341561000c57fe5b604051606080610ae0833981016040528080519060200190919080519060200190919080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600060146101000a81548160ff021916908315150217905550670de0b6b3a76400008302600381905550670de0b6b3a76400008202600181905550806004819055505b5050505b610a0c806100d46000396000f300606060405236156100b8576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806314ce4059146100ba57806320965255146100e05780632b68b9c6146100fe5780632ddbd13a146101105780633ccfd60b146101365780633fd964df14610148578063653721471461018a5780636b31ee01146101f45780638da5cb5b1461021a578063be3e33d51461026c578063ddca3f43146102a6578063fcfff16f146102cc575bfe5b34156100c257fe5b6100ca6102f6565b6040518082815260200191505060405180910390f35b6100e86102fc565b6040518082815260200191505060405180910390f35b341561010657fe5b61010e610305565b005b341561011857fe5b6101206103be565b6040518082815260200191505060405180910390f35b341561013e57fe5b6101466103c4565b005b341561015057fe5b61018860048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610542565b005b341561019257fe5b61019a61073e565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156101fc57fe5b610204610770565b6040518082815260200191505060405180910390f35b341561022257fe5b61022a610776565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102a460048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690602001909190505061079c565b005b34156102ae57fe5b6102b6610976565b6040518082815260200191505060405180910390f35b34156102d457fe5b6102dc61097c565b604051808215151515815260200191505060405180910390f35b60045481565b60003490505b90565b600060149054906101000a900460ff161515156103225760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561037f5760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b60025481565b6000600060149054906101000a900460ff161515156103e35760006000fd5b6000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156104325760006000fd5b600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f19350505050151561053c5780600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5b5b50565b600060006000600060149054906101000a900460ff161515156105655760006000fd5b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105c25760006000fd5b83600560006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060066000600560009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000209250828054905060025481151561069557fe5b049150600090505b828054905081101561073557816007600085848154811015156106bc57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b808060010191505061069d565b5b5b5b50505050565b600560009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000281565b60015481565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600060149054906101000a900460ff1615156107ba5760006000fd5b60035434101515156107cc5760006000fd5b60066000837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208054806001018281610835919061098f565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503460026000828254019250508190555060015460025410151561096f576000600060146101000a81548160ff0219169083151502179055506064600454600254028115156108cf57fe5b04905080600260008282540392505081905550600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f19350505050151561096e57806002600082825401925050819055506001600060146101000a81548160ff0219169083151502179055505b5b5b5b5b5050565b60035481565b600060149054906101000a900460ff1681565b8154818355818115116109b6578183600052602060002091820191016109b591906109bb565b5b505050565b6109dd91905b808211156109d95760008160009055506001016109c1565b5090565b905600a165627a7a723058200c33f797e2dac810fb742d51cc6f3d04cdf8112031f3a0732aa10f304ab4a99f0029";

// Unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD")

// create contract
var contract = web3.eth.contract(abi);
var ETHLottery = contract.new(fee, jackpot, owner_fee, { from: owner, data: code, gas: 1000000 });

// Make sure you lock the owner account
web3.personal.lockAccount(owner)
```
