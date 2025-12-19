const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const fineRoutes = require('./routes/fineRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { checkDatabaseConnection } = require('./controllers/healthController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/transactions', transactionRoutes);
app.use('/fines', fineRoutes);

// Root endpoint - Welcome page
app.get('/', (req, res) => {
    res.send(`<center><h1>Welcome to the Library Management API System</h1></center>`);
});

// Database health check endpoint
app.get('/db-health', checkDatabaseConnection);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Library Management API is running' });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
