const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
const Schedule = require('../models/schedule.model.js');
const Booking = require('../models/booking.model.js');


// FETCH all Schedules
exports.findAllSchedules = (req, res) => {
    let query = [{
        $lookup: {
            from: 'stations',
            localField: 'start_point',
            foreignField: '_id',
            as: 'start'
        },
    }, {
        $lookup: {
            from: 'stations',
            localField: 'end_point',
            foreignField: '_id',
            as: 'end'
        },
    }, {
        $lookup: {
            from: 'stations',
            localField: 'stations',
            foreignField: '_id',
            as: 'pickups'
        },

    }, {
        $lookup: {
            from: 'buses',
            localField: 'busid',
            foreignField: '_id',
            as: 'bus'
        },

    }, { $match: { status: 'Upcoming', available: true, seats: { $gte: 1 } } }];
    console.log('fine All');
    Schedule.aggregate(query)
        .then(schedules => {
            // console.log(schedules)
            res.send(schedules);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Schedule
exports.findOne = (req, res) => {
    let query = [{
        $lookup: {
            from: 'stations',
            localField: 'start_point',
            foreignField: '_id',
            as: 'start'
        },
    }, {
        $lookup: {
            from: 'stations',
            localField: 'end_point',
            foreignField: '_id',
            as: 'end'
        },
    }, {
        $lookup: {
            from: 'stations',
            localField: 'stations',
            foreignField: '_id',
            as: 'pickups'
        },

    }, {
        $lookup: {
            from: 'buses',
            localField: 'busid',
            foreignField: '_id',
            as: 'bus'
        },

    }, { $match: { status: 'Upcoming', _id: ObjectId(req.params.scheduleId), available: true, seats: { $gte: 1 } } }];

    Schedule.aggregate(query)
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            res.send(schedule[0]);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Schedule with id " + req.params.scheduleId
            });
        });
};

exports.Booking = async(req, res) => {
    // Create a Booking
    const booking = new Booking(req.body);
    booking.code = null;
    booking.code = await generateOTP(6);
    Schedule.findById(req.body.scheduleid)
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found "
                });
            }
            if (booking.seat > schedule.seats) {
                return res.status(404).send({
                    message: "Number of Seats Available is less than " + booking.seat
                });
            }
            schedule.seats = schedule.seats - booking.seat;
            // Save a Booking in the MongoDB
            booking.save()
                .then(data => {
                    Schedule.findByIdAndUpdate(schedule._id, schedule, { new: true })
                        .then(sche => {
                            if (!sche) {
                                return res.status(404).send({
                                    message: "Schedule not found with id"
                                });
                            }
                            res.send({ code: data.code, output: "Successfull", message: "Your Seat Has Been Reserved", sche });
                        }).catch(err => {
                            return res.status(500).send({
                                message: "Error updating schedule with id " + booking.scheduleId
                            });
                        });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
        }).catch(err => {
            return res.status(500).send({
                message: "Error retrieving Schedule with id " + req.params.scheduleId
            });
        });
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function generateOTP(length) {
    var digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var otpLength = length;
    var otp = '';

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));

        otp = otp + digits[index];
    }
    return otp.toUpperCase();
}