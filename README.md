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
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"manager_address","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_lottery","type":"address"}],"name":"accumulate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_balance","type":"uint256"}],"name":"Balance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_open","type":"bool"}],"name":"Open","type":"event"}];

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
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"manager_address","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_lottery","type":"address"}],"name":"accumulate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_balance","type":"uint256"}],"name":"Balance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_open","type":"bool"}],"name":"Open","type":"event"}];

// Set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x60606040527f4554484c6f7474657279202d204c61737420312042797465204c6f7474657279600090600019169055341561003957600080fd5b604051608080611363833981016040528080519060200190919080519060200190919080519060200190919080519060200190919050505b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff02191690831515021790555083600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260048190555081600381905550806005819055507fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600260149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b505050505b6111e1806101826000396000f300606060405236156100ef576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100f457806314ce4059146101255780631800ed8e1461014e5780631aa3a008146101a35780632b68b9c6146101b85780633ccfd60b146101cd578063494d93cc146101e25780634f01d77e1461020b57806365372147146102325780636b31ee011461029f5780638da5cb5b146102c85780638f045bb61461031d578063ba13a57214610356578063be3e33d51461036b578063ca92a136146103a5578063ddca3f43146103d6578063fcfff16f146103ff575b600080fd5b34156100ff57600080fd5b61010761042c565b60405180826000191660001916815260200191505060405180910390f35b341561013057600080fd5b610138610432565b6040518082815260200191505060405180910390f35b341561015957600080fd5b610161610438565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101ae57600080fd5b6101b661045e565b005b34156101c357600080fd5b6101cb61055d565b005b34156101d857600080fd5b6101e0610614565b005b34156101ed57600080fd5b6101f561078d565b6040518082815260200191505060405180910390f35b341561021657600080fd5b610230600480803560001916906020019091905050610793565b005b341561023d57600080fd5b610245610a96565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156102aa57600080fd5b6102b2610ac8565b6040518082815260200191505060405180910390f35b34156102d357600080fd5b6102db610ace565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561032857600080fd5b610354600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610af4565b005b341561036157600080fd5b610369610b8a565b005b6103a360048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610ecc565b005b34156103b057600080fd5b6103b8611145565b60405180826000191660001916815260200191505060405180910390f35b34156103e157600080fd5b6103e961114b565b6040518082815260200191505060405180910390f35b341561040a57600080fd5b610412611151565b604051808215151515815260200191505060405180910390f35b60005481565b60055481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104bc57600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff16631aa3a0086040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b151561054457600080fd5b6102c65a03f1151561055557600080fd5b5050505b5b50565b600260149054906101000a900460ff1615151561057957600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105d557600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b6000600260149054906101000a900460ff1615151561063257600080fd5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561068057600080fd5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156107875780600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5b5b50565b60065481565b6000806000600260149054906101000a900460ff161515156107b457600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561081057600080fd5b8360078160001916905550600754601f60208110151561082c57fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600860006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060096000600860009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002092506000838054905011156109e45782805490503073ffffffffffffffffffffffffffffffffffffffff163181151561094357fe5b049150600090505b82805490508110156109e35781600a6000858481548110151561096a57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b808060010191505061094b565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b50505050565b600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000281565b60035481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260149054906101000a900460ff16151515610b1057600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b6c57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b50565b6000806000600260149054906101000a900460ff16151515610bab57600080fd5b6006544310158015610bc35750610100600654014311155b8015610bdc575060075460001916600654406000191614155b1515610be757600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c4357600080fd5b6006544060078160001916905550600754601f602081101515610c6257fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600860006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060096000600860009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000209250600083805490501115610e1a5782805490503073ffffffffffffffffffffffffffffffffffffffff1631811515610d7957fe5b049150600090505b8280549050811015610e195781600a60008584815481101515610da057fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610d81565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b5b505050565b6000600260149054906101000a900460ff161515610ee957600080fd5b6004543410151515610efa57600080fd5b60096000837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208054806001018281610f639190611164565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506003543073ffffffffffffffffffffffffffffffffffffffff16311015156110f0576000600260146101000a81548160ff021916908315150217905550600a430160068190555060646005543073ffffffffffffffffffffffffffffffffffffffff16310281151561102157fe5b049050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156110a5576001600260146101000a81548160ff02191690831515021790555060006006819055505b7fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600260149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b7fe8d947d7ebdd7b8b8fa2ad2022c7591418ac32d8c29c5f8a8fc9de52ffa540923073ffffffffffffffffffffffffffffffffffffffff16316040518082815260200191505060405180910390a15b5b5b5050565b60075481565b60045481565b600260149054906101000a900460ff1681565b81548183558181151161118b5781836000526020600020918201910161118a9190611190565b5b505050565b6111b291905b808211156111ae576000816000905550600101611196565b5090565b905600a165627a7a7230582093d428425ecd2ef6219fe767fbe3d1436bd7c4e1d47be8f53bed53b4f7f6f0d50029";

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
