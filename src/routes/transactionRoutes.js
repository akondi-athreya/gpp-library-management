const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// POST /transactions/borrow - Borrow a book
router.post('/borrow', transactionController.borrow);

// GET /transactions/overdue - Get all overdue transactions
router.get('/overdue', transactionController.getOverdue);

// POST /transactions/:id/return - Return a book
router.post('/:id/return', transactionController.returnBookController);

module.exports = router;
