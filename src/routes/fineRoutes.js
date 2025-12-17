const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');

// GET /fines - Get all fines
router.get('/', fineController.getAllFines);

// GET /fines/:id - Get fine by ID
router.get('/:id', fineController.getFineById);

// POST /fines/:id/pay - Mark fine as paid
router.post('/:id/pay', fineController.payFine);

module.exports = router;
