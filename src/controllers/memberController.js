const memberService = require('../services/memberService');

// POST /members - Create a new member
async function createMember(req, res, next) {
    try {
        const member = await memberService.createMember(req.body);
        res.status(201).json(member);
    } catch (error) {
        next(error);
    }
}

// GET /members - Get all members
async function getAllMembers(req, res, next) {
    try {
        const filters = {
            status: req.query.status,
            name: req.query.name,
            email: req.query.email
        };
        const members = await memberService.getAllMembers(filters);
        res.json(members);
    } catch (error) {
        next(error);
    }
}

// GET /members/:id - Get member by ID
async function getMemberById(req, res, next) {
    try {
        const member = await memberService.getMemberById(req.params.id);
        res.json(member);
    } catch (error) {
        next(error);
    }
}

// GET /members/:id/borrowed - Get books borrowed by member
async function getMemberBorrowedBooks(req, res, next) {
    try {
        const transactions = await memberService.getMemberBorrowedBooks(req.params.id);
        res.json(transactions);
    } catch (error) {
        next(error);
    }
}

// PUT /members/:id - Update member
async function updateMember(req, res, next) {
    try {
        const member = await memberService.updateMember(req.params.id, req.body);
        res.json(member);
    } catch (error) {
        next(error);
    }
}

// DELETE /members/:id - Delete member
async function deleteMember(req, res, next) {
    try {
        await memberService.deleteMember(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    getMemberBorrowedBooks,
    updateMember,
    deleteMember
};
