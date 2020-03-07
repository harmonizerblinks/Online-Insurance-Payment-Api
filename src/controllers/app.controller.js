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

    }, { $sort: { date: 1 } }, { $match: { status: 'Upcoming', available: true, seats: { $gte: 1 } } }];
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

// FETCH all Schedules
exports.findDriverSchedules = (req, res) => {
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
                from: 'bookings',
                localField: '_id',
                foreignField: 'scheduleid',
                as: 'bookings'
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

        }, { $sort: { date: 1 } },
        { $match: { driverid: req.params.driverId, status: { $ne: 'Completed', $in: ['Upcoming', 'Booked', 'Started'] } } }
    ];
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

exports.ScheduleCompleted = async(req, res) => {
    Schedule.findById(req.params.scheduleId)
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found "
                });
            }
            schedule.status = "Completed"
            schedule.completed = true
                // Save a Booking in the MongoDB
            Schedule.findByIdAndUpdate(schedule._id, schedule, { new: true })
                .then(sche => {
                    if (!sche) {
                        return res.status(404).send({
                            message: "Schedule not found with id"
                        });
                    }

                    res.send({ code: schedule.code, output: "Ride Completed", message: "Your Wallet Will Be Credited Shortly", });
                }).catch(err => {
                    return res.status(500).send({
                        message: "Error updating schedule with id " + schedule._id
                    });
                });

        }).catch(err => {
            return res.status(500).send({
                message: "Error retrieving Schedule with id " + req.params.scheduleId
            });
        });
}

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

    }, { $match: { _id: ObjectId(req.params.scheduleId) } }];

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
    if (booking.code == null) { booking.code = await generateOTP(6); }
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
            schedule.total = schedule.total + booking.amount;
            if (schedule.seats == 0 || schedule.seats < 0) { schedule.status = "Booked", schedule.available = false };
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

exports.BookingCancel = async(req, res) => {
    // Create a Booking
    Booking.findById(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Schedule not found "
                });
            }
            if (booking.date < new Date() || booking.status == true) {
                return res.status(404).send({
                    message: "Booking can't be cancel"
                });
            }
            booking.cancel = true;
            // Save a Booking in the MongoDB
            Schedule.findById(booking.scheduleid)
                .then(schedule => {
                    if (!schedule) {
                        return res.status(404).send({
                            message: "Schedule not found with id"
                        });
                    }
                    schedule.seats = schedule.seats + booking.seat;
                    schedule.total = schedule.total - booking.amount;
                    schedule.status = "Upcoming", schedule.available = true
                    Schedule.findByIdAndUpdate(schedule._id, schedule, { new: true })
                        .then(sche => {
                            if (!sche) {
                                return res.status(404).send({
                                    message: "Schedule not found with id"
                                });
                            }
                            Booking.findByIdAndUpdate(booking._id, booking, { new: true });

                            res.send({ code: booking.code, output: "Booking Cancel", message: "Your Booking has been Canceled successfully", sche });
                        }).catch(err => {
                            return res.status(500).send({
                                message: "Error updating schedule with id " + booking.scheduleId
                            });
                        });

                }).catch(err => {
                    return res.status(500).send({
                        message: "Error updating schedule with id " + booking.scheduleId
                    });
                });

        }).catch(err => {
            return res.status(500).send({
                message: "Error retrieving Schedule with id " + req.params.scheduleId
            });
        });
}

exports.BookingConfirm = async(req, res) => {
    Booking.findById(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: "Schedule not found "
                });
            }
            if (booking.cancel == true) {
                return res.status(404).send({
                    message: "Booking Has Already been canceled by Passenger and payment has been refunded"
                });
            }
            booking.status = true;
            // Save a Booking in the MongoDB
            Booking.findByIdAndUpdate(booking._id, booking, { new: true })
                .then(sche => {
                    if (!sche) {
                        return res.status(404).send({
                            message: "Schedule not found with id"
                        });
                    }

                    res.send({ code: booking.code, output: "Passenger Confirmed", message: "Passenger Booking Confirmed", sche });
                }).catch(err => {
                    return res.status(500).send({
                        message: "Error updating schedule with id " + booking.scheduleId
                    });
                });

        }).catch(err => {
            return res.status(500).send({
                message: "Error retrieving Schedule with id " + req.params.scheduleId
            });
        });
}

// FIND user Booking
exports.findUserBookingById = (req, res) => {
    let query = [{
        $lookup: {
            from: 'schedules',
            localField: 'scheduleid',
            foreignField: '_id',
            as: 'schedule'
        },
    }, {
        $lookup: {
            from: 'stations',
            localField: 'pickup',
            foreignField: '_id',
            as: 'pickups'
        },
    }, { $sort: { created: -1 } }, { $match: { wallet: req.params.userId } }];
    console.log(req.params.userId);
    Booking.aggregate(query)
        .then(bookings => {
            res.send(bookings);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Booking history not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Booking History with id " + req.params.userId
            });
        });
};

// FIND user Booking
exports.findScheduleBookingsById = (req, res) => {
    let query = [{
        $lookup: {
            from: 'stations',
            localField: 'pickup',
            foreignField: '_id',
            as: 'pickups'
        },
    }, { $sort: { created: -1 } }, { $match: { scheduleid: ObjectId(req.params.scheduleId), cancel: { $ne: true } } }];
    // console.log(req.params.scheduleId);
    Booking.aggregate(query)
        .then(bookings => {
            res.send(bookings);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Booking history not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Booking History with id " + req.params.userId
            });
        });
};


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