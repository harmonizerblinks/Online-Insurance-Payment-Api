const Driver = require('../models/driver.model.js');


// POST a Driver
exports.create = (req, res) => {
    // Create a Driver
    const driver = new Driver(req.body);

    // Save a Driver in the MongoDB
    driver.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Drivers
exports.findAll = (req, res) => {
    console.log('fine All');
    Driver.find()
        .then(drivers => {
            // console.log(drivers)
            res.send(drivers);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Driver
exports.findOne = (req, res) => {
    Driver.findById(req.params.driverId)
        .then(driver => {
            if (!driver) {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            res.send(driver);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Driver with id " + req.params.driverId
            });
        });
};

// UPDATE a Driver
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find driver and update it
    Driver.findByIdAndUpdate(req.params.driverId, body, { new: true })
        .then(driver => {
            if (!driver) {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            res.send(driver);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            return res.status(500).send({
                message: "Error updating driver with id " + req.params.driverId
            });
        });
};

// DELETE a Driver
exports.delete = (req, res) => {
    Driver.findByIdAndRemove(req.params.driverId)
        .then(driver => {
            if (!driver) {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            res.send({ message: "Driver deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Driver not found with id " + req.params.driverId
                });
            }
            return res.status(500).send({
                message: "Could not delete driver with id " + req.params.driverId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}