const prisma = require('../prisma/client');

// Get all fines with optional filtering
async function getAllFines(filters = {}) {
    const where = {};

    if (filters.memberId) {
        where.memberId = parseInt(filters.memberId);
    }

    if (filters.paid !== undefined) {
        if (filters.paid === 'true' || filters.paid === true) {
            where.paid_at = { not: null };
        } else {
            where.paid_at = null;
        }
    }

    return await prisma.fine.findMany({
        where,
        include: {
            member: {
                select: {
                    id: true,
                    name: true,
                    membership_number: true
                }
            },
            transaction: {
                include: {
                    book: {
                        select: {
                            id: true,
                            title: true,
                            isbn: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

// Get fine by ID
async function getFineById(id) {
    const fine = await prisma.fine.findUnique({
        where: { id: parseInt(id) },
        include: {
            member: true,
            transaction: {
                include: {
                    book: true
                }
            }
        }
    });

    if (!fine) {
        throw { statusCode: 404, message: 'Fine not found' };
    }

    return fine;
}

// Mark fine as paid
async function payFine(id) {
    const fine = await prisma.fine.findUnique({
        where: { id: parseInt(id) }
    });

    if (!fine) {
        throw { statusCode: 404, message: 'Fine not found' };
    }

    if (fine.paid_at) {
        throw { statusCode: 400, message: 'Fine has already been paid' };
    }

    return await prisma.fine.update({
        where: { id: parseInt(id) },
        data: {
            paid_at: new Date()
        }
    });
}

module.exports = {
    getAllFines,
    getFineById,
    payFine
};
