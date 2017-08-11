var owner = "OWNER";
var manager = "MANAGER";
var fee = FEE;
var jackpot = JACKPOT;
var owner_fee = OWNER_FEE;
var abi = ABI;
var code = "0xCODE";

web3.eth.contract(abi).new(manager, fee, jackpot, owner_fee, { from: owner, data: code, gas: 3000000 });
