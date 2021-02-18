const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });
var apiurl = 'https://api.paynowafrica.com/PayNow/';
let sessions = {};
const church = ["Tithe","Offering","Harvest","Donation","Welfare","Others"];

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
    run: () => {
        // use menu.con() to send response without terminating session
        menu.con(' Welcome to Paynow Services' +
            '\n1. Payments' +
            '\n2. Airtime' +
            '\n3. Financial Services' +
            '\n4. Utility & TV' +
            '\n5. Voting' +
            '\n6. Contact');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Payments',
        '2': 'Airtime',
        '3': 'Financial',
        '4': 'Utility',
        '5': 'Voting',
        '6': 'Contact'
    }
});

// Define Start
menu.state('Start', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con(' Welcome to Paynow Services' +
            '\n1. Payments' +
            '\n2. Airtime' +
            '\n3. Financial Services' +
            '\n4. Utility & TV' +
            '\n5. Voting' +
            '\n6. Contact');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Payments',
        '2': 'Airtime',
        '3': 'Financial',
        '4': 'Utility',
        '5': 'Voting',
        '6': 'Contact'
    }
});

menu.state('Payments', {
    run: () => {
        // use menu.con() to send response without terminating session     
        menu.con(' Payments' +
            '\n1. Pay Church' +
            '\n2. Pay Merchant' +
            '\n3. Pay Store' +
            '\n4. Pay Invoice' +
            '\n5. Pay Group / Club' +
            '\n#. Main Menu');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Church',
        '2': 'Merchant',
        '3': 'Store',
        '4': 'Invoice',
        '5': 'Group',
        '#': 'Start'
    }
});

menu.state('Church', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Enter Church Code' + '\n' +
            '\n#. Main');
    },
    // next object links to next state based on user input
    next: {
        '#': 'Start',
        '*\\d+': 'Contact'
    }
});

// nesting states
menu.state('Church.account', {
    run: async() => {
        // use menu.val to access user input value
        var code = menu.val;
        // save user input in session
        await fetchMerchant({code: code, type: 'General'}, (data)=> { 
            // console.log(1,data); 
            // use menu.con() to send response without terminating session 
            if(data) {
                menu.session.set('service', "Pay Church");
                menu.con('Welcome to '+data.name+'.' +'\n '+
                    '\n1. Tithe' +
                    '\n2. Offering',
                    '\n3. Harvest' +
                    '\n4. Donation' +
                    '\n5. Welfare' +
                    '\n6. Others' +
                    '\n#. Main Menu');
            } else {
                // `menu.go('Number');
                menu.con('Incorrect Church Code' + 
                '\n#. Main Menu');
            }
        });

    },
    // next object links to next state based on user input
    next: {
        '#': 'Start',
        '*[0-9]+': 'Church.type'
    }
});

// nesting states
menu.state('Church.Type', {
    run: async() => {
        // use menu.val to access user input value
        var val = Number(menu.val);
        var type = church[val];
        menu.session.set('type', type);
        // var name = await menu.session.get('name');
        menu.con('Enter amount for ' + type +
            '\n' +
            '\n#. Main Menu');

    },
    next: {
        '#': 'Start',
        '*[0-9]+': 'Church.type'
    }
});

menu.state('Pay', {
    run: () => {
        menu.con('Enter amount to Pay');
    },
    next: {
        // using regex to match user input to next state
        '*\\d+': 'Pay.amount'
    }
});

// nesting states
menu.state('Pay.amount', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        // save user input in session
        menu.session.set('amount', amount);
        menu.con('Make sure that you have enough balance to proceed with the transaction of GHS ' + amount +
            '\n1. One Time Payment' +
            '\n2. Auto Debit' +
            '\n3. Cancel');

    },
    next: {
        '1': 'Pay.confirm',
        '2': 'Pay.auto',
        '3': 'Pay.cancel'
    }
});

menu.state('Pay.confirm', {
    run: async() => {
        // access user input value save in session
        var amount = await menu.session.get('amount');
        menu.end('Your transaction was successful. You will receive a prompt of GHS ' + amount + ' shortly.');
    }
});

// nesting states
menu.state('Pay.auto', {
    run: () => {
        // save user input in session
        menu.con('Select Frequency:' +
            '\n1. Daily' +
            '\n2. Weekly' +
            '\n3. Monthly');

    },
    next: {
        '1': 'Pay.confirm',
        '2': 'Pay.confirm',
        '3': 'Pay.confirm'
    }
});

menu.state('Pay.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using Peoples Pension Trust.');
    }
});



menu.state('Contact', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('1. Stop auto-debit' +
            '\n2. Name' +
            '\n3. Email' +
            '\n4. Mobile' +
            '\n5. Website');
    },
    // next object links to next state based on user input
    next: {
        '1': 'AutoDebit',
        '2': 'Contact.name',
        '3': 'Contact.email',
        '4': 'Contact.mobile',
        '5': 'Contact.website'
    }
});

menu.state('Contact.name', {
    run: () => {
        // Cancel Savings request
        menu.end('PayNow Africa Services.');
    }
});

menu.state('Contact.email', {
    run: () => {
        // Cancel Savings request
        menu.end('info@paynowafrica.com.');
    }
});

menu.state('Contact.mobile', {
    run: () => {
        // Cancel Savings request
        menu.end('0302738242');
    }
});

menu.state('Contact.website', {
    run: () => {
        // Cancel Savings request
        menu.end('http://www.paynowafrica.com');
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
    // let args = {
    //     phoneNumber: req.body.phoneNumber,
    //     sessionId: req.body.sessionId,
    //     serviceCode: req.body.serviceCode,
    //     text: req.body.text
    // };
    // await menu.run(args, resMsg => {
    //     res.send(resMsg);
    // });
};


async function fetchMerchant(val, callback) {
    // try {
    var api_endpoint = apiurl + 'Merchant/' + val.type + '/' + val.code;
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
            menu.session.set('mtype', response.type);
            menu.session.set('code', response.code);
            menu.session.set('name', response.name);
            // menu.session.set('type', response.type);
            menu.session.set('merchantid', response.merchantid);
            // menu.session.set('limit', response.result.limit);
        }
        
        await callback(response);
    });
}


async function payMerchant(val, callback) {

    var api_endpoint = apiurl + 'Merchant';
    console.log(api_endpoint);
    var request = unirest('POST', api_endpoint)
    .headers({
        'Content-Type': 'application/json'
    })
    .send(JSON.stringify({ "code": val.code, "type": val.type, "amount": val.amount, "mobile": val.mobile, "network": val.network, "service": val.service, "reference": val.reference }))
    .end(async(resp) => {
        console.log(resp.raw_body);
        var response = JSON.parse(resp.raw_body);
        await callback(response);
    });
}


async function fetchItem(val, callback) {

    var api_endpoint = apiurl + 'Item/' + val.code;
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
            menu.session.set('code', response.code);
            menu.session.set('name', response.name);
            menu.session.set('category', response.category);
            menu.session.set('amount', response.amount);
            menu.session.set('merchant', response.merchant);
            menu.session.set('quantity', response.quantity);
        }
        
        await callback(response);
    });
}

async function payItem(val, callback) {
    
    var api_endpoint = apiurl + 'Merchant';
    console.log(api_endpoint);
    var request = unirest('POST', api_endpoint)
    .headers({
        'Content-Type': 'application/json'
    })
    .send(JSON.stringify({ "code": val.code, "name": val.name, "email": val.email, "amount": val.amount, "mobile": val.mobile, "provider": val.network, "quantity": val.quantity, "source": "Ussd", "reference": val.reference, "userid": "Ussd", "botid": "Ussd", "order_id": "Ussd" }))
    .end(async(resp) => {
        console.log(resp.raw_body);
        var response = JSON.parse(resp.raw_body);
        await callback(response);
    });
}


async function fetchInvoice(val, callback) {
    // try {
        var api_endpoint = apiurl + 'Invoice/' + val.code;
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
                menu.session.set('code', response.code);
                menu.session.set('name', response.name);
                menu.session.set('mobile', response.mobile);
                menu.session.set('amount', response.amount);
                menu.session.set('merchantid', response.merchantid);
                // menu.session.set('quantity', response.quantity);
            }
            
            await callback(response);
        });
}

async function fetchUtility(val, callback) {
    // try {
        var api_endpoint = apiurl + 'Utility/' + val.code;
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
                menu.session.set('code', response.code);
                menu.session.set('name', response.name);
                // menu.session.set('category', response.category);
                menu.session.set('amount', response.amount);
                // menu.session.set('merchant', response.merchant);
                // menu.session.set('quantity', response.quantity);
            }
            
            await callback(response);
        });
}

function fetchBalance(val) {
    return "2.00"
}

function buyAirtime(phone, val) {
    return true
}