const { GoogleGenerativeAI } = require('@google/generative-ai');
const Plan = require('../models/Plan');
require('dotenv').config();

// Ensure an API key is available
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.getSuggestions = async (req, res) => {
    try {
        const { location } = req.body;
        if (!location) {
            return res.status(400).json({ error: "Location is required." });
        }

        const prompt = `Act as an expert business consultant operating in India. A user wants to start a new business in the area: "${location}". 
Analyze the demographics, local economy, and typical needs of "${location}". 
Provide a list of 5 viable, high-potential business ideas suitable specifically for this location.
Return the output ONLY as a JSON array of strings. Do not include markdown formatting or quotes. Example: ["Coffee Shop", "Delivery Service"]`;

        const result = await fallbackModel.generateContent(prompt);
        let text = result.response.text();
        
        // Clean up markdown code blocks if the AI includes them
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const suggestions = JSON.parse(text);
            res.json({ suggestions });
        } catch (parseError) {
            // Fallback if parsing fails
            res.json({ suggestions: ["Local Grocery Delivery", "Boutique Cafe", "Tech Repair Shop", "Tuition Center", "Handicrafts Store"] });
        }
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate suggestions. Please try again." });
    }
};

exports.generatePlan = async (req, res) => {
    try {
        const { location, suggestion, budget } = req.body;
        if (!location || !suggestion || !budget) {
            return res.status(400).json({ error: "Location, suggestion, and budget are required." });
        }

        // Two prompts can be run in parallel: One for the Plan, One for Compliance.
        // Or one combined structured prompt. We'll do one combined structured prompt for efficiency.

        const prompt = `Act as an expert Indian business advisor and legal consultant. 
The user wants to start a "${suggestion}" in "${location}" with a budget of "${budget}". 
Please generate the entire response in simple, easy-to-understand English so it is accessible to everyone. Do not include any Telugu words or translations.

Generate a comprehensive Markdown document with two main sections:
## 1. Business Plan
Break down the budget ("${budget}") indicating exactly how the money should be allocated (Rent, Marketing, Equipment, Licenses, etc.). Give operational advice specifically tailored for a "${suggestion}" in "${location}".

## 2. State Rules and Compliance
List all state-specific licenses (e.g., Shop and Establishment Act, FSSAI, GST, Fire Safety, Trade License) required in "${location}" for a "${suggestion}". Add any local regulations they must obey.

IMPORTANT: Use headings, bullet points, and tables to make it look premium and easy to read.`;

        const result = await fallbackModel.generateContent(prompt);
        const planText = result.response.text();
        
        res.json({ plan: planText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate the business plan." });
    }
};

exports.savePlan = async (req, res) => {
    try {
        const { location, selectedSuggestion, budget, generatedPlan } = req.body;
        
        const newPlan = new Plan({
            location,
            selectedSuggestion,
            budget,
            generatedPlan
        });

        await newPlan.save();
        res.json({ message: "Plan saved successfully!", id: newPlan._id });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ error: "Failed to save the plan." });
    }
};
