var owner = "OWNER";
var abi = ABI;
var code = "0xCODE";

web3.eth.contract(abi).new({ from: owner, data: code, gas: 3000000 });

miner.start(1);
admin.sleepBlocks(1);
miner.stop();
