const BusFee = require('../models/busfee.model.js');


// POST a BusFee
exports.create = (req, res) => {
    // Create a BusFee
    const busfee = new BusFee(req.body);

    // Save a BusFee in the MongoDB
    busfee.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all BusFees
exports.findAll = (req, res) => {
    console.log('fine All');
    BusFee.find()
        .then(busfee => {
            // console.log(busfee)
            res.send(busfee);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a BusFee
exports.findOne = (req, res) => {
    Voter.findById(req.params.busfeeId)
        .then(busfee => {
            if (!busfee) {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            res.send(busfee);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            return res.status(500).send({
                message: "Error retrieving BusFee with id " + req.params.busfeeId
            });
        });
};

// UPDATE a BusFee
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find busfee and update it
    BusFee.findByIdAndUpdate(req.params.busfeeId, body, { new: true })
        .then(busfee => {
            if (!busfee) {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            res.send(busfee);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            return res.status(500).send({
                message: "Error updating busfee with id " + req.params.busfeeId
            });
        });
};

// DELETE a BusFee
exports.delete = (req, res) => {
    BusFee.findByIdAndRemove(req.params.busfeeId)
        .then(busfee => {
            if (!busfee) {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            res.send({ message: "BusFee deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "BusFee not found with id " + req.params.busfeeId
                });
            }
            return res.status(500).send({
                message: "Could not delete busfee with id " + req.params.busfeeId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}