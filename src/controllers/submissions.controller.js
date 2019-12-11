const Submission = require('../models/submissions.model.js');
const Video = require('../models/videos.model.js');


// POST a Submission
exports.create = (req, res) => {
    // Create a Submission
    const submission = new Submission(req.body);

    // Save a Submission in the MongoDB
    submission.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Submissions
exports.findAll = (req, res) => {
    console.log('fine All');
    Submission.find()
        .then(submissions => {
            // console.log(submissions)
            res.send(submissions);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Submission
exports.findOne = (req, res) => {
    Voter.findById(req.params.submissionId)
        .then(slider => {
            if (!slider) {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Submission with id " + req.params.submissionId
            });
        });
};

// UPDATE a Submission
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find submission and update it
    Submission.findByIdAndUpdate(req.params.submissionId, body, { new: true })
        .then(submission => {
            if (!submission) {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            res.send(submission);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            return res.status(500).send({
                message: "Error updating submission with id " + req.params.submissionId
            });
        });
};

// DELETE a Submission
exports.delete = (req, res) => {
    Submission.findByIdAndRemove(req.params.submissionId)
        .then(submission => {
            if (!submission) {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            res.send({ message: "Submission deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Submission not found with id " + req.params.submissionId
                });
            }
            return res.status(500).send({
                message: "Could not delete submission with id " + req.params.submissionId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}