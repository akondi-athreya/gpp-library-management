const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// POST /books - Create a new book
router.post('/', bookController.createBook);

// GET /books/available - Get available books (must come before /:id)
router.get('/available', bookController.getAvailableBooks);

// GET /books - Get all books
router.get('/', bookController.getAllBooks);

// GET /books/:id - Get book by ID
router.get('/:id', bookController.getBookById);

// PUT /books/:id - Update book
router.put('/:id', bookController.updateBook);

// DELETE /books/:id - Delete book
router.delete('/:id', bookController.deleteBook);

module.exports = router;
