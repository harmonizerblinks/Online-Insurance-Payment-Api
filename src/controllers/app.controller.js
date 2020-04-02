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
            var body = req.body;
            // console.log(body)
            body.response = JSON.parse(res.raw_body);
            body.updated = new Date();
            // Find insurance and update it
            Insurance.findByIdAndUpdate(body._id, body, { new: true })
                .then(insurance => {
                    if (!insurance) {
                        return res.status(404).send({
                            message: "Insurance not found with id " + req.params.insuranceId
                        });
                    }
                    var callback = setTimeout(getCallBack(insurance, body.response.transaction_no), 100000);
                    res.send(insurance);
                }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Insurance not found with id " + req.params.insuranceId
                        });
                    }
                    return res.status(500).send({
                        message: "Error updating insurance with id " + req.params.insuranceId
                    });
                });
        });
};

function getCallBack(body, code) {
    var req = unirest('GET', 'http://api.alias-solutions.net:8443/chatbotapi/paynow/confirm/' + code)
        .end(function(res) {
            if (res.error) throw new Error(res.error);
            console.log(res.raw_body);
            body.callback = JSON.parse(res.raw_body);
            body.updated = new Date();
            if (body.callback.result.status_code === 0 || body.callback.result.status_code === 2) {
                var callback = setTimeout(getCallBack(body, body.response.transaction_no), 100000);
            } else {
                body.status = body.callback.result.status_message;
                Insurance.findByIdAndUpdate(body._id, body, { new: true })
                    .then(insurance => {
                        if (!insurance) {
                            return {
                                message: "Insurance not found with id " + body._id
                            };
                        }

                        return insurance;
                    }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return {
                                message: "Insurance not found with id " + body._id
                            };
                        }
                        return {
                            message: "Error updating insurance with id " + req.params.insuranceId
                        };
                    });
            }

        });
}


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