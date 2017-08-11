# ETHLottery

The Ethereum Block Hash Lottery

ETHLottery is a 100% fair lottery based on Ethereum blockchain technology, where the result is chosen based on a certain Ethereum Block Hash created in the future, therefore impossible to precalculate and temper with.

ETHLottery was designed to spare as much ether gas as possible keeping interactions to a minimum and a tidy contract code with simplistic logic.

## How it works

Each round starts with an Ethereum smart contract with empty balance, unless previous round has accumulated, during each round participants can make bets by sending the minimal fee and trying to guess which is the exact last byte of a certain Ethereum Block Hash generated only and **really only** after the lottery is closed.

The Ethereum Block Hash is stored in hexadecimal format therefore the last byte are the exact last two characters of the hash. (Eg.: 0x00, 0xca, 0xf1, 0x3d). This gives 1 chance in 256 with possible byte values ranging from 0x00 to 0xff.

Example Ethereum Block Hash:
**0x5a801d8cf81a8ad942d5fa1b47f25b0b1507b7531b93f13ef9764e287bc51800**

From the example above the winning result byte would be **0x00** as the hash ends in 00.

The Ethereum Block Hash used as lottery result belongs to the 10th block, after the block containing the only transaction made from the ETHLottery smart contract to the lottery owner's Ethereum wallet with the payment of the owner fee, this action happens only once and only after the lottery is closed.

The lottery closes exactly when the contract balance which holds the prize, reaches or surpasses the value of the jackpot.

The lottery fee, the owner fee and the jackpot are values set when the contract is created and are 100% public and immutable in the blockchain.

In case there are **no** winning bets with the exact last byte guess, the lottery jackpot prize accumulates to next lottery round.

The lottery prize jackpot is divided equally among all winning participants.

All lotteries have owner fee set during lottery creation which is a percentage of the jackpot.

## How to play with geth console on CLI

### Preparations

Before sending a bet, make the preparations by creating the lottery instance, pointing to the ABI and already deployed contract address.

```shell
// set the ETHLottery contract ABI
var abi = ;

// set the ETHLottery contract address
var address = "0xa55e4642e1630d6b49d6727b700dc15cac19fe72";

// set the participant address (to use gas and fee from)
var participant = "0xa2a069c92c8f41e8433adf1609e335af035eb17b";

// instantiate the ETHLottery contract
var ETHLottery = eth.contract(abi).at(address);
```

### Public lottery methods (read-only = FREE)

Its always possible to see the current lottery status by calling the read-only methods.

```shell
// lottery name
ETHLottery.name();

// lottery open status, (true or false)
ETHLottery.open();

// jackpot amount in WEI 
ETHLottery.jackpot();

// bet minimum fee amount in WEI
ETHLottery.fee();

// owner fee amount in percentage of balance
ETHLottery.owner_fee();

// block number containing winning result hash, only when open=false
ETHLottery.result_block();

// block hash containing winning result byte, only when open=false
ETHLottery.result_hash();

// lottery result byte, the result, only when open=false
ETHLottery.result();

// number of winners, only when open=false and result is available
ETHLottery.winners_count();
```

### Sending bets

To send a bet, create a transaction to the contract address by calling the function play() passing the bet guess and the minimal fee payment as value.

```shell
// set the bet guess to a byte represented in hexadecimal (from 0x00 to 0xff)
var guess = '0x3d';

// set the amount to the minimum fee from contract value
var amount = ETHLottery.fee().toString(10);

// unlock the participant account / wallet
web3.personal.unlockAccount(participant, "YOUR_VERY_SECRET_PASSWORD");

// call the play function passing the bet guess and the value
ETHLottery.play(guess, {from: participant, value: amount});

// make sure you lock the account again
web3.personal.lockAccount(participant);

// send more bets
ETHLottery.play('0xbc', {from: participant, value: amount});
ETHLottery.play('0xca', {from: participant, value: amount});
ETHLottery.play('0x78', {from: participant, value: amount});
ETHLottery.play('0xf1', {from: participant, value: amount});
```

### Withdraw prize

In case the bet sent was a winning bet, right after the lottery result is known it is possible to withdraw the prize by calling the withdraw() function for the winning participant.

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

### Create a new lottery by deploying contract

First step is to create a new lottery deploying the contract to Ethereum blockchain network.

At this step, its possible to set the minimum bet fee, the jackpot amount and the owner fee.

```shell
// set the manager contract address
var manager_address = '0x4b8ed55eac499816532a5388373bfff0398c8203';

// set betting minimum fee amount to 0.001 ETH
var fee = 1000000000000000;

// set jackpot amount to 1 ETH
var jackpot = 1000000000000000000;

// set owner fee amount in percentage of total
var owner_fee = 2;

// set the owner address
var owner = web3.eth.accounts[0];

// set the ABI for the current contract version
// created with: solc --abi ETHLottery.sol
var abi = ;

// set the compiled code for the current contract version
// created with: run solc --bin ETHLottery.sol
var code = "0x";

// unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// create contract
var contract = web3.eth.contract(abi);
var ETHLottery = contract.new(manager_address, fee, jackpot, owner_fee, { from: owner, data: code, gas: 1000000 });

// make sure you lock the owner account
web3.personal.lockAccount(owner);
```

### Send the result and find out the winners 

After lottery is closed, by contract balance hitting the jackpot, it is possible to run the lottery to know the result.

This action need to be performed after 10 blocks have passed from the lottery close block.

```shell
// unlock the owner account
web3.personal.unlockAccount(owner, "YOUR_VERY_SECRET_PASSWORD");

// call the lottery method while the 10th block is still available 
ETHLottery.lottery();

// make sure you lock the owner account
web3.personal.lockAccount(owner);
```

## How to play using the official ETHLottery client

The official ETHLottery client is available under this [github repository](https://github.com/re2005/ETHLottery-Client)

Follow the instructions from the README page on how to install the official ETHLottery client.


### Live official ETHLottery Client demo

There is also a [live demo](https://lifelottery.github.io/) currently running against the ropsten test network

Demo requires metamask installed on latest version of google chrome browser.

There is a step by step manual on how to play using the official ETHLottery client.
