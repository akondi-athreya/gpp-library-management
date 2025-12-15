// Business rule constants
const BUSINESS_RULES = {
    MAX_BORROWS: 3,
    LOAN_DAYS: 14,
    FINE_PER_DAY: 0.50,
    OVERDUE_SUSPENSION_THRESHOLD: 3
};

// Check if member can borrow (has no unpaid fines and under borrow limit)
async function canMemberBorrow(prisma, memberId) {
    const member = await prisma.member.findUnique({
        where: { id: memberId },
        include: {
            fines: {
                where: { paid_at: null }
            },
            transactions: {
                where: { status: 'ACTIVE' }
            }
        }
    });

    if (!member) {
        return { canBorrow: false, reason: 'Member not found' };
    }

    if (member.status !== 'ACTIVE') {
        return { canBorrow: false, reason: 'Member is suspended' };
    }

    if (member.fines.length > 0) {
        return { canBorrow: false, reason: 'Member has unpaid fines' };
    }

    if (member.transactions.length >= BUSINESS_RULES.MAX_BORROWS) {
        return { canBorrow: false, reason: 'Borrow limit exceeded' };
    }

    return { canBorrow: true };
}

// Check if book is available for borrowing
async function isBookAvailable(prisma, bookId) {
    const book = await prisma.book.findUnique({
        where: { id: bookId }
    });

    if (!book) {
        return { available: false, reason: 'Book not found' };
    }

    if (book.available_copies <= 0) {
        return { available: false, reason: 'No copies available' };
    }

    if (book.status !== 'AVAILABLE') {
        return { available: false, reason: 'Book is not available for borrowing' };
    }

    return { available: true };
}

// Calculate fine amount for overdue days
function calculateFine(dueDate, returnDate = new Date()) {
    if (returnDate <= dueDate) {
        return 0;
    }

    const overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    return overdueDays * BUSINESS_RULES.FINE_PER_DAY;
}

// Calculate due date from borrow date
function calculateDueDate(borrowDate = new Date()) {
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + BUSINESS_RULES.LOAN_DAYS);
    return dueDate;
}

module.exports = {
    BUSINESS_RULES,
    canMemberBorrow,
    isBookAvailable,
    calculateFine,
    calculateDueDate
};
