const Tour = require('../models/tour.model.js');


// POST a Tour
exports.create = (req, res) => {
    // Create a Tour
    const tour = new Tour(req.body);

    // Save a Tour in the MongoDB
    tour.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Tours
exports.findAll = (req, res) => {
    console.log('fine All');
    Tour.find()
        .then(tours => {
            // console.log(tours)
            res.send(tours);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Tour
exports.findOne = (req, res) => {
    Tour.findById(req.params.tourId)
        .then(tour => {
            if (!tour) {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            res.send(tour);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Tour with id " + req.params.tourId
            });
        });
};

// UPDATE a Tour
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find tour and update it
    Tour.findByIdAndUpdate(req.params.tourId, body, { new: true })
        .then(tour => {
            if (!tour) {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            res.send(tour);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            return res.status(500).send({
                message: "Error updating tour with id " + req.params.tourId
            });
        });
};

// DELETE a Tour
exports.delete = (req, res) => {
    Tour.findByIdAndRemove(req.params.tourId)
        .then(tour => {
            if (!tour) {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            res.send({ message: "Tour deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Tour not found with id " + req.params.tourId
                });
            }
            return res.status(500).send({
                message: "Could not delete tour with id " + req.params.tourId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}