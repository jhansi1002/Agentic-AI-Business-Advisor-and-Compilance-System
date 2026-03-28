const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ai-business-advisor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully connected to MongoDB locally.'))
  .catch(err => console.log('MongoDB connection error (App will still run but wont save history):', err));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
