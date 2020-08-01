const Ussd = require('../models/insurance.model.js');
var unirest = require('unirest');
const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });


var apiurl = 'http://api-collect.paynowafrica.com/api/services/app/Ussd/';
var tenant = 1;
let sessions = {};

menu.sessionConfig({
    start: (sessionId, callback) => {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if (!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
    },
    end: (sessionId, callback) => {
        // clear current session
        // this is called by menu.end()
        delete sessions[sessionId];
        callback();
    },
    set: (sessionId, key, value, callback) => {
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
    },
    get: (sessionId, key, callback) => {
        // retrieve value by key in current session
        let value = sessions[sessionId][key];
        callback(null, value);
    }
});


menu.on('error', (err) => {
    // handle errors
    console.log('Error', err);
});

// Define menu states
menu.startState({
    run: async() => {
        await fetchAccount(menu.args.phoneNumber, (data)=> { 
            // console.log(1,data); 
            // use menu.con() to send response without terminating session 
            if(data.success) {     
                menu.con('Welcome to '+data.result.groups+'.' + 
                    '\n Select a Service:' +
                    '\n1. Savings' +
                    '\n2. Check Balance' +
                    '\n3. Withdrawal' +
                    '\n4. Save On Behalf' +
                    '\n5. Others');
            } else {
                menu.go('Number');
            }
        });
        
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'SaveOnBehalf',
        '5': 'Others'
    }
});

menu.state('Start', {
    run: async() => {
        
        await fetchAccount(menu.val || menu.args.phoneNumber, (data)=> { 
            // console.log(1,data); 
            // use menu.con() to send response without terminating session 
            if(data.success) {     
                menu.con('Welcome to '+data.result.groups+'.' + 
                    '\n Select a Service:' +
                    '\n1. Savings' +
                    '\n2. Check Balance' +
                    '\n3. Withdrawal' +
                    '\n4. Save On Behalf' +
                    '\n5. Others');
            } else {
                menu.go('Number');
            }
        });
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'SaveOnBehalf',
        '5': 'Others'
    }
});

menu.state('Number', {
    run: () => {
        menu.con('Enter Member Number or Mobile Number used for Registration');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'Start'
    }
});

menu.state('Savings', {
    run: () => {
        menu.con('Enter amount to Save' +
            '\n Daily Rate GHC 5');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'Savings.amount'
    }
});

// nesting states
menu.state('Savings.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        // save user input in session
        menu.session.set('amount', amount);
        menu.con('You want to perform saving of amount GHS ' + amount +
            '\n1. Confirm' +
            '\n2. Cancel');

    },
    next: {
        '1': 'Savings.confirm',
        '2': 'Savings.cancel'
    }
});

menu.state('Savings.confirm', {
    run: async() => {
        // access user input value save in session
        var amount = await menu.session.get('amount');;
        menu.end('Payment request of amount GHS ' + amount + ' sent to your phone.');
    }
});

menu.state('Savings.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});


menu.state('checkBalance', {
    run: () => {
        // fetch balance
        // fetchBalance(menu.args.phoneNumber).then((bal) => {
        // use menu.end() to send response and terminate session
        menu.con('Balance Information' +
            '\nNumber Of Share 10' +
            '\nAmount GHS 10.00' +
            '\n1. Ok' +
            '\n#. Main Menu');
        // });
    },
    next: {
        '1': 'checkBalance.confirm',
        '#': 'checkBalance.cancel'
    }
});

menu.state('checkBalance.confirm', {
    run: () => {
        // Ok checkBalance 
        menu.end('Thank you for using paynow services.');
    }
});

menu.state('checkBalance.cancel', {
    run: () => {
        // Cancel Savings request
        menu.go('Start');
        // menu.end('Thank you for using paynow services.');
    }
});


menu.state('Withdrawal', {
    run: () => {
        menu.con('Enter amount to Withdraw');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'Withdrawal.amount'
    }
});

// nesting states
menu.state('Withdrawal.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.session.set('amount', amount);
        // buyAirtime(menu.args.phoneNumber, amount).then((res) => {
        //     menu.end('Airtime bought successfully.');
        // });
        menu.con('Withdrawal request ' +
            '\n Amount GHS ' + amount +
            '\n1. Confirm' +
            '\n2. Cancel');

    },
    next: {
        '1': 'Withdrawal.confirm',
        '2': 'Withdrawal.cancel'
    }
});

menu.state('Withdrawal.confirm', {
    run: async() => {
        // submit with request
        var amount = await menu.session.get('amount');
        menu.end('Withdraw request of Amount GHC ' + amount + ' submited to group master(s) for approval.');
    }
});

menu.state('Withdrawal.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});

menu.state('SaveOnBehalf', {
    run: () => {
        menu.con('Enter Member Id or Mobile Number');
    },
    next: {
        // using input to match user input to next state
        'input': 'SaveOnBehalf.member'
    }
});

menu.state('SaveOnBehalf.member', {
    run: () => {
        menu.con('Enter amount to Save' +
            '\n Daily Rate GHC 5');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'SaveOnBehalf.amount'
    }
});

// nesting states
menu.state('SaveOnBehalf.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.session.set('amount', amount);
        menu.con('You want to perform saving of amount GHS ' + amount +
            '\n1. Confirm' +
            '\n2. Cancel');

    },
    next: {
        '1': 'SaveOnBehalf.confirm',
        '2': 'SaveOnBehalf.cancel'
    }
});


menu.state('SaveOnBehalf.confirm', {
    run: async() => {
        // access user input value save in session
        var amount = await menu.session.get('amount');;
        menu.end('Payment request of amount GHS' + amount + ' sent to your phone.');
    }
});

menu.state('SaveOnBehalf.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});

menu.state('Others', {
    run: () => {
        // fetch balance
        // fetchBalance(menu.args.phoneNumber).then((bal) => {
        // use menu.end() to send response and terminate session
        menu.end('Coming Soon');
        // });
    }
});


// POST a Insurance
exports.ussd = async(req, res) => {
    // Create a
    let args = req.body;
    if (args.Type == 'initiation') {
        args.Type = req.body.Type.replace(/\b[a-z]/g, (x) => x.toUpperCase());
    }
    menu.run(args, ussdResult => {
        res.send(ussdResult);
    });
};

async function fetchAcctt(val, callback) {
    var api_endpoint = api + 'GetAccountDetails?input=' + val + '&tenantId=' + tenant
    var req = unirest('GET', '/GetAccountDetails?input='+val+'&tenantId=1')
    .end(async(res)=> { 
        // if (res.error) { throw new Error(res.error); }
        console.log(res.raw_body);

        var response = JSON.parse(res.raw_body);

        return await callback(response);;
    });
    // return "2.00"
}

async function fetchAccount(val, callback) {
    // try {
        var api_endpoint = apiurl + 'GetAccountDetails?input=' + val.replace('+233','0') + '&tenantId=' + tenant;
        console.log(api_endpoint);
        var request = unirest('GET', api_endpoint)
        .end(async(resp)=> { 
            // if (resp.error) { 
            //     console.log(resp.error); 
            //     // var response = JSON.parse(res); 
            //     return res;
            // }
            console.log(resp.raw_body);
            var response = JSON.parse(resp.raw_body);
            if(response.result)
            {
                menu.session.set('name', response.result.name);
                menu.session.set('type', response.result.type);
                menu.session.set('accountid', response.result.id);
                menu.session.set('group', response.result.groups);
                menu.session.set('balance', response.result.balance);
                menu.session.set('institution', response.result.tenant);
            }
            
            await callback(response);
        });
    // }
    // catch(err) {
    //     console.log(err);
    //     return err;
    // }
}

function buyAirtime(phone, val) {
    return true
}