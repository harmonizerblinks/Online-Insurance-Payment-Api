const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu({ provider: 'hubtel' });
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
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con(' Welcome to Paynow Services' +
            '\n1. Pay Church' +
            '\n2. Pay Merchant' +
            '\n3. Pay Store' +
            '\n4. Pay Invoice' +
            '\n5. Pay Group / Club'+
            '\n6. Airtime');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Pay',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'ICare',
        '5': 'Contact'
    }
});

menu.state('Start', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con(' Welcome to Peoples Pension Trust' +
            '\n1. Pay' +
            '\n2. Check Balance' +
            '\n3. Withdrawal/Claims' +
            '\n4. ICare' +
            '\n5. Contact');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Pay',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'ICare',
        '5': 'Contact'
    }
});

menu.state('Start', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con(' Welcome to Peoples Pension Trust' +
            '\n1. Pay' +
            '\n2. Check Balance' +
            '\n3. Withdrawal/Claims' +
            '\n4. ICare' +
            '\n5. Contact');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Pay',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'ICare',
        '5': 'Contact'
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

function fetchBalance(val) {
    return "2.00"
}

function buyAirtime(phone, val) {
    return true
}