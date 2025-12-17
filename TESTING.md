# Library Management API - Testing Guide

## Prerequisites

1. **Start PostgreSQL Database**:
   - Open Postgres.app (located in your Applications folder)
   - Or start your PostgreSQL service

2. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```
   Server will run on http://localhost:3000

---

## API Testing with curl

### Health Check
```bash
curl http://localhost:3000/health
```

---

## 📚 Books Endpoints

### 1. Create a Book
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-123456-47-2",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "total_copies": 5
  }'
```

### 2. Create Another Book
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-987654-32-1",
    "title": "1984",
    "author": "George Orwell",
    "category": "Fiction",
    "total_copies": 3
  }'
```

### 3. Get All Books
```bash
curl http://localhost:3000/books
```

### 4. Get Available Books Only
```bash
curl http://localhost:3000/books/available
```

### 5. Get Book by ID
```bash
curl http://localhost:3000/books/1
```

### 6. Update Book
```bash
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "total_copies": 6
  }'
```

### 7. Filter Books by Category
```bash
curl "http://localhost:3000/books?category=Fiction"
```

---

## 👥 Members Endpoints

### 1. Create a Member
```bash
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "membership_number": "MEM001"
  }'
```

### 2. Create Another Member
```bash
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "membership_number": "MEM002"
  }'
```

### 3. Get All Members
```bash
curl http://localhost:3000/members
```

### 4. Get Member by ID
```bash
curl http://localhost:3000/members/1
```

### 5. Get Books Borrowed by Member
```bash
curl http://localhost:3000/members/1/borrowed
```

### 6. Update Member
```bash
curl -X PUT http://localhost:3000/members/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated"
  }'
```

---

## 📖 Transaction Endpoints

### 1. Borrow a Book
```bash
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "bookId": 1
  }'
```

### 2. Borrow Another Book (same member)
```bash
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "bookId": 2
  }'
```

### 3. Test Borrow Limit (should fail after 3 books)
```bash
# Borrow a third book
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "bookId": 3
  }'

# Try to borrow a fourth book (should fail)
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "bookId": 4
  }'
```

### 4. Return a Book
```bash
curl -X POST http://localhost:3000/transactions/1/return
```

### 5. Get Overdue Transactions
```bash
curl http://localhost:3000/transactions/overdue
```

---

## 💰 Fines Endpoints

### 1. Get All Fines
```bash
curl http://localhost:3000/fines
```

### 2. Get Unpaid Fines Only
```bash
curl "http://localhost:3000/fines?paid=false"
```

### 3. Get Fines for Specific Member
```bash
curl "http://localhost:3000/fines?memberId=1"
```

### 4. Pay a Fine
```bash
curl -X POST http://localhost:3000/fines/1/pay
```

---

## 🧪 Business Rules Testing

### Test 1: Unpaid Fines Block Borrowing
1. Create a member
2. Borrow a book
3. Manually update transaction to be overdue (in database)
4. Return the book (creates a fine)
5. Try to borrow another book (should fail)
6. Pay the fine
7. Try to borrow again (should succeed)

### Test 2: Maximum 3 Books Limit
```bash
# Borrow 3 books
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 2, "bookId": 1}'

curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 2, "bookId": 2}'

curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 2, "bookId": 3}'

# Try 4th book (should fail)
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 2, "bookId": 4}'
```

### Test 3: Book Status Updates
```bash
# Check book before borrowing
curl http://localhost:3000/books/1

# Borrow all copies
# ... borrow until available_copies = 0

# Check book status (should be BORROWED)
curl http://localhost:3000/books/1

# Return one copy
curl -X POST http://localhost:3000/transactions/1/return

# Check book status (should be AVAILABLE)
curl http://localhost:3000/books/1
```

---

## 🔍 Error Testing

### Test Duplicate ISBN
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-123456-47-2",
    "title": "Duplicate Book",
    "author": "Test Author",
    "category": "Fiction",
    "total_copies": 2
  }'
```
Expected: 409 Conflict

### Test Invalid Member ID
```bash
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 999,
    "bookId": 1
  }'
```
Expected: 404 Not Found

### Test Book Not Available
```bash
# First, borrow all copies of a book
# Then try to borrow again
```
Expected: 400 Bad Request

---

## 📊 Quick Test Sequence

Run these commands in order for a complete flow test:

```bash
# 1. Create books
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"isbn": "978-1-111111-11-1", "title": "Book One", "author": "Author One", "category": "Fiction", "total_copies": 3}'
curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"isbn": "978-2-222222-22-2", "title": "Book Two", "author": "Author Two", "category": "Science", "total_copies": 2}'

# 2. Create member
curl -X POST http://localhost:3000/members -H "Content-Type: application/json" -d '{"name": "Test User", "email": "test@example.com", "membership_number": "TEST001"}'

# 3. Borrow book
curl -X POST http://localhost:3000/transactions/borrow -H "Content-Type: application/json" -d '{"memberId": 1, "bookId": 1}'

# 4. Check member's borrowed books
curl http://localhost:3000/members/1/borrowed

# 5. Return book
curl -X POST http://localhost:3000/transactions/1/return

# 6. Check all transactions
curl http://localhost:3000/transactions/overdue
```

---

## Notes

- All timestamps are in UTC
- The loan period is 14 days
- Overdue fine is $0.50 per day
- Members are suspended if they have 3+ overdue books
- Members with unpaid fines cannot borrow books
- Maximum 3 books can be borrowed simultaneously
