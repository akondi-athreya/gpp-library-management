const fineService = require('../services/fineService');

// GET /fines - Get all fines
async function getAllFines(req, res, next) {
    try {
        const filters = {
            memberId: req.query.memberId,
            paid: req.query.paid
        };
        const fines = await fineService.getAllFines(filters);
        res.json(fines);
    } catch (error) {
        next(error);
    }
}

// GET /fines/:id - Get fine by ID
async function getFineById(req, res, next) {
    try {
        const fine = await fineService.getFineById(req.params.id);
        res.json(fine);
    } catch (error) {
        next(error);
    }
}

// POST /fines/:id/pay - Mark fine as paid
async function payFine(req, res, next) {
    try {
        const fine = await fineService.payFine(req.params.id);
        res.json(fine);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllFines,
    getFineById,
    payFine
};
