var owner = "OWNER";
var fee = FEE;
var jackpot = JACKPOT;
var owner_fee = OWNER_FEE;
var abi = ABI;
var code = "0xCODE";

web3.eth.contract(abi).new(fee, jackpot, owner_fee, { from: owner, data: code, gas: 1000000 });

miner.start(1);
admin.sleepBlocks(1);
miner.stop();
