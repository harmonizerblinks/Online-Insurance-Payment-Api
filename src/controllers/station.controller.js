const Station = require('../models/station.model.js');


// POST a Station
exports.create = (req, res) => {
    // Create a Station
    const station = new Station(req.body);

    // Save a Station in the MongoDB
    station.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Stations
exports.findAll = (req, res) => {
    console.log('fine All');
    Station.find()
        .then(stations => {
            // console.log(stations)
            res.send(stations);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Station
exports.findOne = (req, res) => {
    Station.findById(req.params.stationId)
        .then(station => {
            if (!station) {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Station with id " + req.params.stationId
            });
        });
};

// UPDATE a Station
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find station and update it
    Station.findByIdAndUpdate(req.params.stationId, body, { new: true })
        .then(station => {
            if (!station) {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            res.send(station);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            return res.status(500).send({
                message: "Error updating station with id " + req.params.stationId
            });
        });
};

// DELETE a Station
exports.delete = (req, res) => {
    Station.findByIdAndRemove(req.params.stationId)
        .then(station => {
            if (!station) {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            res.send({ message: "Station deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Station not found with id " + req.params.stationId
                });
            }
            return res.status(500).send({
                message: "Could not delete station with id " + req.params.stationId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}