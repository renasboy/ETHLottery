var owner = "OWNER"
var lottery = "LOTTERY";
var new_lottery = "NEW_LOTTERY";
var abi = ABI;

web3.eth.contract(abi).at(lottery).accumulate(new_lottery, { from: owner, gasPrice: web3.toWei(1, 'gwei') });
