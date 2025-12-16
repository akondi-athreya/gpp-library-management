const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// POST /members - Create a new member
router.post('/', memberController.createMember);

// GET /members - Get all members
router.get('/', memberController.getAllMembers);

// GET /members/:id - Get member by ID
router.get('/:id', memberController.getMemberById);

// GET /members/:id/borrowed - Get books borrowed by member
router.get('/:id/borrowed', memberController.getMemberBorrowedBooks);

// PUT /members/:id - Update member
router.put('/:id', memberController.updateMember);

// DELETE /members/:id - Delete member
router.delete('/:id', memberController.deleteMember);

module.exports = router;
