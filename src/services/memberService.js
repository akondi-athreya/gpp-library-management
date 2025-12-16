const prisma = require('../prisma/client');

// Create a new member
async function createMember(data) {
    const { name, email, membership_number } = data;

    // Validate input
    if (!name || !email || !membership_number) {
        throw { statusCode: 400, message: 'Missing required fields' };
    }

    return await prisma.member.create({
        data: {
            name,
            email,
            membership_number,
            status: 'ACTIVE'
        }
    });
}

// Get all members with optional filtering
async function getAllMembers(filters = {}) {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.name) {
        where.name = {
            contains: filters.name,
            mode: 'insensitive'
        };
    }

    if (filters.email) {
        where.email = {
            contains: filters.email,
            mode: 'insensitive'
        };
    }

    return await prisma.member.findMany({
        where,
        orderBy: { name: 'asc' }
    });
}

// Get member by ID
async function getMemberById(id) {
    const member = await prisma.member.findUnique({
        where: { id: parseInt(id) },
        include: {
            transactions: {
                where: {
                    status: 'ACTIVE'
                },
                include: {
                    book: true
                }
            },
            fines: {
                where: {
                    paid_at: null
                }
            }
        }
    });

    if (!member) {
        throw { statusCode: 404, message: 'Member not found' };
    }

    return member;
}

// Get books borrowed by a member
async function getMemberBorrowedBooks(id) {
    const member = await prisma.member.findUnique({
        where: { id: parseInt(id) }
    });

    if (!member) {
        throw { statusCode: 404, message: 'Member not found' };
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            memberId: parseInt(id),
            status: 'ACTIVE'
        },
        include: {
            book: true
        },
        orderBy: { borrowed_at: 'desc' }
    });

    return transactions;
}

// Update member
async function updateMember(id, data) {
    const member = await prisma.member.findUnique({
        where: { id: parseInt(id) }
    });

    if (!member) {
        throw { statusCode: 404, message: 'Member not found' };
    }

    return await prisma.member.update({
        where: { id: parseInt(id) },
        data
    });
}

// Delete member
async function deleteMember(id) {
    const member = await prisma.member.findUnique({
        where: { id: parseInt(id) },
        include: {
            transactions: {
                where: {
                    status: 'ACTIVE'
                }
            },
            fines: {
                where: {
                    paid_at: null
                }
            }
        }
    });

    if (!member) {
        throw { statusCode: 404, message: 'Member not found' };
    }

    if (member.transactions.length > 0) {
        throw { 
            statusCode: 400, 
            message: 'Cannot delete member with active transactions' 
        };
    }

    if (member.fines.length > 0) {
        throw { 
            statusCode: 400, 
            message: 'Cannot delete member with unpaid fines' 
        };
    }

    return await prisma.member.delete({
        where: { id: parseInt(id) }
    });
}

module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    getMemberBorrowedBooks,
    updateMember,
    deleteMember
};
