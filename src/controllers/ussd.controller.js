const Ussd = require('../models/insurance.model.js');
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
        menu.con('Welcome. Choose option:' +
            '\n1. Savings' +
            '\n2. Check Balance' +
            '\n3. Withdrawal' +
            '\n4. Save On Behalf' +
            '\n5. Others');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'SaveOnBehalf',
        '5': 'buyAirtime'
    }
});

menu.state('Savings', {
    run: () => {
        menu.con('Enter amount:');
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
        session.set('amount', name);
        // buyAirtime(menu.args.phoneNumber, amount).then((res) => {
        //     menu.end('Airtime bought successfully.');
        // });

    },
    next: {
        '1': 'Savings.confirm',
        '2': 'Savings.cancel'
    }
});

menu.state('Savings.confirm', {
    run: () => {
        // use menu.val to access user input value
        var amount = Number(menu.val);
        // buyAirtime(menu.args.phoneNumber, amount).then((res) => {
        menu.end('Payment request sent to your phone.');
        // });
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
        fetchBalance(menu.args.phoneNumber).then((bal) => {
            // use menu.end() to send response and terminate session
            menu.end('Your balance is GHS ' + bal);
        });
    }
});


// POST a Insurance
exports.ussd = async(req, res) => {
    // Create a 
    menu.run(req.body, ussdResult => {
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