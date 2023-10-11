const express = require('express');
const router = express.Router();
const Report = require('../models/stockReportSchema');

// Get all reports
// /reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a report by name
router.get('/:name', async (req, res) => {
    try {
        const report = await Report.findOne({ name: req.params.name });
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a report by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndRemove(req.params.id);
        if (deletedReport) {
            res.json({ message: 'Report deleted' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete multiple reports by IDs
// reports/mulitpleDelete
router.delete('/multipleDelete', async (req, res) => {
    const reportIds = req.body.reportIds;
    try {
        const result = await Report.deleteMany({ _id: { $in: reportIds } });
        res.json({ message: `${result.deletedCount} reports deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new report
// /reports/add
router.post('/add', async (req, res) => {
    const report = new Report({
        name: req.body.name,
        reportMessage: req.body.reportMessage
    });

    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
