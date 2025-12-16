const prisma = require('../prisma/client');

// Create a new book
async function createBook(data) {
    const { isbn, title, author, category, total_copies } = data;

    // Validate input
    if (!isbn || !title || !author || !category || !total_copies) {
        throw { statusCode: 400, message: 'Missing required fields' };
    }

    if (total_copies < 1) {
        throw { statusCode: 400, message: 'Total copies must be at least 1' };
    }

    return await prisma.book.create({
        data: {
            isbn,
            title,
            author,
            category,
            total_copies,
            available_copies: total_copies,
            status: 'AVAILABLE'
        }
    });
}

// Get all books with optional filtering
async function getAllBooks(filters = {}) {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.category) {
        where.category = filters.category;
    }

    if (filters.author) {
        where.author = {
            contains: filters.author,
            mode: 'insensitive'
        };
    }

    if (filters.title) {
        where.title = {
            contains: filters.title,
            mode: 'insensitive'
        };
    }

    return await prisma.book.findMany({
        where,
        orderBy: { title: 'asc' }
    });
}

// Get available books only
async function getAvailableBooks() {
    return await prisma.book.findMany({
        where: {
            status: 'AVAILABLE',
            available_copies: {
                gt: 0
            }
        },
        orderBy: { title: 'asc' }
    });
}

// Get book by ID
async function getBookById(id) {
    const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
        include: {
            transactions: {
                where: {
                    status: 'ACTIVE'
                },
                include: {
                    member: {
                        select: {
                            id: true,
                            name: true,
                            membership_number: true
                        }
                    }
                }
            }
        }
    });

    if (!book) {
        throw { statusCode: 404, message: 'Book not found' };
    }

    return book;
}

// Update book
async function updateBook(id, data) {
    const book = await prisma.book.findUnique({
        where: { id: parseInt(id) }
    });

    if (!book) {
        throw { statusCode: 404, message: 'Book not found' };
    }

    // If total_copies is being updated, adjust available_copies accordingly
    if (data.total_copies !== undefined) {
        const borrowed = book.total_copies - book.available_copies;
        
        if (data.total_copies < borrowed) {
            throw { 
                statusCode: 400, 
                message: `Cannot reduce total copies below ${borrowed} (currently borrowed)` 
            };
        }

        data.available_copies = data.total_copies - borrowed;

        // Update status based on availability
        if (data.available_copies > 0) {
            data.status = 'AVAILABLE';
        }
    }

    return await prisma.book.update({
        where: { id: parseInt(id) },
        data
    });
}

// Delete book
async function deleteBook(id) {
    const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
        include: {
            transactions: {
                where: {
                    status: 'ACTIVE'
                }
            }
        }
    });

    if (!book) {
        throw { statusCode: 404, message: 'Book not found' };
    }

    if (book.transactions.length > 0) {
        throw { 
            statusCode: 400, 
            message: 'Cannot delete book with active transactions' 
        };
    }

    return await prisma.book.delete({
        where: { id: parseInt(id) }
    });
}

module.exports = {
    createBook,
    getAllBooks,
    getAvailableBooks,
    getBookById,
    updateBook,
    deleteBook
};
