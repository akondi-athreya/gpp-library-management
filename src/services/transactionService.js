const prisma = require('../prisma/client');

const FINE_PER_DAY = 0.50;

// Return a borrowed book
async function returnBook(transactionId) {
    return prisma.$transaction(async (tx) => {
        // 1. Find the transaction
        const transaction = await tx.transaction.findUnique({
            where: { id: parseInt(transactionId) },
            include: {
                book: true,
                member: true
            }
        });

        if (!transaction) {
            throw { statusCode: 404, message: 'Transaction not found' };
        }

        if (transaction.status !== 'ACTIVE' && transaction.status !== 'OVERDUE') {
            throw { statusCode: 400, message: 'Book has already been returned' };
        }

        const returnedAt = new Date();

        // 2. Calculate if overdue and create fine if needed
        let fine = null;
        if (returnedAt > transaction.due_date) {
            const overdueDays = Math.ceil(
                (returnedAt - transaction.due_date) / (1000 * 60 * 60 * 24)
            );
            const fineAmount = overdueDays * FINE_PER_DAY;

            // Create fine
            fine = await tx.fine.create({
                data: {
                    memberId: transaction.memberId,
                    transactionId: transaction.id,
                    amount: fineAmount
                }
            });
        }

        // 3. Update transaction status
        const updatedTransaction = await tx.transaction.update({
            where: { id: parseInt(transactionId) },
            data: {
                returned_at: returnedAt,
                status: 'RETURNED'
            }
        });

        // 4. Update book inventory
        const updatedBook = await tx.book.update({
            where: { id: transaction.bookId },
            data: {
                available_copies: {
                    increment: 1
                },
                status: 'AVAILABLE'
            }
        });

        // 5. Check if member should be unsuspended
        const activeOverdueCount = await tx.transaction.count({
            where: {
                memberId: transaction.memberId,
                status: 'OVERDUE'
            }
        });

        if (activeOverdueCount < 3 && transaction.member.status === 'SUSPENDED') {
            await tx.member.update({
                where: { id: transaction.memberId },
                data: { status: 'ACTIVE' }
            });
        }

        return {
            transaction: updatedTransaction,
            fine: fine,
            book: updatedBook
        };
    });
}

// Get all overdue transactions
async function getOverdueTransactions() {
    const now = new Date();

    // First, update any ACTIVE transactions that are now overdue
    await prisma.$transaction(async (tx) => {
        const overdueTransactions = await tx.transaction.findMany({
            where: {
                status: 'ACTIVE',
                due_date: {
                    lt: now
                }
            },
            include: {
                member: true
            }
        });

        // Update transaction statuses to OVERDUE
        if (overdueTransactions.length > 0) {
            await tx.transaction.updateMany({
                where: {
                    id: {
                        in: overdueTransactions.map(t => t.id)
                    }
                },
                data: {
                    status: 'OVERDUE'
                }
            });

            // Check each member for suspension
            const memberOverdueCounts = {};
            for (const trans of overdueTransactions) {
                if (!memberOverdueCounts[trans.memberId]) {
                    const count = await tx.transaction.count({
                        where: {
                            memberId: trans.memberId,
                            status: 'OVERDUE'
                        }
                    });
                    memberOverdueCounts[trans.memberId] = count;
                }
            }

            // Suspend members with 3+ overdue books
            for (const [memberId, count] of Object.entries(memberOverdueCounts)) {
                if (count >= 3) {
                    await tx.member.update({
                        where: { id: parseInt(memberId) },
                        data: { status: 'SUSPENDED' }
                    });
                }
            }
        }
    });

    // Return all overdue transactions
    return await prisma.transaction.findMany({
        where: {
            status: 'OVERDUE'
        },
        include: {
            book: true,
            member: true
        },
        orderBy: {
            due_date: 'asc'
        }
    });
}

module.exports = {
    returnBook,
    getOverdueTransactions
};
