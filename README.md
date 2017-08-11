# ETHLottery

The Ethereum Block Hash Lottery

ETHLottery is a 100% fair lottery based on Ethereum blockchain technology, where the result is chosen based on a certain Ethereum Block Hash created in the future, therefore impossible to guess and temper with.

ETHLottery was designed to save as much gas as possible keeping the interactions to a minimum and a tidy contract code and logic.

## How it works

Each round starts with an empty Ethereum smart contract, unless previous round has accumulated, during the round participants can make bets by sending the minimal fee and trying to guess which is the exact last byte of a certain Ethereum Block Hash generated only and **really only** after the lottery is closed.

The Ethereum Block Hash is stored in hexadecimal format therefore the last byte are the exact last two characters of the hash. (Eg.: 0x00, 0xca, 0xf1, 0x3d). This gives 1 chance in 256 with possible bytes values ranging from 0x00 to 0xff.

The Ethereum Block Hash used as lottery result belongs to the 10th block after the block containing the only transaction made from the ETHLottery smart contract to the lottery owner's Ethereum wallet with the payment of the owner fee, this happens only once and only when the lottery is closed.

The lottery closes after the contract balance which holds the prize, reaches the value of the jackpot.

The lottery fee, the owner fee and the jackpot are values set when the contract is created and are 100% public and immutable in the blockchain.

In case there are no winning bets with exact last byte guess, the lottery prize accumulates to next lottery round.

## How to play with geth console on CLI

### Preparations

Before sending a bet, make the preparations by creating the lottery instance pointing to the ABI and already deployed contract address.

```shell
// set the ETHLottery contract ABI
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"manager_address","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_lottery","type":"address"}],"name":"accumulate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winners_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_balance","type":"uint256"}],"name":"Balance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_open","type":"bool"}],"name":"Open","type":"event"}];

// set the ETHLottery contract address
var address = "0xa55e4642e1630d6b49d6727b700dc15cac19fe72";

// set the participant / player address (to use gas and fee from)
var participant = "0xa2a069c92c8f41e8433adf1609e335af035eb17b";

// instatiate the ETHLottery contract
var ETHLottery = eth.contract(abi).at(address);
```

### Public lottery methods (read-only = FREE)

Its always possible to see the current lottery status by calling the read-only methods.

```shell
// See lottery name
ETHLottery.name();

// See lottery status, open (true/false) 
ETHLottery.open();

// See jackpot amount in WEI 
ETHLottery.jackpot();

// See betting minimum fee amount in WEI
ETHLottery.fee();

// See owner fee amount in percentage of balance
ETHLottery.owner_fee();

// See block number which will contain winner hash, only when open=false
ETHLottery.result_block();

// See block hash that makes the result, only when open=false
ETHLottery.result_hash();

// See lottery result, only when open=false
ETHLottery.result();

// See number of winners, only when open=false and result is available
ETHLottery.winners_count();
```

### Betting / Playing

To send a bet, create a transaction to the contract address calling the function play() with your guess and the payment for the minimal fee.

```shell
// set the amount to pay the minimum fee to 0.001 ETH
var amount = web3.toWei(1000000000000000, "ether");

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

It is also possible to play using the javascript GUI in the file index.html 

If you decide to test the index.html make sure to update ABI and run your own Ethereum node to attach.

### Install dependency
```shell
npm install web3 bignumber
```

## How to run your own ETHLottery

### Create a new lottery

To start create a lottery deploying the contract to Ethereum blockchain network.

```shell
// Set the manager contract address
var manager_address = '0x4b8ed55eac499816532a5388373bfff0398c8203';

// Set betting minimum fee amount to 0.001 ETH
var fee = 1000000000000000;

// Set jackpot amount to 1 ETH
var jackpot = 1000000000000000000;

// Set owner fee amount in percentage of total
var owner_fee = 2;

// Set the owner
var owner = web3.eth.accounts[0];

// Set the ABI for the current contract version
// created with: solc --abi ETHLottery.sol
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"manager_address","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_lottery","type":"address"}],"name":"accumulate","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winners_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_manager","type":"address"},{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_balance","type":"uint256"}],"name":"Balance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_open","type":"bool"}],"name":"Open","type":"event"}];

// Set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x60606040527f4554484c6f7474657279202d204c61737420312042797465204c6f7474657279600090600019169055341561003957600080fd5b6040516080806113a7833981016040528080519060200190919080519060200190919080519060200190919080519060200190919050505b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff02191690831515021790555083600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260048190555081600381905550806005819055507fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600260149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b505050505b611225806101826000396000f300606060405236156100fa576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100ff57806314ce4059146101305780631800ed8e146101595780631aa3a008146101ae5780632b68b9c6146101c35780633ccfd60b146101d8578063494d93cc146101ed5780634f01d77e14610216578063653721471461023d5780636b31ee01146102aa5780638da5cb5b146102d35780638f045bb614610328578063ba13a57214610361578063be3e33d514610376578063ca92a136146103b0578063ddca3f43146103e1578063fbe6a9b21461040a578063fcfff16f14610433575b600080fd5b341561010a57600080fd5b610112610460565b60405180826000191660001916815260200191505060405180910390f35b341561013b57600080fd5b610143610466565b6040518082815260200191505060405180910390f35b341561016457600080fd5b61016c61046c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101b957600080fd5b6101c1610492565b005b34156101ce57600080fd5b6101d6610591565b005b34156101e357600080fd5b6101eb610648565b005b34156101f857600080fd5b6102006107c1565b6040518082815260200191505060405180910390f35b341561022157600080fd5b61023b6004808035600019169060200190919050506107c7565b005b341561024857600080fd5b610250610acf565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b34156102b557600080fd5b6102bd610b01565b6040518082815260200191505060405180910390f35b34156102de57600080fd5b6102e6610b07565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561033357600080fd5b61035f600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b2d565b005b341561036c57600080fd5b610374610bc3565b005b6103ae60048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610f0a565b005b34156103bb57600080fd5b6103c3611183565b60405180826000191660001916815260200191505060405180910390f35b34156103ec57600080fd5b6103f4611189565b6040518082815260200191505060405180910390f35b341561041557600080fd5b61041d61118f565b6040518082815260200191505060405180910390f35b341561043e57600080fd5b610446611195565b604051808215151515815260200191505060405180910390f35b60005481565b60055481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104f057600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff16631aa3a0086040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b151561057857600080fd5b6102c65a03f1151561058957600080fd5b5050505b5b50565b600260149054906101000a900460ff161515156105ad57600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561060957600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b6000600260149054906101000a900460ff1615151561066657600080fd5b6000600b60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156106b457600080fd5b600b60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600b60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156107bb5780600b60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5b5b50565b60065481565b6000806000600260149054906101000a900460ff161515156107e857600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561084457600080fd5b8360088160001916905550600854601f60208110151561086057fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600960006101000a81548160ff02191690837f010000000000000000000000000000000000000000000000000000000000000090040217905550600a6000600960009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000209250828054905060078190555060006007541115610a1d576007543073ffffffffffffffffffffffffffffffffffffffff163181151561097e57fe5b049150600090505b600754811015610a1c5781600b600085848154811015156109a357fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610986565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600960009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b50505050565b600960009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000281565b60035481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260149054906101000a900460ff16151515610b4957600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ba557600080fd5b8073ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b50565b6000806000600260149054906101000a900460ff16151515610be457600080fd5b6006544310158015610bfc5750610100600654014311155b8015610c15575060085460001916600654406000191614155b1515610c2057600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c7c57600080fd5b6006544060088160001916905550600854601f602081101515610c9b57fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600960006101000a81548160ff02191690837f010000000000000000000000000000000000000000000000000000000000000090040217905550600a6000600960009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000209250828054905060078190555060006007541115610e58576007543073ffffffffffffffffffffffffffffffffffffffff1631811515610db957fe5b049150600090505b600754811015610e575781600b60008584815481101515610dde57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610dc1565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600960009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b5b505050565b6000600260149054906101000a900460ff161515610f2757600080fd5b6004543410151515610f3857600080fd5b600a6000837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208054806001018281610fa191906111a8565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506003543073ffffffffffffffffffffffffffffffffffffffff163110151561112e576000600260146101000a81548160ff021916908315150217905550600a430160068190555060646005543073ffffffffffffffffffffffffffffffffffffffff16310281151561105f57fe5b049050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156110e3576001600260146101000a81548160ff02191690831515021790555060006006819055505b7fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600260149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b7fe8d947d7ebdd7b8b8fa2ad2022c7591418ac32d8c29c5f8a8fc9de52ffa540923073ffffffffffffffffffffffffffffffffffffffff16316040518082815260200191505060405180910390a15b5b5b5050565b60085481565b60045481565b60075481565b600260149054906101000a900460ff1681565b8154818355818115116111cf578183600052602060002091820191016111ce91906111d4565b5b505050565b6111f691905b808211156111f25760008160009055506001016111da565b5090565b905600a165627a7a72305820b6be0c4aaef21b880017e866ad3d62d57e89302f79f8ffe0ae8d7f3c1f8f27d70029";

// Unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// create contract
var contract = web3.eth.contract(abi);
var ETHLottery = contract.new(manager_address, fee, jackpot, owner_fee, { from: owner, data: code, gas: 1000000 });

// Make sure you lock the owner account
web3.personal.lockAccount(owner);
```

### Send the result and find out the winners 

After lottery is closed, by contract balance hitting the jackpot, it is possible to run the lottery to know the result.

This action need to be performed after 10 blocks have passed from the lottery close block.

```shell
// Unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// call the lottery method while the 10th block is still available 
ETHLottery.lottery();

// Make sure you lock the owner account
web3.personal.lockAccount(owner);
```
