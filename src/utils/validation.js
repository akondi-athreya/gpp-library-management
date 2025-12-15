// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ISBN validation (ISBN-10 or ISBN-13)
function isValidISBN(isbn) {
    // Remove hyphens and spaces
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    
    // Check if it's 10 or 13 digits
    if (cleanISBN.length === 10 || cleanISBN.length === 13) {
        return /^\d+$/.test(cleanISBN);
    }
    
    return false;
}

// Validate book data
function validateBookData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!data.isbn) errors.push('ISBN is required');
        if (!data.title) errors.push('Title is required');
        if (!data.author) errors.push('Author is required');
        if (!data.category) errors.push('Category is required');
        if (!data.total_copies) errors.push('Total copies is required');
    }

    if (data.isbn && !isValidISBN(data.isbn)) {
        errors.push('Invalid ISBN format');
    }

    if (data.total_copies !== undefined) {
        if (typeof data.total_copies !== 'number' || data.total_copies < 1) {
            errors.push('Total copies must be a positive number');
        }
    }

    if (data.status && !['AVAILABLE', 'BORROWED', 'RESERVED', 'MAINTENANCE'].includes(data.status)) {
        errors.push('Invalid book status');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate member data
function validateMemberData(data, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
        if (!data.name) errors.push('Name is required');
        if (!data.email) errors.push('Email is required');
        if (!data.membership_number) errors.push('Membership number is required');
    }

    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }

    if (data.status && !['ACTIVE', 'SUSPENDED'].includes(data.status)) {
        errors.push('Invalid member status');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate transaction data
function validateTransactionData(data) {
    const errors = [];

    if (!data.memberId) errors.push('Member ID is required');
    if (!data.bookId) errors.push('Book ID is required');

    if (data.memberId && (typeof data.memberId !== 'number' || data.memberId < 1)) {
        errors.push('Invalid member ID');
    }

    if (data.bookId && (typeof data.bookId !== 'number' || data.bookId < 1)) {
        errors.push('Invalid book ID');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Validate ID parameter
function validateId(id) {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
}

module.exports = {
    isValidEmail,
    isValidISBN,
    validateBookData,
    validateMemberData,
    validateTransactionData,
    validateId
};
