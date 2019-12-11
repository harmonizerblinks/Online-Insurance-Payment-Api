const Voter = require('../models/voters.model.js');


// POST a Voter
exports.create = (req, res) => {
    // Create a Voter
    const sliders = new Voter(req.body);

    // Save a Voter in the MongoDB
    slider.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Voters
exports.findAll = (req, res) => {
    console.log('fine All');
    Voter.find()
        .then(sliders => {
            // console.log(sliders)
            res.send(sliders);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Voter
exports.findOne = (req, res) => {
    Voter.findById(req.params.sliderId)
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Voter with id " + req.params.sliderId
            });
        });
};

// UPDATE a Voter
exports.update = (req, res) => {
    var slider = req.body;
    slider.updated = Date.now;
    // Find slider and update it
    Voter.findByIdAndUpdate(req.params.sliderId, slider, { new: true })
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Error updating slider with id " + req.params.sliderId
            });
        });
};

// DELETE a Voter
exports.delete = (req, res) => {
    Voter.findByIdAndRemove(req.params.sliderId)
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            res.send({ message: "Voter deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Voter not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Could not delete slider with id " + req.params.sliderId
            });
        });
};