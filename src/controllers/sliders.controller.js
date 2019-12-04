const Slider = require('../models/sliders.model.js');


// POST a Slider
exports.create = (req, res) => {
    // Create a Slider
    const sliders = new Slider(req.body);

    // Save a Slider in the MongoDB
    slider.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Sliders
exports.findAll = (req, res) => {
    console.log('fine All');
    Slider.find()
        .then(sliders => {
            // console.log(sliders)
            res.send(sliders);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Slider
exports.findOne = (req, res) => {
    Slider.findById(req.params.sliderId)
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Slider with id " + req.params.sliderId
            });
        });
};

// UPDATE a Slider
exports.update = (req, res) => {
    var body
        // Find slider and update it
    Slider.findByIdAndUpdate(req.params.sliderId, {
            name: req.body.name,
            imageurl: req.body.imageurl,
            description: req.body.description,
            updated: Date.now
        }, { new: true })
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Error updating slider with id " + req.params.sliderId
            });
        });
};

// DELETE a Slider
exports.delete = (req, res) => {
    Slider.findByIdAndRemove(req.params.sliderId)
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            res.send({ message: "Slider deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Slider not found with id " + req.params.sliderId
                });
            }
            return res.status(500).send({
                message: "Could not delete slider with id " + req.params.sliderId
            });
        });
};