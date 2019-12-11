const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
    voter: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('vote', VoteSchema);