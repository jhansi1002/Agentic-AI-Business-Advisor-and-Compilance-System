const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route to get business suggestions based on location
router.post('/suggest-businesses', aiController.getSuggestions);

// Route to generate a comprehensive business plan based on location, selection, and budget
router.post('/generate-plan', aiController.generatePlan);

// Route to save the final plan to DB
router.post('/save-plan', aiController.savePlan);

module.exports = router;
