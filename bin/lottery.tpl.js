var owner = "OWNER"
var lottery = "LOTTERY";
var abi = ABI;

web3.eth.contract(abi).at(lottery).lottery({ from: owner, gasPrice: 1 });
