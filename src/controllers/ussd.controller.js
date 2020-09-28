const Ussd = require('../models/insurance.model.js');
var unirest = require('unirest');
const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });


// var apiurl = 'http://api-collect.paynowafrica.com/api/services/app/Ussd/';
var apiurl = 'https://33d1cb543226.ngrok.io/api/services/app/'
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
                menu.con('use the number use were sign up with');
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

menu.state('Menu', {
    run: async() => {
        // var mobile = menu.val;
        var mobile = await menu.session.get('account');
        console.log(mobile);
        await fetchAccount(mobile, (data)=> { 
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
                // `menu.go('Number');
                menu.con('use the number use were sign up with');
            }
        });
        
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'SaveOnBehalf',
        '5': 'Others',
        'input': 'Number.account'
    }
});

menu.state('Number', {
    run: () => {
        console.log(menu.args);
        menu.end('use the number use were sign up with');
    },
    next: {
        // using regex to match user input to next state
        'input': 'Number.account'
    }
});


// nesting states
menu.state('Number.account', {
    run: async() => {
        // use menu.val to access user input value
        var account = menu.val;
        // save user input in session
        await fetchAccount(account, (data)=> { 
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
                // `menu.go('Number');
                menu.end('use the number use were sign up with');
            }
        });

    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'SaveOnBehalf',
        '5': 'Others',
        'input': 'Number.account'
    }
});

menu.state('Savings', {
    run: async() => {
        var rate = await menu.session.get('rate');
        menu.con('Enter amount to Save ' +
            '\n Daily Rate GHC ' + rate);
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
        menu.con('You want to perform saving of amount GHC ' + amount +
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
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Deposit',groupid:groupid,accountid:accountid,netWork: network,mobile: mobile,amount: amount,withdrawal:false};
        postPayment(data, (result)=> { console.log(result)  });
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone.');
    }
});

menu.state('Savings.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});


menu.state('checkBalance', {
    run: async() => {
        // fetch balance
        var balance = await menu.session.get('balance');
        var rate = await menu.session.get('rate');
        // use menu.end() to send response and terminate session
        menu.con('Balance Information' +
            '\nNumber Of Share ' + (balance/rate) +
            '\nAmount GHS ' + balance +
            '\n1. Ok' +
            '\n#. Main Menu');
    },
    next: {
        '1': 'checkBalance.confirm',
        '#': 'Menu'
    }
});

menu.state('checkBalance.confirm', {
    run: () => {
        // Ok checkBalance 
        menu.end('Thank you for using paynow services.');
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
    run: async() => {
        menu.con('Enter Member Id or Mobile Number');
    },
    next: {
        // using input to match user input to next state
        '*[0-9]+': 'SaveOnBehalf.member'
    }
});

menu.state('SaveOnBehalf.member', {
    run: async() => {
        var mobile = menu.val;
        await fetchAccount(mobile, async(data)=> {
            if(data.success) {     
                var name = await menu.session.get('name');
                var rate = await menu.session.get('rate');
                menu.con('Name: '+ name +
                    '\nEnter amount to Save' +
                    '\n Daily Rate GHC ' + rate);
            } else {
                // `menu.go('Number');
                menu.con('Incorrect Mobile Number'+ 
                    '\n1. Try Again');
            }
        });
        
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'SaveOnBehalf.amount',
        '#': 'Menu',
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
        // access user input value save in session
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Deposit',groupid:groupid,accountid:accountid,netWork: network,mobile: mobile,amount: amount,withdrawal:false};
        postPayment(data, (result)=> { console.log(result)  });
        // var amount = await menu.session.get('amount');
        menu.end('Payment request of amount GHC' + amount + ' sent to your phone.');
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
        menu.session.set('network', args.Operator);
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
        if (val && val.startsWith('+233')) {
            // Remove Bearer from string
            val = val.replace('+233','0');
        }
        var api_endpoint = apiurl + 'Ussd/GetAccountDetails?input=' + val + '&tenantId=' + tenant;
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
                menu.session.set('account', val);
                menu.session.set('rate', response.result.rate);
                menu.session.set('type', response.result.type);
                menu.session.set('accountid', response.result.id);
                menu.session.set('groupid', response.result.groupid);
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

async function postPayment(val, callback) {
    var api_endpoint = apiurl + 'Mobile/PostPayments?tenantId=' + tenant;
    var req = unirest('POST', api_endpoint)
    .headers({
        'Content-Type': 'application/json'
    })
    .send(JSON.stringify({agent:null,account:val.account,accountId:val.accountid,type:val.type,method:'MOMO',netWork:val.network,mobile:val.mobile,source:'USSD',groupid:val.groupid,amount:val.amount,reference:'Group Save',tenantId:tenant,withdrawal:val.withdrawal}))
    .end( async(res)=> { 
        if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
        var response = JSON.parse(resp.raw_body);
        await callback(response);
    });
    return true
}