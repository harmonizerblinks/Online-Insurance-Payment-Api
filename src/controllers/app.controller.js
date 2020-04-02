const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
const Package = require('../models/package.model.js');
const Insurance = require('../models/insurance.model.js');
var unirest = require('unirest');


// FETCH all Schedules
exports.findAllPackages = (req, res) => {
    console.log('fine All');
    Package.find()
        .then(packages => {
            // console.log(packages)
            res.send(packages);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Schedules
exports.createInsurance = async(req, res) => {
    // Create a Insurance
    const insurance = new Insurance(req.body);
    insurance.code = null;
    insurance.code = await generateOTP(6);

    // Save a Insurance in the MongoDB
    insurance.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Insurance
exports.findOneInsurance = (req, res) => {
    Insurance.findById(req.params.insuranceId)
        .then(insurance => {
            if (!insurance) {
                return res.status(404).send({
                    message: "Insurance not found with id " + req.params.insuranceId
                });
            }
            res.send(insurance);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Insurance not found with id " + req.params.insuranceId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Insurance with id " + req.params.insuranceId
            });
        });
};

// Post Payment
exports.Makepayment = (req, res) => {
    var req = unirest('POST', 'http://api.alias-solutions.net:8443/chatbotapi/paynow/merchant/payment')
        .headers({
            'Content-Type': ['application/json', 'application/json']
        })
        .send(JSON.stringify(req.body.payment))
        .end(function(res) {
            if (res.error) throw new Error(res.error);
            console.log(res.raw_body);
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function generateOTP(length) {
    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = length;
    var otp = '';

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];
    }
    return otp.toUpperCase();
}