const bookService = require('../services/bookService');

// POST /books - Create a new book
async function createBook(req, res, next) {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
}

// GET /books - Get all books
async function getAllBooks(req, res, next) {
    try {
        const filters = {
            status: req.query.status,
            category: req.query.category,
            author: req.query.author,
            title: req.query.title
        };
        const books = await bookService.getAllBooks(filters);
        res.json(books);
    } catch (error) {
        next(error);
    }
}

// GET /books/available - Get available books
async function getAvailableBooks(req, res, next) {
    try {
        const books = await bookService.getAvailableBooks();
        res.json(books);
    } catch (error) {
        next(error);
    }
}

// GET /books/:id - Get book by ID
async function getBookById(req, res, next) {
    try {
        const book = await bookService.getBookById(req.params.id);
        res.json(book);
    } catch (error) {
        next(error);
    }
}

// PUT /books/:id - Update book
async function updateBook(req, res, next) {
    try {
        const book = await bookService.updateBook(req.params.id, req.body);
        res.json(book);
    } catch (error) {
        next(error);
    }
}

// DELETE /books/:id - Delete book
async function deleteBook(req, res, next) {
    try {
        await bookService.deleteBook(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getAvailableBooks,
    getBookById,
    updateBook,
    deleteBook
};
