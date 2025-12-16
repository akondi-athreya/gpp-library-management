const { borrowBook } = require('../services/borrowService');
const { returnBook, getOverdueTransactions } = require('../services/transactionService');

// POST /transactions/borrow - Borrow a book
async function borrow(req, res, next) {
    try {
        const { memberId, bookId } = req.body;

        if (!memberId || !bookId) {
            return res.status(400).json({ error: 'memberId and bookId are required' });
        }

        const transaction = await borrowBook(memberId, bookId);
        res.status(201).json(transaction);
    } catch (error) {
        // Handle custom error codes
        if (error.message === 'MEMBER_NOT_FOUND') {
            return res.status(404).json({ error: 'Member not found' });
        }
        if (error.message === 'MEMBER_SUSPENDED') {
            return res.status(403).json({ error: 'Member is suspended' });
        }
        if (error.message === 'UNPAID_FINES_EXIST') {
            return res.status(403).json({ error: 'Member has unpaid fines' });
        }
        if (error.message === 'BORROW_LIMIT_EXCEEDED') {
            return res.status(400).json({ error: 'Borrow limit exceeded (max 3 books)' });
        }
        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (error.message === 'BOOK_NOT_AVAILABLE') {
            return res.status(400).json({ error: 'Book is not available' });
        }
        
        next(error);
    }
}

// POST /transactions/:id/return - Return a book
async function returnBookController(req, res, next) {
    try {
        const result = await returnBook(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// GET /transactions/overdue - Get all overdue transactions
async function getOverdue(req, res, next) {
    try {
        const transactions = await getOverdueTransactions();
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    borrow,
    returnBookController,
    getOverdue
};