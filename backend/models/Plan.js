const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  location: { type: String, required: true },
  selectedSuggestion: { type: String },
  budget: { type: String },
  generatedPlan: { type: String },
  complianceRules: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plan', planSchema);
