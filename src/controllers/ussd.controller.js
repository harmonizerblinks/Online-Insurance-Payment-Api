const Ussd = require('../models/insurance.model.js');
var unirest = require('unirest');
const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });


// var apiurl = 'http://api-collect.paynowafrica.com/api/services/app/Ussd/';
// var apiurl = 'http://api-aslan.paynowafrica.com/api/services/app/'
var apiurl = 'https://api-aslans.paynowafrica.com/api/services/app/';
var tenant = 2;
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
                menu.con('Welcome to '+data.result.groups+'.' +'\n '+ data.result.name + 
                    '\n Select a Service:' +
                    '\n1. Savings' +
                    '\n2. Loan Repayment' +
                    '\n3. Check Balance' +
                    '\n4. Withdrawal' +
                    '\n5. Pay On Behalf' +
                    '\n6. Others');
            } else {
                menu.con('Enter the number you were sign up with');
            }
        });
        
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'Loan',
        '3': 'checkBalance',
        '4': 'Withdrawal',
        '5': 'SaveOnBehalf',
        '6': 'Others',
        '*[0-9]+': 'Number.account'
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
                menu.con('Welcome to '+data.result.groups+'.' +'\n '+ data.result.name + 
                    '\n Select a Service:' +
                    '\n1. Savings' +
                    '\n2. Check Balance' +
                    '\n3. Withdrawal' +
                    '\n4. Save On Behalf' +
                    '\n5. Others');
            } else {
                // `menu.go('Number');
                menu.con('Enter the number you were sign up with');
            }
        });
        
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'Loan',
        '3': 'checkBalance',
        '4': 'Withdrawal',
        '5': 'SaveOnBehalf',
        '6': 'Others',
        '*[0-9]+': 'Number.account'
    }
});

menu.state('Number', {
    run: () => {
        console.log(menu.args);
        menu.end('use the number use were sign up with');
    },
    next: {
        // using regex to match user input to next state
        '*[0-9]+': 'Number.account'
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
                menu.con('Welcome to '+data.result.groups+'.' +'\n '+ data.result.name + 
                    '\n Select a Service:' +
                    '\n1. Savings' +
                    '\n2. Loan',
                    '\n3. Check Balance' +
                    '\n4. Withdrawal' +
                    '\n5. Pay On Behalf' +
                    '\n6. Others');
            } else {
                // `menu.go('Number');
                menu.con('Incorrect Live Time Number' + 
                '\n Enter the number you were sign up with');
            }
        });

    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'Loan',
        '3': 'checkBalance',
        '4': 'Withdrawal',
        '5': 'SaveOnBehalf',
        '6': 'Others',
        '*[0-9]+': 'Number.account'
    }
});

menu.state('Savings', {
    run: async() => {
        var rate = await menu.session.get('rate');
        menu.con('Enter amount to Save ' +
            '\n Daily Rate GHC ' + rate);
    },
    next: {
        '#': 'Menu',
        // using regex to match user input to next state
        '*\\d+': 'Savings.amount'
    }
});

// nesting states
menu.state('Savings.amount', {
    run: async() => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        var rate = await menu.session.get('rate');
        var val = amount/rate;
        if(Number.isInteger(val)) {
            // save user input in session
            menu.session.set('amount', amount);
            menu.con('You want to perform saving of amount GHC ' + amount +
                '\n1. Confirm' +
                '\n2. Cancel');
        } else {
            menu.con('You can only pay in multiple of amount GHC ' + rate +
                '\n*. Try Again' +
                '\n2. Cancel');
        }

    },
    next: {
        '1': 'Savings.confirm',
        '2': 'Savings.cancel',
        '#': 'Menu',
        '*': 'Savings'
    }
});

menu.state('Savings.confirm', {
    run: async() => {
        // access user input value save in session
        var name = await menu.session.get('name');
        var group = await menu.session.get('group');
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Deposit',groupid:groupid,accountid:accountid,network:network,mobile: mobile,amount: amount,withdrawal:false, reference: group+' '+name};
        await postPayment(data, async(result)=> { 
            console.log(result) 
            // menu.end(JSON.stringify(result)); 
        });
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone.');
    }
});

menu.state('Savings.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});


menu.state('Loan', {
    run: async() => {
        // var rate = await menu.session.get('rate');
        menu.con('Enter amount to Pay from Loan');
    },
    next: {
        '#': 'Menu',
        // using regex to match user input to next state
        '*\\d+': 'Loan.amount'
    }
});

// nesting states
menu.state('Loan.amount', {
    run: async() => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.con('You want to Pay Loan of amount GHC ' + amount +
                '\n1. Confirm' +
                '\n2. Cancel');
        // var rate = await menu.session.get('rate');
        // var val = amount/rate;
        // if(Number.isInteger(val)) {
        //     // save user input in session
        //     menu.session.set('amount', amount);
        //     menu.con('You want to perform saving of amount GHC ' + amount +
        //         '\n1. Confirm' +
        //         '\n2. Cancel');
        // } else {
        //     menu.con('You can only pay in multiple of amount GHC ' + rate +
        //         '\n*. Try Again' +
        //         '\n2. Cancel');
        // }

    },
    next: {
        '1': 'Loan.confirm',
        '2': 'Loan.cancel',
        '#': 'Menu',
        '*': 'Loan'
    }
});

menu.state('Loan.confirm', {
    run: async() => {
        // access user input value save in session
        var name = await menu.session.get('name');
        var group = await menu.session.get('group');
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Loan',groupid:groupid,accountid:accountid,network:network,mobile: mobile,amount: amount,withdrawal:false, reference: group+ ' '+name};
        await postPayment(data, async(result)=> { 
            console.log(result) 
            // menu.end(JSON.stringify(result)); 
        });
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone.');
    }
});

menu.state('Loan.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});


menu.state('checkBalance', {
    run: async() => {
        // ask for account pin
        // use menu.end() to send response and terminate session
        menu.con('Enter Account Pin');
    },
    next: {
        '#': 'Menu',
        '*[0-9]+': 'checkBalance.show',
    }
});

menu.state('checkBalance.show', {
    run: async() => {
        // get pin
        var epin = Number(menu.val);
        var pin = await menu.session.get('pin');
        if(epin == pin) {
            // fetch balance
            var balance = await menu.session.get('balance');
            var loan = await menu.session.get('loan');
            var rate = await menu.session.get('rate');
            menu.con('Balance Information' +
                '\nNumber Of Share ' + (balance/rate) +
                '\nAmount GHS ' + balance +
                '\nLoan Balance GHS ' + loan +
                '\n1. Ok' +
                '\n#. Main Menu');
        } else {
            menu.con('Incorrect Pin' +
                '\n*. Try Again' +
                '\n#. Main Menu');
        }
    },
    next: {
        '1': 'checkBalance.confirm',
        '#': 'Menu',
        '*': 'checkBalance'
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
    run: async() => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.session.set('amount', amount);
        var amount = await menu.session.get('balance');
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

// nesting states
menu.state('Withdrawal.confirm', {
    run: async() => {
        // use menu.val to access user input value
        // var amount = Number(menu.val);
        var amount = await menu.session.get('amount');
        // buyAirtime(menu.args.phoneNumber, amount).then((res) => {
        //     menu.end('Airtime bought successfully.');
        // });
        menu.con('Withdrawal request ' +
            '\n Amount GHS ' + amount +
            '\n Enter Pin to Confirm' +
            '\n *. Cancel');

    },
    next: {
        '*': 'Withdrawal.cancel',
        '*\\d+': 'Withdrawal.send'
    }
});

menu.state('Withdrawal.send', {
    run: async() => {
        var epin = Number(menu.val);
        var pin = await menu.session.get('pin');
        if(epin != pin) {
            menu.con('Incorrect Pin' +
                '\n*. Try Again' +
                '\n#. Main Menu');
        } else {
        // submit with request
            var name = await menu.session.get('name');
            var group = await menu.session.get('group');
            var amount = await menu.session.get('amount');
            var account = await menu.session.get('account');
            var accountid = await menu.session.get('accountid');
            var groupid = await menu.session.get('groupid');
            var network = await menu.session.get('network');
            var mobile = menu.args.phoneNumber;
            var data = {account: account,type:'Deposit',groupid:groupid,accountid:accountid,network:network,mobile: mobile,amount: amount,withdrawal:true, reference: group +' - '+ name };
            postPayment(data, (result)=> { console.log(result) });
            menu.end('Withdraw request of Amount GHC ' + amount + ' submited to group master(s) for approval.');
        }
    },
    next: {
        '#': 'Menu',
        '*': 'checkBalance'
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
        var mid = menu.val;
        var gid = await menu.session.get('groupid');
        await fetchMemberAccount({id: mid,gid: gid}, async(data)=> {
            if(data.success) {
                var name = await menu.session.get('name');
                var rate = await menu.session.get('rate');
                menu.con('Name: '+ name +
                    '\nSelect Payment Type:' +
                    '\n1. Savings' +
                    '\n2. Loan');
            } else {
                // `menu.go('Number');
                menu.con('Incorrect Mobile Number'+ 
                    '\n1. Try Again');
            }
        });
    },
    // next object links to next state based on user input
    next: {
        '1': 'SaveOnBehalf.save',
        '2': 'SaveOnBehalf.loan',
    }
});


menu.state('SaveOnBehalf.save', {
    run: async() => {

            var name = await menu.session.get('name');
            var rate = await menu.session.get('rate');
            menu.con('Enter amount to Save' +
                '\n Daily Rate GHC ' + rate);
            
        });
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'SaveOnBehalf.amount',
        // '#': 'Menu',
    }
});

// nesting states
menu.state('SaveOnBehalf.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.session.set('amount', amount);
        var name = await menu.session.get('name');
        menu.con('You want to perform saving of amount GHS ' + amount +
            '\nfor ' + name +
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
        var name = await menu.session.get('name');
        var group = await menu.session.get('group');
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Deposit',groupid:groupid,accountid:accountid,network:network,mobile: mobile,amount: amount,withdrawal:false, reference: group + ' - ' + name};
        postPayment(data, (result)=> { console.log(result) });
        // var amount = await menu.session.get('amount');
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone.');
    }
});

menu.state('SaveOnBehalf.cancel', {
    run: async() => {
        // Cancel Savings request
        var inst = await menu.session.get('institution');
        menu.end('Thank you for using ' +inst+ ' services. \n \n Powered by Alsan');
    }
});


menu.state('SaveOnBehalf.loan', {
    run: async() => {
        // var rate = await menu.session.get('rate');
        menu.con('Enter amount to Pay from Loan');
    },
    next: {
        '#': 'Menu',
        // using regex to match user input to next state
        '*\\d+': 'SaveOnBehalf.loanamount'
    }
});

// nesting states
menu.state('SaveOnBehalf.loanamount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        menu.session.set('amount', amount);
        var name = await menu.session.get('name');
        menu.con('You want to Pay Loan of amount GHS ' + amount +
            '\nfor ' + name +
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
        var name = await menu.session.get('name');
        var group = await menu.session.get('group');
        var amount = await menu.session.get('amount');
        var account = await menu.session.get('account');
        var accountid = await menu.session.get('accountid');
        var groupid = await menu.session.get('groupid');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {account: account,type:'Loan',groupid:groupid,accountid:accountid,network:network,mobile: mobile,amount: amount,withdrawal:false, reference: group + ' - ' + name};
        postPayment(data, (result)=> { console.log(result) });
        // var amount = await menu.session.get('amount');
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone.');
    }
});


menu.state('Others', {
    run: async() => {
        // fetch balance
        var type = await menu.session.get('type');
        if(type == 'Vice') {
            menu.con('1. Profile' +
                '\n2. Change Pin' +
                '\n3. Approval');
        } else {
            menu.con('1. Profile' +
                '\n2. Change Pin');
        }
    },
    next: {
        '1': 'Profile',
        '2': 'Change_Pin'
    }
});

menu.state('Profile', {
    run: async() => {
        // fetch balance
        var type = await menu.session.get('type');
        if(type == 'Vice') {
            menu.con('Other '+
                '\n1. Profile' +
                '\n2. Change Pin' +
                '\n3. Approval');
        }
        
            
    },
    next: {
        '1': 'SaveOnBehalf.confirm',
        '2': 'SaveOnBehalf.cancel'
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


async function fetchMemberAccount(val, callback) {
    // try {
        var api_endpoint = apiurl + 'Ussd/GetAccount?id=' + val.id +'&gid='+val.gid+ '&tenantId=' + tenant;
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
                menu.session.set('groupid', response.result.groupId);
                menu.session.set('pin', response.result.pin);
                menu.session.set('group', response.result.groups);
                // menu.session.set('grouptype', response.result.groupType);
                menu.session.set('balance', response.result.balance);
                menu.session.set('loan', response.result.loan);
                menu.session.set('institution', response.result.tenant);
                // menu.session.set('limit', response.result.limit);
            }
            
            await callback(response);
        });
    // }
    // catch(err) {
    //     console.log(err);
    //     return err;
    // }
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
                menu.session.set('account', response.result.code);
                menu.session.set('rate', response.result.rate);
                menu.session.set('type', response.result.type);
                menu.session.set('accountid', response.result.id);
                menu.session.set('groupid', response.result.groupId);
                menu.session.set('pin', response.result.pin);
                menu.session.set('group', response.result.groups);
                menu.session.set('grouptype', response.result.groupType);
                menu.session.set('balance', response.result.balance);
                menu.session.set('institution', response.result.tenant);
                // menu.session.set('limit', response.result.limit);
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
    .send(JSON.stringify({agent:null,account:val.account,accountId:val.accountid,type:val.type,method:'MOMO',network:val.network,mobile:val.mobile,source:'USSD',groupid:val.groupid,amount:val.amount,reference:value.reference || 'Group Save',tenantId:tenant,withdrawal:val.withdrawal}))
    .end( async(res)=> { 
        // if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
        var response = JSON.parse(resp.raw_body);
        await callback(response);
    });
    return true
}