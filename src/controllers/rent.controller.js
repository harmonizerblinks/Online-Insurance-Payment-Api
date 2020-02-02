const Rent = require('../models/rent.model.js');


// POST a Rent
exports.create = (req, res) => {
    // Create a Rent
    const rent = new Rent(req.body);

    // Save a Rent in the MongoDB
    rent.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Rents
exports.findAll = (req, res) => {
    console.log('fine All');
    Rent.find()
        .then(rents => {
            // console.log(rents)
            res.send(rents);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Rent
exports.findOne = (req, res) => {
    Rent.findById(req.params.rentId)
        .then(rent => {
            if (!rent) {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            res.send(rent);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Rent with id " + req.params.rentId
            });
        });
};

// UPDATE a Rent
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find rent and update it
    Rent.findByIdAndUpdate(req.params.rentId, body, { new: true })
        .then(rent => {
            if (!rent) {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            res.send(rent);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            return res.status(500).send({
                message: "Error updating rent with id " + req.params.rentId
            });
        });
};

// DELETE a Rent
exports.delete = (req, res) => {
    Rent.findByIdAndRemove(req.params.rentId)
        .then(rent => {
            if (!rent) {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            res.send({ message: "Rent deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Rent not found with id " + req.params.rentId
                });
            }
            return res.status(500).send({
                message: "Could not delete rent with id " + req.params.rentId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}