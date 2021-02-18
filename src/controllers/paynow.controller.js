const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });
var unirest = require('unirest');
var apiurl = "https://api.paynowafrica.com/PayNow/";
let sessions = {};
let church = ["Tithe","Offering","Harvest","Donation","Welfare","Others"];
let group = ["Tithe","Offering","Harvest","Donation","Welfare","Others"];

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
    menu.end("Error response "+ err);
});

// Define menu states
menu.startState({
    run: () => {
        // use menu.con() to send response without terminating session
        menu.con('Welcome to PayNow Services' +
            '\n1. Payments' +
            '\n2. Airtime' +
            '\n3. Financial' +
            '\n4. Utility' +
            '\n5. Voting');
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
        menu.con('Welcome to PayNow Services' +
            '\n1) Payments' +
            '\n2) Airtime' +
            '\n3) Financial Services' +
            '\n4) Utility & TV' +
            '\n5) Voting');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Payments',
        '2': 'Airtime',
        '3': 'Financial',
        '4': 'Utility',
        '5': 'Voting'
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
            '\n \n#. Main Menu');
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
            '\n \n#. Main');
    },
    // next object links to next state based on user input
    next: {
        '#': 'Start',
        '*\\d+': 'Church.type'
    }
});

// nesting states
menu.state('Church.type', {
    run: async() => {
        // use menu.val to access user input value
        var code = menu.val;
        // save user input in session
        await fetchMerchant({code: code, type: 'General'}, (data)=> { 
            // console.log(1,data); 
            // use menu.con() to send response without terminating session 
            if(data.code) {
                // menu.session.set('service', 'Pay Church');
                menu.con('Welcome to '+data.name +
                    '\n1.Tithe' +
                    '\n2.Offering' +
                    '\n3.Harvest' +
                    '\n4.Donation' +
                    '\n5.Welfare' +
                    '\n6.Others');
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
        '*[0-9]+': 'Church.amount'
    }
});

// nesting states
menu.state('Church.amount', {
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
        '*[0-9]+': 'Church.reference'
    }
});

// nesting states
menu.state('Church.reference', {
    run: async() => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        // save user input in session
        menu.session.set('amount', amount);
        menu.con('Enter Ref / Name' +
            '\n' +
            '\n#. Main Menu, 0. Go back');

    },
    next: {
        '#': 'Start',
        '0': 'Church.amount',
        '*[a-zA-Z]+': 'Church.confirm'
    }
});

// nesting states
menu.state('Church.confirm', {
    run: async() => {
        // use menu.val to access user input value
        var reference = menu.val;
        // save user input in session
        menu.session.set('reference', reference);
        var type = await menu.session.get('type');
        var amount = await menu.session.get('amount');
        menu.con('You want to pay ' +type + ' of amount GHC ' + amount +
            '\n Reference: '+ reference +
            '\n1. Confirm' +
            '\n2. Go back' +
            '\n \n#. Main Menu');

    },
    next: {
        '1': 'Church.send',
        '2': 'Church.cancel'
    }
});

menu.state('Church.send', {
    run: async() => {
        // access user input value save in session
        var code = await menu.session.get('code');
        var type = await menu.session.get('type');
        var amount = await menu.session.get('amount');
        // var service = await menu.session.get('service');
        var reference = await menu.session.get('reference');
        var network = await menu.session.get('network');
        var mobile = menu.args.phoneNumber;
        var data = {code: code, type: type,service: "Pay Church", network:network,mobile: mobile,amount: amount, reference: reference};
        await payMerchant(data, async(result)=> { 
            console.log(result);
            // menu.end(JSON.stringify(result)); 
        });
        menu.end('Payment request of amount GHC ' + amount + ' sent to your phone. kindly confirm payment');
    }
});

menu.state('Church.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});


menu.state('Contact', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('1. Name' +
            '\n2. Email' +
            '\n3. Mobile' +
            '\n4. Website');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Contact.name',
        '2': 'Contact.email',
        '3': 'Contact.mobile',
        '4': 'Contact.website'
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


// POST Paynow
exports.ussd = async(req, res) => {
    // Create a 
    let args = req.body;
    if (args.Type == 'initiation') {
        args.Type = req.body.Type.replace(/\b[a-z]/g, (x) => x.toUpperCase());
    }
    menu.run(args, ussdResult => {
        menu.session.set('network', args.Operator || 'MTN');  
        res.send(ussdResult);
    });
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
        if(response.code)
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
    console.info(val);
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
        if(response.code)
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
            if(response.code)
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
            if(response.code)
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