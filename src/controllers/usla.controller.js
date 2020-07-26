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
            '\n4. Others');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'Others'
    }
});

menu.state('Start', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Welcome. Choose option:' +
            '\n1. Savings' +
            '\n2. Check Balance' +
            '\n3. Withdrawal' +
            '\n4. Others');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Savings',
        '2': 'checkBalance',
        '3': 'Withdrawal',
        '4': 'Others'
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
    run: () => {
        // access user input value save in session
        var amount = menu.session.get('amount');;
        menu.end('Payment request of amount GHS' + amount + ' sent to your phone.');
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
    run: () => {
        // submit with request
        var amount = menu.session.get('amount');
        menu.end('Withdraw request of Amount GHC ' + amount + ' submited to group master(s) for approval.');
    }
});

menu.state('Withdrawal.cancel', {
    run: () => {
        // Cancel Savings request
        menu.end('Thank you for using paynow services.');
    }
});

menu.state('Others', {
    run: () => {
        // use menu.con() to send response without terminating session      
        menu.con('Choose option:' +
            '\n1. Pension' +
            '\n2. Airtime');
    },
    // next object links to next state based on user input
    next: {
        '1': 'Others.penion',
        '2': 'Others.airtime',
    }
});

menu.state('Others.penion', {
    run: () => {
        // fetch balance
        // fetchBalance(menu.args.phoneNumber).then((bal) => {
        // use menu.end() to send response and terminate session
        menu.end('Coming Soon');
        // });
    }
});

menu.state('Others.airtime', {
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