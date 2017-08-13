loadScript('bin/conf.js');

var gas = 3000000;

var wait_blocks = 10;

var lost_block = 250;

var owner = "0xe581c6f0fae3bc426acfc660b36a7caf90f27987";

var manager_address = "0x88259b4a9d95ca2b237381047a6751e64ba06dd9";

var manager_contract = web3.eth.contract(manager_abi).at(manager_address);

var lottery_map = {};
var intervals = {};

var add_lottery = function (address) {
    if (lottery_map[address]) {
        return;
    }
    var lottery = web3.eth.contract(lottery_abi).at(address);

    if (lottery.open() == false && lottery.result_hash() != 0) {
        return;
    }

    console.log('add ' + address);

    lottery_map[address] = lottery;

    var open_event = lottery.Open(function(error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            console.log('Open ' + result.address);
            if (result.args._open == false) {
                console.log('Closed ' + result.address);
                var lottery = lottery_map[result.address];
                duplicate_lottery(lottery);
                var wait_block = result.blockNumber + wait_blocks;
                console.log('waiting for ' + wait_blocks + ' blocks from ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                intervals[result.address] = setInterval(function () {
                    console.log('waiting ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                    if (eth.blockNumber > wait_block) {
                        console.log('finish waiting ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                        clearInterval(intervals[result.address]);
                        call_lottery(result.address);
                    }
                }, 10000);
            }
        }
    });
    var result_event = lottery.Result(function(error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            console.log('Result ' + result.args._result + ' for ' + result.address);
            var lottery = lottery_map[result.address];
            var accumulate_from = lottery.address;
            if (lottery.winners_count() != 0) {
                accumulate_from = null;
                console.log('*  *  *  *  * * * * ***** WINNER ****** * * * * * *  *  *  *  *');
            }
            duplicate_lottery(lottery, accumulate_from);
        }
    });

    if (lottery.open() == false && 
        lottery.result_hash() == 0 && 
        eth.blockNumber > lottery.result_block().plus(wait_blocks) && 
        eth.blockNumber < lottery.result_block().plus(lost_block)) {
        console.log('need lottery ' + lottery.address);
        call_lottery(lottery.address);
    }
};

var player = function () {
    console.log('player');
    for (var address in lottery_map) {
        var guess = Math.floor(Math.random() * 256).toString(16);
        play(address, guess);
    }
};

var play = function (address, guess) {
    if (guess.length == 2 && guess.match(/[0-9a-f]{2}/)) {
        console.log('play 0x' + guess + ' on ' + address);
        var lottery = lottery_map[address];
        if (lottery.open() == true) {
            admin.sleepBlocks(1);
            lottery.play('0x' + guess, { from: owner, gas: gas, value: lottery.fee().toString(10) }, function (error, result) {
                if (error) {
                    console.log(error);
                }
                if (result) {
                    console.log('played 0x' + guess + ' on ' + lottery.address);
                }
            });
            admin.sleepBlocks(1);
        }
    }
    else {
        console.log('guess should be [0-9a-f]{2}');
    }
};

var manual_lottery = function () {
    for (var address in lottery_map) {
        var lottery = lottery_map[address];
        if (lottery.open() == false && 
            lottery.result_hash() == 0 && 
            eth.blockNumber > lottery.result_block().plus(lost_block)) {
            var hash = eth.getBlock(lottery.result_block()).hash;
            if (hash) {
                admin.sleepBlocks(2);
                lottery.manual_lottery(hash, { from: owner, gas: gas }, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {
                        console.log('manual lottery tx ' + result);
                        console.log('manual lottery ' + lottery.address);
                    }
                });
                admin.sleepBlocks(2);
            }
        }
    }
};

var call_lottery = function (address) {
    var lottery = lottery_map[address];
    admin.sleepBlocks(2);
    lottery.lottery({ from: owner, gas: gas }, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            console.log('lottery tx ' + result);
            console.log('lottery ' + lottery.address);
        }
    });
    admin.sleepBlocks(2);
};

var duplicate_lottery = function (lottery, accumulate_from) {
    var times = accumulate_from ? 2 : 1;
    deploy_lottery(
        lottery.fee().toString(10),
        lottery.jackpot().times(times).toString(10),
        lottery.owner_fee().toString(10),
        accumulate_from
    );
    admin.sleepBlocks(2);
};

var deploy_first = function () {
    deploy_lottery(1000000000000000, 1000000000000000, 2);
};

var deploy_lottery = function (fee, jackpot, owner_fee, accumulate_from) {
    console.log('Deploy')
    console.log('fee ' + fee);
    console.log('jackpot ' + jackpot);
    console.log('owner fee ' + owner_fee);
    if (accumulate_from) {
        console.log('accumulate value ' + eth.getBalance(accumulate_from) + ' from ' + accumulate_from);
    }
    else {
        accumulate_from = owner;
        console.log('do not accumulate');
    }
    admin.sleepBlocks(2);
    web3.eth.contract(lottery_abi).new(manager_address, fee, jackpot, owner_fee, accumulate_from,
        { from: owner, data: lottery_code, gas: gas },
        function (error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('created tx ' + result.transactionHash);
                if (result.address) {
                    console.log('created ' + result.address);
                    add_lottery(result.address);
                }
            }
        }
    );
    admin.sleepBlocks(2);
};

var register_event = manager_contract.Register(function (error, result) {
    if (error) {
        console.log(error);
    }
    if (result) {
        console.log('Register ' + result.args._lottery +  ' into manager ' + result.address);
        add_lottery(result.args._lottery);
    }
});

var lottery_address_list = manager_contract.lotteries();

lottery_address_list.forEach(function(lottery_address) {
    add_lottery(lottery_address);
});

/*
// REGISTER WITH NETWORK WIP
lottery_source = '';
lottery_compiled = eth.compile.solidity(lottery_source).ETHLottery;
content_hash = admin.saveInfo(lottery_compiled.info, 'ETHLotteryInfo.json');
lottery_abi = lottery_compiled.info.abiDefinition;
lottery_code = lottery_compiled.code;
// create contract
tx = eth.sendTransaction({ from: owner, data: lottery_compiled.code });
address = eth.getTransactionReceipt(tx);
// after deploy
admin.register(owner, address, content_hash);
admin.registerUrl(owner, content_hash, 'file:///ETHLotteryInfo.json');
*/

console.log('_________________________ ___   .____           __    __                       ');
console.log('\\_   _____/\\__    ___/   |   \\  |    |    _____/  |__/  |_  ___________ ___.__.');
console.log(' |    __)_   |    | /    ~    \\ |    |   /  _ \\   __\\   __\\/ __ \\_  __ <   |  |');
console.log(' |        \\  |    | \\    Y    / |    |__(  <_> )  |  |  | \\  ___/|  | \\/\\___  |');
console.log('/_______  /  |____|  \\___|_  /  |_______ \\____/|__|  |__|  \\___  >__|   / ____|');
console.log('        \\/                 \\/           \\/                     \\/       \\/     ');
