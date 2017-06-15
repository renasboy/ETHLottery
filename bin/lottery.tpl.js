var owner = "OWNER"
var lottery = "LOTTERY"
var result = "RESULT"
var abi = ABI;

web3.eth.contract(abi).at(lottery).lottery(result);

miner.start(1);
admin.sleepBlocks(1);
miner.stop();
