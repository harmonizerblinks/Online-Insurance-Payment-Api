const Booking = require('../models/booking.model.js');


// POST a Booking
exports.create = (req, res) => {
    // Create a Booking
    const booking = new Booking(req.body);
    booking.userid = req.user.id;

    // Save a Booking in the MongoDB
    booking.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Bookings
exports.findAll = (req, res) => {
    console.log('fine All');
    Booking.find()
        .then(bookings => {
            // console.log(bookings)
            res.send(bookings);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Booking
exports.findOne = (req, res) => {
    Booking.findById(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Booking with id " + req.params.bookingId
            });
        });
};

// UPDATE a Booking
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find booking and update it
    Booking.findByIdAndUpdate(req.params.bookingId, body, { new: true })
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            res.send(booking);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            return res.status(500).send({
                message: "Error updating booking with id " + req.params.bookingId
            });
        });
};

// DELETE a Booking
exports.delete = (req, res) => {
    Booking.findByIdAndRemove(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            res.send({ message: "Booking deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Booking not found with id " + req.params.bookingId
                });
            }
            return res.status(500).send({
                message: "Could not delete booking with id " + req.params.bookingId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}