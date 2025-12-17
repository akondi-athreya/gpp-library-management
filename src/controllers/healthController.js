const prisma = require('../prisma/client');

// Check database connection
async function checkDatabaseConnection(req, res, next) {
    try {
        // Try to execute a simple query
        await prisma.$queryRaw`SELECT 1`;
        
        res.json({
            status: 'connected',
            message: 'Database connection is healthy',
            database: 'PostgreSQL',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'disconnected',
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = {
    checkDatabaseConnection
};
