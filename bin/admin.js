loadScript('bin/conf.js');

var ETHLotteryAdmin = (function () {
    var _gas = 3000000;
    var _wait_blocks = 20;
    var _lost_block = 250;
    var _owner = "0x3a44fc70077511f4ea72171dd000021a2133158e";
    var _manager_address = "0x5f90595055e61755d71c04612e9eceeac34fb789";
    var _lottery_map = {};
    var _intervals = {};
    var _open_events = {};
    var _result_events = {};
    var _gas_price = web3.toWei(1, 'gwei');

    var _banner = function () {
        console.log('_________________________ ___   .____           __    __                       ');
        console.log('\\_   _____/\\__    ___/   |   \\  |    |    _____/  |__/  |_  ___________ ___.__.');
        console.log(' |    __)_   |    | /    ~    \\ |    |   /  _ \\   __\\   __\\/ __ \\_  __ <   |  |');
        console.log(' |        \\  |    | \\    Y    / |    |__(  <_> )  |  |  | \\  ___/|  | \\/\\___  |');
        console.log('/_______  /  |____|  \\___|_  /  |_______ \\____/|__|  |__|  \\___  >__|   / ____|');
        console.log('        \\/                 \\/           \\/                     \\/       \\/     ');
    };

    var start = function () {
        _banner();
        var manager_contract = web3.eth.contract(manager_abi).at(_manager_address);
        var register_event = manager_contract.Register(function (error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('Register ' + result.args._lottery +  ' into manager ' + result.address);
                _add_lottery(result.args._lottery);
            }
        });

        var lottery_address_list = manager_contract.lotteries();

        lottery_address_list.forEach(function(lottery_address) {
            _add_lottery(lottery_address);
        });
    };


    var _add_lottery = function (address) {
        if (_lottery_map[address]) {
            return;
        }
        var lottery = web3.eth.contract(lottery_abi).at(address);

        if (lottery.open() == false && lottery.result_hash() != 0) {
            return;
        }

        console.log('add ' + address);

        _lottery_map[address] = lottery;

        _open_events[address] = lottery.Open(function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('Open ' + result.address);
                if (result.args._open == false) {
                    console.log('Closed ' + result.address);
                    _open_events[result.address].stopWatching();
                    var lottery = _lottery_map[result.address];
                    _duplicate_lottery(lottery);
                    var wait_block = result.blockNumber + _wait_blocks;
                    console.log('waiting for ' + _wait_blocks + ' blocks from ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                    _intervals[result.address] = setInterval(function () {
                        console.log('waiting ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                        if (eth.blockNumber > wait_block) {
                            console.log('finish waiting ' + eth.blockNumber + ' until ' + wait_block + ' for ' + result.address);
                            clearInterval(_intervals[result.address]);
                            _call_lottery(result.address);
                        }
                    }, 10000);
                }
            }
        });
        _result_events[address] = lottery.Result(function(error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('Result ' + result.args._result + ' for ' + result.address);
                _result_events[result.address].stopWatching();
                var lottery = _lottery_map[result.address];
                var accumulate_from = lottery.address;
                if (lottery.winners_count() != 0) {
                    accumulate_from = null;
                    console.log('*  *  *  *  * * * * ***** WINNER ****** * * * * * *  *  *  *  *');
                }
                _duplicate_lottery(lottery, accumulate_from);
            }
        });

        if (lottery.open() == false && 
            lottery.result_hash() == 0 && 
            eth.blockNumber > lottery.result_block().plus(_wait_blocks) && 
            eth.blockNumber < lottery.result_block().plus(_lost_block)) {
            console.log('need lottery ' + lottery.address);
            _call_lottery(lottery.address);
        }
    };

    var player = function () {
        console.log('player');
        for (var address in _lottery_map) {
            var guess = Math.floor(Math.random() * 256).toString(16);
            play(address, guess);
        }
    };

    var play = function (address, guess) {
        if (guess.length == 2 && guess.match(/[0-9a-f]{2}/)) {
            console.log('play 0x' + guess + ' on ' + address);
            var lottery = _lottery_map[address];
            if (lottery.open() == true) {
                lottery.play('0x' + guess, { from: _owner, gas: _gas, gasPrice: _gas_price, value: lottery.fee().toString(10) }, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {
                        console.log('played 0x' + guess + ' on ' + lottery.address);
                    }
                });
            }
        }
        else {
            console.log('guess should be [0-9a-f]{2}');
        }
    };

    var manual_lottery = function () {
        for (var address in _lottery_map) {
            var lottery = _lottery_map[address];
            if (lottery.open() == false && 
                lottery.result_hash() == 0 && 
                eth.blockNumber > lottery.result_block().plus(_lost_block)) {
                var hash = eth.getBlock(lottery.result_block()).hash;
                if (hash) {
                    lottery.manual_lottery(hash, { from: _owner, gas: _gas, gasPrice: _gas_price }, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                        if (result) {
                            console.log('manual lottery tx ' + result);
                            console.log('manual lottery ' + lottery.address);
                        }
                    });
                }
            }
        }
    };

    var _call_lottery = function (address) {
        var lottery = _lottery_map[address];
        lottery.lottery({ from: _owner, gas: _gas, gasPrice: _gas_price }, function (error, result) {
            if (error) {
                console.log(error);
            }
            if (result) {
                console.log('lottery tx ' + result);
                console.log('lottery ' + lottery.address);
            }
        });
    };

    var _duplicate_lottery = function (lottery, accumulate_from) {
        var times = accumulate_from ? 2 : 1;
        _deploy_lottery(
            lottery.fee().toString(10),
            lottery.jackpot().times(times).toString(10),
            lottery.owner_fee().toString(10),
            accumulate_from
        );
    };

    var deploy_first = function (fee, jackpot) {
        _deploy_lottery(fee, jackpot, 2);
    };

    var _deploy_lottery = function (fee, jackpot, owner_fee, accumulate_from) {
        console.log('Deploy')
        console.log('fee ' + fee);
        console.log('jackpot ' + jackpot);
        console.log('owner fee ' + owner_fee);
        if (accumulate_from) {
            console.log('accumulate value ' + eth.getBalance(accumulate_from) + ' from ' + accumulate_from);
        }
        else {
            accumulate_from = _owner;
            console.log('do not accumulate');
        }
        web3.eth.contract(lottery_abi).new(_manager_address, fee, jackpot, owner_fee, accumulate_from,
            { from: _owner, data: lottery_code, gas: _gas, gasPrice: _gas_price },
            function (error, result) {
                if (error) {
                    console.log(error);
                }
                if (result) {
                    console.log('created tx ' + result.transactionHash);
                    if (result.address) {
                        console.log('created ' + result.address);
                        _add_lottery(result.address);
                    }
                }
            }
        );
    };

    return {
        start: start,
        deployFirst: deploy_first,
        play: play,
        player: player,
        manualLottery: manual_lottery
    };
})();
