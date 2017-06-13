# ETHLottery

The Ethereum TX Hash Lottery

ETHLottery is a 100% fair lottery based on Ethereum blockchain technology, where the result is chosen based on a certain Ethereum Tx Hash made in the future, therefore impossible to guess and temper with.

## How it works

Each round starts with an empty Ethereum smart contract, where participants can make bets by sending a minimal fee and trying to guess which is the exact last character of the Ethereum Tx Hash generated only and really *only* after the lottery is closed.

The Ethereum Tx Hash used as lottery result belongs to the only transaction made from the ETHLottery smart contract to the lottery owner's Ethereum wallet with the payment of the owner fee, this happens only once and only when the lottery is closed.

The lottery closes after the prize reaches the jackpot.

The lottery fee, the owner fee and the jackpot are values set when the contract is created and are 100% public and immutable in the blockchain.

## How to play

To send a bet create a transaction to the contract address with your bet and the minimal fee.

### Preparations
```shell
// set the ETHLottery contract ABI
var abi = [{"constant":true,"inputs":[],"name":"owner_fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"lottery","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"result","outputs":[{"name":"","type":"bytes1"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"jackpot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_char","type":"bytes1"}],"name":"play","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"open","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"_fee","type":"uint256"},{"name":"_jackpot","type":"uint256"},{"name":"_owner_fee","type":"uint256"}],"payable":false,"type":"constructor"}];

// set the ETHLottery contract address
var address = "0xa2a069c92c8f41e8433adf1609e335af035eb17b";

// set the participant / player address (to use gas and fee from)
var participant = "0xa2a069c92c8f41e8433adf1609e335af035eb17b";

// instatiate the ETHLottery contract
var ETHLottery = eth.contract(abi).at(address);
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
