const Saving = require('../models/saving.model.js');


// POST a Saving
exports.create = (req, res) => {
    // Create a Saving
    const saving = new Saving(req.body);

    // Save a Saving in the MongoDB
    saving.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Savings
exports.findAll = (req, res) => {
    console.log('fine All');
    Saving.find()
        .then(savings => {
            // console.log(savings)
            res.send(savings);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Saving
exports.findOne = (req, res) => {
    Saving.findById(req.params.savingId)
        .then(saving => {
            if (!saving) {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Saving with id " + req.params.savingId
            });
        });
};

// UPDATE a Saving
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find saving and update it
    Saving.findByIdAndUpdate(req.params.savingId, body, { new: true })
        .then(saving => {
            if (!saving) {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            res.send(saving);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            return res.status(500).send({
                message: "Error updating saving with id " + req.params.savingId
            });
        });
};

// DELETE a Saving
exports.delete = (req, res) => {
    Saving.findByIdAndRemove(req.params.savingId)
        .then(saving => {
            if (!saving) {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            res.send({ message: "Saving deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Saving not found with id " + req.params.savingId
                });
            }
            return res.status(500).send({
                message: "Could not delete saving with id " + req.params.savingId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}