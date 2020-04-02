const Insurance = require('../models/insurance.model.js');


// POST a Insurance
exports.create = (req, res) => {
    // Create a Insurance
    const insurance = new Insurance(req.body);

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


// FETCH all Insurances
exports.findAll = (req, res) => {
    console.log('fine All');
    Insurance.find()
        .then(insurance => {
            // console.log(insurance)
            res.send(insurance);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Insurance
exports.findOne = (req, res) => {
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

// UPDATE a Insurance
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find insurance and update it
    Insurance.findByIdAndUpdate(req.params.insuranceId, body, { new: true })
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
                message: "Error updating insurance with id " + req.params.insuranceId
            });
        });
};

// DELETE a Insurance
exports.delete = (req, res) => {
    Insurance.findByIdAndRemove(req.params.insuranceId)
        .then(insurance => {
            if (!insurance) {
                return res.status(404).send({
                    message: "Insurance not found with id " + req.params.insuranceId
                });
            }
            res.send({ message: "Insurance deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Insurance not found with id " + req.params.insuranceId
                });
            }
            return res.status(500).send({
                message: "Could not delete insurance with id " + req.params.insuranceId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}