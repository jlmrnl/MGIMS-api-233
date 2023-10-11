const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockReportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reportMessage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', stockReportSchema);

module.exports = Report;