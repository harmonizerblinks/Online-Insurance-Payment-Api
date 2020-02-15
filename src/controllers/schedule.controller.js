const Schedule = require('../models/schedule.model.js');


// POST a Schedule
exports.create = (req, res) => {
    // Create a Schedule
    const schedule = new Schedule(req.body);

    // Save a Schedule in the MongoDB
    schedule.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Schedules
exports.findAll = (req, res) => {
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
    }, { $sort: { created: 1 } }];
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
    }, { $match: { _id: req.params.scheduleId } }];

    Schedule.aggregate(query)
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            res.send(schedule);
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

// UPDATE a Schedule
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find schedule and update it
    Schedule.findByIdAndUpdate(req.params.scheduleId, body, { new: true })
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            res.send(schedule);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            return res.status(500).send({
                message: "Error updating schedule with id " + req.params.scheduleId
            });
        });
};

// DELETE a Schedule
exports.delete = (req, res) => {
    Schedule.findByIdAndRemove(req.params.scheduleId)
        .then(schedule => {
            if (!schedule) {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            res.send({ message: "Schedule deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Schedule not found with id " + req.params.scheduleId
                });
            }
            return res.status(500).send({
                message: "Could not delete schedule with id " + req.params.scheduleId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}