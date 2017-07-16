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
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"total","type":"uint256"}],"name":"Total","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"open","type":"bool"}],"name":"Open","type":"event"}];

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
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result_block","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_result_hash","type":"bytes32"}],"name":"manual_lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"result_hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"total","type":"uint256"}],"name":"Total","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"result","type":"bytes1"}],"name":"Result","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"open","type":"bool"}],"name":"Open","type":"event"}];

// Set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x60606040527f4554484c6f7474657279202d204c61737420312042797465204c6f7474657279600090600019169055341561003657fe5b604051606080611091833981016040528080519060200190919080519060200190919080519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600160146101000a81548160ff021916908315150217905550670de0b6b3a76400008302600481905550670de0b6b3a76400008202600281905550806005819055507fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600160149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b5050505b610f49806101486000396000f300606060405236156100d9576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100db57806314ce4059146101095780632b68b9c61461012f5780632ddbd13a146101415780633ccfd60b14610167578063494d93cc146101795780634f01d77e1461019f57806365372147146101c35780636b31ee011461022d5780638da5cb5b14610253578063ba13a572146102a5578063be3e33d5146102b7578063ca92a136146102f1578063ddca3f431461031f578063fcfff16f14610345575bfe5b34156100e357fe5b6100eb61036f565b60405180826000191660001916815260200191505060405180910390f35b341561011157fe5b610119610375565b6040518082815260200191505060405180910390f35b341561013757fe5b61013f61037b565b005b341561014957fe5b610151610434565b6040518082815260200191505060405180910390f35b341561016f57fe5b61017761043a565b005b341561018157fe5b6101896105b8565b6040518082815260200191505060405180910390f35b34156101a757fe5b6101c16004808035600019169060200190919050506105be565b005b34156101cb57fe5b6101d36108af565b60405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b341561023557fe5b61023d6108e1565b6040518082815260200191505060405180910390f35b341561025b57fe5b6102636108e7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102ad57fe5b6102b561090d565b005b6102ef60048080357effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019091905050610c3e565b005b34156102f957fe5b610301610ead565b60405180826000191660001916815260200191505060405180910390f35b341561032757fe5b61032f610eb3565b6040518082815260200191505060405180910390f35b341561034d57fe5b610355610eb9565b604051808215151515815260200191505060405180910390f35b60005481565b60055481565b600160149054906101000a900460ff161515156103985760006000fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103f55760006000fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b565b60035481565b6000600160149054906101000a900460ff161515156104595760006000fd5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541115156104a85760006000fd5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f1935050505015156105b25780600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5b5b5b50565b60065481565b600060006000600160149054906101000a900460ff161515156105e15760006000fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561063e5760006000fd5b8360078160001916905550600754601f60208110151561065a57fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600860006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060096000600860009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002092506000838054905011156107fd57828054905060035481151561075c57fe5b049150600090505b82805490508110156107fc5781600a6000858481548110151561078357fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610764565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b50505050565b600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000281565b60025481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006000600160149054906101000a900460ff161515156109305760006000fd5b60065443101580156109485750610100600654014311155b8015610961575060075460001916600654406000191614155b151561096d5760006000fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156109ca5760006000fd5b6006544060078160001916905550600754601f6020811015156109e957fe5b1a7f010000000000000000000000000000000000000000000000000000000000000002600860006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009004021790555060096000600860009054906101000a90047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000209250600083805490501115610b8c578280549050600354811515610aeb57fe5b049150600090505b8280549050811015610b8b5781600a60008584815481101515610b1257fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8080600101915050610af3565b5b7fce2892841501496330839ba407f44943da10eb31b71db5c90df80c1ae1d7d1d3600860009054906101000a90047f01000000000000000000000000000000000000000000000000000000000000000260405180827effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390a15b5b5b5b505050565b6000600160149054906101000a900460ff161515610c5c5760006000fd5b6004543410151515610c6e5760006000fd5b60096000837effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000208054806001018281610cd79190610ecc565b916000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505034600360008282540192505081905550600254600354101515610e6d576000600160146101000a81548160ff021916908315150217905550600a4301600681905550606460055460035402811515610d7b57fe5b04905080600360008282540392505081905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f193505050501515610e2257806003600082825401925050819055506001600160146101000a81548160ff02191690831515021790555060006006819055505b7fc15f25c4eb6ac5b9dc23661b850cbdb3ee36aebed198ad870ab929bae77142de600160149054906101000a900460ff16604051808215151515815260200191505060405180910390a15b7f52943ff53e8b9337883aec1e8f6e90805dcc4243c9cb97464c1500f1b35f07236003546040518082815260200191505060405180910390a15b5b5b5050565b60075481565b60045481565b600160149054906101000a900460ff1681565b815481835581811511610ef357818360005260206000209182019101610ef29190610ef8565b5b505050565b610f1a91905b80821115610f16576000816000905550600101610efe565b5090565b905600a165627a7a723058208bb1e4a4b7108a82e0a0947a5e68f03dee70bbbef96714f2648a95a12a5359d20029";

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
