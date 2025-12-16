const prisma = require('../prisma/client');

const MAX_BORROWS = 3;
const LOAN_DAYS = 14;

async function borrowBook(memberId, bookId) {
    return prisma.$transaction(async (tx) => {

        // 1. Member validation
        const member = await tx.member.findUnique({
            where: { id: memberId }
        });

        if (!member) {
            throw new Error('MEMBER_NOT_FOUND');
        }

        if (member.status !== 'ACTIVE') {
            throw new Error('MEMBER_SUSPENDED');
        }

        // 2. Unpaid fines check
        const unpaidFines = await tx.fine.count({
            where: {
                memberId,
                paid_at: null
            }
        });

        if (unpaidFines > 0) {
            throw new Error('UNPAID_FINES_EXIST');
        }

        // 3. Borrow limit check
        const activeBorrows = await tx.transaction.count({
            where: {
                memberId,
                status: 'ACTIVE'
            }
        });

        if (activeBorrows >= MAX_BORROWS) {
            throw new Error('BORROW_LIMIT_EXCEEDED');
        }

        // 4. Book validation
        const book = await tx.book.findUnique({
            where: { id: bookId }
        });

        if (!book) {
            throw new Error('BOOK_NOT_FOUND');
        }

        if (book.status !== 'AVAILABLE' || book.available_copies <= 0) {
            throw new Error('BOOK_NOT_AVAILABLE');
        }

        // 5. Create transaction
        const borrowedAt = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

        const transaction = await tx.transaction.create({
            data: {
                memberId,
                bookId,
                borrowed_at: borrowedAt,
                due_date: dueDate,
                status: 'ACTIVE'
            }
        });

        // 6. Update book inventory
        const updatedCopies = book.available_copies - 1;

        await tx.book.update({
            where: { id: bookId },
            data: {
                available_copies: updatedCopies,
                status: updatedCopies === 0 ? 'BORROWED' : 'AVAILABLE'
            }
        });

        return transaction;
    });
}

module.exports = {
    borrowBook
};