const mongoose = require('mongoose');

const BranchSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: Boolean, required: true, default: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});


module.exports = mongoose.model('branch', BranchSchema);