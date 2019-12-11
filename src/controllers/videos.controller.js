const Video = require('../models/videos.model.js');


// POST a Video
exports.create = (req, res) => {

    // Create a Video
    const video = new Video(req.body);

    // Save a Video in the MongoDB
    video.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Videos
exports.findAll = (req, res) => {
    console.log('fine All');
    Video.find()
        .then(videos => {
            // console.log(videos)
            res.send(videos);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a Video
exports.findOne = (req, res) => {
    Video.findById(req.params.videoId)
        .then(video => {
            if (!video) {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            res.send(video);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Video with id " + req.params.videoId
            });
        });
};

// UPDATE a Video
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find video and update it
    Video.findByIdAndUpdate(req.params.videoId, body, { new: true })
        .then(video => {
            if (!video) {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            res.send(video);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            return res.status(500).send({
                message: "Error updating video with id " + req.params.videoId
            });
        });
};

// DELETE a Video
exports.delete = (req, res) => {
    Video.findByIdAndRemove(req.params.videoId)
        .then(video => {
            if (!video) {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            res.send({ message: "Video deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Video not found with id " + req.params.videoId
                });
            }
            return res.status(500).send({
                message: "Could not delete video with id " + req.params.videoId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}