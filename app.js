// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/formValidation')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// Endpoint for submitting the form
app.post('/submit-form', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Create a new user object
        const newUser = new User({ username, email, password });
        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // If validation error occurs
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ errors });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
