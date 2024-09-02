const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
app.use(cors())
// Connect to the database
connectDB();

// Connect to the database
require('./middleware/cleanupJob');
// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
