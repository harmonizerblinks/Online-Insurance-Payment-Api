const Bus = require('../models/bus.model.js');


// POST a Bus
exports.create = (req, res) => {
    // Create a Bus
    const bus = new Bus(req.body);

    // Save a Bus in the MongoDB
    bus.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Bus
exports.findAll = (req, res) => {
    console.log('fine All');
    Bus.find()
        .then(bus => {
            // console.log(bus)
            res.send(bus);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Bus
exports.findOne = (req, res) => {
    Bus.findById(req.params.busId)
        .then(bus => {
            if (!bus) {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            res.send(bus);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Bus with id " + req.params.busId
            });
        });
};

// UPDATE a Bus
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find bus and update it
    Bus.findByIdAndUpdate(req.params.busId, body, { new: true })
        .then(bus => {
            if (!bus) {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            res.send(bus);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            return res.status(500).send({
                message: "Error updating bus with id " + req.params.busId
            });
        });
};

// DELETE a Bus
exports.delete = (req, res) => {
    Bus.findByIdAndRemove(req.params.busId)
        .then(bus => {
            if (!bus) {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            res.send({ message: "Bus deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Bus not found with id " + req.params.busId
                });
            }
            return res.status(500).send({
                message: "Could not delete bus with id " + req.params.busId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function generateOTP() {
    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = 10;
    var otp = '';

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];
    }
    return otp.toUpperCase();
}