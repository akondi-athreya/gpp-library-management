<div align="center">

# 📚 Library Management System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### 🚀 A robust RESTful API for managing library operations with advanced state machines and business logic

<!-- [![API Status](https://img.shields.io/badge/API-Live-success?style=flat-square)](http://localhost:3000) -->
[![Node](https://img.shields.io/badge/Backend-Express.js-green?style=flat-square)](https://postgresql.org)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square)](https://postgresql.org)


[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Architecture](#-architecture) • [Testing](#-testing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Business Rules](#-business-rules)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Examples](#-examples)

---

## 🌟 Overview

The Library Management System is a comprehensive RESTful API designed to handle the complete lifecycle of library operations. Built with modern technologies and best practices, it demonstrates advanced concepts including:

- **State Machine Implementation** for resource lifecycle management
- **Complex Business Rule Enforcement** for real-world scenarios
- **Transaction Management** for data integrity
- **Automated Fine Calculation** based on overdue periods
- **Member Suspension Logic** for policy enforcement

This system accurately reflects operational workflows of a library, making it ideal for learning backend development and understanding enterprise-level application design.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 📖 Book Management
```diff
+ Complete CRUD operations for books
+ ISBN validation and duplicate prevention
+ Inventory tracking (total and available copies)
+ Dynamic status management (Available, Borrowed, Reserved, Maintenance)
+ Category-based organization and filtering
+ Automatic availability updates during transactions
```

### 👥 Member Management
```diff
+ Full member lifecycle management
+ Email validation and unique membership numbers
+ Status tracking (Active, Suspended)
+ Borrowing history and current loans tracking
+ Fine management integration
+ Automatic suspension based on overdue books
```

</td>
<td width="50%" valign="top">

### 📑 Transaction Management
```diff
+ Secure book borrowing process
+ Return processing with automatic fine calculation
+ Overdue detection and status updates
+ Transaction history with timestamps
+ State transitions (Active → Returned/Overdue)
```

### 💰 Fine Management
```diff
+ Automatic fine generation for overdue books
+ Configurable fine rate ($0.50 per day)
+ Fine payment tracking
+ Member borrowing restrictions based on unpaid fines
+ Complete fine history per member
```

</td>
</tr>
</table>

### 🔐 Business Logic Enforcement

| Feature | Description |
|---------|-------------|
| 📚 **Borrowing Limit** | Members cannot borrow more than 3 books simultaneously |
| ⏰ **Loan Period** | 14-day standard loan period for all books |
| 🚫 **Auto Suspension** | Automatic suspension with 3+ overdue books |
| 💳 **Fine Restrictions** | Members with unpaid fines cannot borrow |
| 🔒 **Data Protection** | Cannot delete books/members with active transactions |
| 🛡️ **Data Integrity** | Proper foreign key constraints across all tables |

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | Latest |
| **Express.js** | Web Framework | 5.x |
| **PostgreSQL** | Database | 14+ |
| **Prisma** | ORM & Migration Tool | 7.x |
| **pg** | PostgreSQL Client | Latest |

### Why This Stack?

- **Express.js**: Lightweight, flexible, and perfect for RESTful APIs
- **PostgreSQL**: Robust relational database with excellent data integrity features
- **Prisma**: Modern ORM with type-safe queries and automated migrations
- **Node.js**: JavaScript runtime enabling full-stack development

---

## 🏗 Architecture

```
                 ┌─────────────┐
                 │   Client    │
                 └──────┬──────┘
                        │
                        │ HTTP Requests
                        │
┌───────────────────────▼─────────────────────┐
│           Express Application               │
│  ┌────────────────────────────────────────┐ │
│  │        Middleware Layer                │ │
│  │  • Body Parser  • Error Handler        │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │          Route Layer                   │ │
│  │  Books • Members • Transactions • Fines│ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │       Controller Layer                 │ │
│  │  Request/Response Handling             │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │         Service Layer                  │ │
│  │  Business Logic • State Machines       │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │         Prisma Client                  │ │
│  │  Database Operations                   │ │
│  └────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQL Queries
                       │
                ┌──────▼──────┐
                │ PostgreSQL  │
                │  Database   │
                └─────────────┘
```

### Design Patterns

- **MVC Architecture**: Separation of concerns with Routes, Controllers, and Services
- **Repository Pattern**: Data access abstraction through Prisma
- **Middleware Pattern**: Request preprocessing and error handling
- **Transaction Pattern**: ACID compliance for critical operations

---

## 📥 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v14 or higher)
- **npm**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd library_management
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Database

Create a `.env` file in the root directory (if not exists):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"
PORT=3000
NODE_ENV=development
```

### Step 4: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE library_db;
\q
```

### Step 5: Run Migrations

```bash
npx prisma migrate deploy
```

### Step 6: Generate Prisma Client

```bash
npx prisma generate
```

---

## 🚀 Quick Start

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Verify Installation

```bash
curl🏥 Health Check Endpoints

#### Check Database Connection
```http
GET /db-health
```

**Response:** `200 OK` (Connected)
```json
{
  "status": "connected",
  "message": "Database connection is healthy",
  "database": "PostgreSQL",
  "timestamp": "2025-12-17T10:00:00.000Z"
}
```

**Response:** `503 Service Unavailable` (Disconnected)
```json
{
  "status": "disconnected",
  "message": "Database connection failed",
  "error": "Connection timeout",
  "timestamp": "2025-12-17T10:00:00.000Z"
}
```

#### Check API Status
```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "ok",
  "message": "Library Management API is running"
}
```

---

###  http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Library Management API is running"
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

---

### 📚 Books API

#### Create a Book
```http
POST /books
Content-Type: application/json

{
  "isbn": "978-0-123456-47-2",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "total_copies": 5
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "isbn": "978-0-123456-47-2",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "status": "AVAILABLE",
  "total_copies": 5,
  "available_copies": 5,
  "createdAt": "2025-12-17T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:00:00.000Z"
}
```

#### Get All Books
```http
GET /books
```

**Query Parameters:**
- `status` - Filter by status (AVAILABLE, BORROWED, RESERVED, MAINTENANCE)
- `category` - Filter by category
- `author` - Search by author name
- `title` - Search by title

#### Get Available Books
```http
GET /books/available
```

#### Get Book by ID
```http
GET /books/:id
```

#### Update Book
```http
PUT /books/:id
Content-Type: application/json

{
  "total_copies": 6,
  "status": "AVAILABLE"
}
```

#### Delete Book
```http
DELETE /books/:id
```

**Note:** Cannot delete books with active transactions.

---

### 👥 Members API

#### Create a Member
```http
POST /members
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "membership_number": "MEM001"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "membership_number": "MEM001",
  "status": "ACTIVE",
  "createdAt": "2025-12-17T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:00:00.000Z"
}
```

#### Get All Members
```http
GET /members
```

**Query Parameters:**
- `status` - Filter by status (ACTIVE, SUSPENDED)
- `name` - Search by name
- `email` - Search by email

#### Get Member by ID
```http
GET /members/:id
```

**Returns member with:**
- Active transactions
- Unpaid fines
- Complete transaction history

#### Get Member's Borrowed Books
```http
GET /members/:id/borrowed
```

#### Update Member
```http
PUT /members/:id
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.new@example.com"
}
```

#### Delete Member
```http
DELETE /members/:id
```

**Note:** Cannot delete members with active transactions or unpaid fines.

---

### 📑 Transactions API

#### Borrow a Book
```http
POST /transactions/borrow
Content-Type: application/json

{
  "memberId": 1,
  "bookId": 1
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "bookId": 1,
  "memberId": 1,
  "borrowed_at": "2025-12-17T10:00:00.000Z",
  "due_date": "2025-12-31T10:00:00.000Z",
  "returned_at": null,
  "status": "ACTIVE",
  "createdAt": "2025-12-17T10:00:00.000Z",
  "updatedAt": "2025-12-17T10:00:00.000Z"
}
```

**Validation Checks:**
- ✓ Member exists and is active
- ✓ Member has no unpaid fines
- ✓ Member has borrowed less than 3 books
- ✓ Book exists and is available

#### Return a Book
```http
POST /transactions/:id/return
```

**Response:** `200 OK`
```json
{
  "transaction": {
    "id": 1,
    "status": "RETURNED",
    "returned_at": "2025-12-17T11:00:00.000Z"
  },
  "fine": null,
  "book": {
    "id": 1,
    "available_copies": 5,
    "status": "AVAILABLE"
  }
}
```

**If Overdue:**
```json
{
  "transaction": { ... },
  "fine": {
    "id": 1,
    "amount": "4.00",
    "paid_at": null
  },
  "book": { ... }
}
```

#### Get Overdue Transactions
```http
GET /transactions/overdue
```

**Response:** List of all overdue transactions with book and member details.

**Side Effects:**
- Automatically updates transaction status to OVERDUE
- Suspends members with 3+ overdue books

---

### 💰 Fines API

#### Get All Fines
```http
GET /fines
```

**Query Parameters:**
- `memberId` - Filter by member ID
- `paid` - Filter by payment status (true/false)

#### Get Fine by ID
```http
GET /fines/:id
```

#### Pay a Fine
```http
POST /fines/:id/pay
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "amount": "4.00",
  "paid_at": "2025-12-17T12:00:00.000Z"
}
```

---

## 🎯 Business Rules

### Borrowing Rules

| Rule | Value | Description |
|------|-------|-------------|
| **Maximum Books** | 3 | Members cannot borrow more than 3 books simultaneously |
| **Loan Period** | 14 days | Standard borrowing period for all books |
| **Fine Rate** | $0.50/day | Penalty for each day a book is overdue |
| **Suspension Threshold** | 3 books | Members with 3+ overdue books are automatically suspended |

### State Transitions

<table>
<tr>
<td width="33%" align="center">

**📚 Book Status Flow**
```mermaid
graph TD
    A[AVAILABLE] -->|Borrow| B[BORROWED]
    B -->|Return| A
    A --> C[MAINTENANCE]
    A --> D[RESERVED]
```

</td>
<td width="33%" align="center">

**📑 Transaction Status Flow**
```mermaid
graph TD
    A[ACTIVE] -->|Return on time| B[RETURNED]
    A -->|Past due date| C[OVERDUE]
    C -->|Return| B
```

</td>
<td width="33%" align="center">

**👥 Member Status Flow**
```mermaid
graph LR
    A[ACTIVE] -->|3+ overdue| B[SUSPENDED]
    B -->|< 3 overdue| A
```

</td>
</tr>
</table>

<div align="center">

| Transition | Trigger | Result |
|------------|---------|--------|
| 🟢 → 🔴 | Member has 3+ overdue books | **ACTIVE → SUSPENDED** |
| 🔴 → 🟢 | Overdue count drops below 3 | **SUSPENDED → ACTIVE** |

</div>

### Business Constraints

1. **Cannot Borrow If:**
   - Member is suspended
   - Member has unpaid fines
   - Member already has 3 books
   - Book is not available

2. **Cannot Delete If:**
   - Book has active transactions
   - Member has active transactions
   - Member has unpaid fines

3. **Automatic Actions:**
   - Fine generation on overdue return
   - Member suspension with 3+ overdue books
   - Member unsuspension when overdue count < 3
   - Book status update during borrow/return
   - Available copies tracking

---

## 🗄 Database Schema

```prisma
model Book {
  id               Int          @id @default(autoincrement())
  isbn             String       @unique
  title            String
  author           String
  category         String
  status           BookStatus   @default(AVAILABLE)
  total_copies     Int
  available_copies Int
  transactions     Transaction[]
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
}

model Member {
  id                Int          @id @default(autoincrement())
  name              String
  email             String       @unique
  membership_number String       @unique
  status            MemberStatus @default(ACTIVE)
  transactions      Transaction[]
  fines             Fine[]
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

model Transaction {
  id          Int               @id @default(autoincrement())
  bookId      Int
  memberId    Int
  borrowed_at DateTime          @default(now())
  due_date    DateTime
  returned_at DateTime?
  status      TransactionStatus @default(ACTIVE)
  book        Book              @relation(fields: [bookId], references: [id])
  member      Member            @relation(fields: [memberId], references: [id])
  fine        Fine?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Fine {
  id            Int         @id @default(autoincrement())
  memberId      Int
  transactionId Int         @unique
  amount        Decimal
  paid_at       DateTime?
  member        Member      @relation(fields: [memberId], references: [id])
  transaction   Transaction @relation(fields: [transactionId], references: [id])
  createdAt     DateTime    @default(now())
}
```

### Entity Relationships

```
┌────────┐         ┌──────────────┐         ┌────────┐
│  Book  │ 1─────M │ Transaction  │ M─────1 │ Member │
└────────┘         └──────────────┘         └────────┘
                          │ 1                    │ 1
                          │                      │
                          │ 1                    │ M
                          │                      │
                   ┌──────▼──────┐         ┌────▼────┐
                   │    Fine     │─────────│  Fine   │
                   └─────────────┘         └─────────┘
```

---

## 📁 Project Structure

```
library_management/
│
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Migration history
│       └── 20251217065644_init_library_schema/
│           └── migration.sql
│
├── src/
│   ├── app.js                  # Express application setup
│   │
│   ├── controllers/            # Request handlers
│   │   ├── bookController.js
│   │   ├── memberController.js
│   │   ├── transactionController.js
│   │   └── fineController.js
│   │
│   ├── services/               # Business logic layer
│   │   ├── bookService.js
│   │   ├── memberService.js
│   │ heck database connection
curl http://localhost:3000/db-health

# 3. Create a book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"isbn": "978-1-111111-11-1", "title": "Test Book", "author": "Test Author", "category": "Fiction", "total_copies": 3}'

# 4. Create a member
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "membership_number": "TEST001"}'

# 5. Borrow a book
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 1, "bookId": 1}'

# 6. Return the book
curl -X POST http://localhost:3000/transactions/1/return
```

### Test Coverage

<table>
<tr>
<td width="50%">

**✓ Functional Tests**
- All CRUD operations
- Business rule enforcement
- Error handling
- State transitions

</td>
<td width="50%">

**✓ Integration Tests**
- Fine calculations
- Member suspension logic
- Data integrity constraints
- Transaction safety

</td>
</tr>
</table>
---

## 🧪 Testing

### Manual Testing

Comprehensive testing guide available in [TESTING.md](TESTING.md)

### Quick Test Sequence

```bash
# 1. Start the server
npm start

# 2. Create a book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"isbn": "978-1-111111-11-1", "title": "Test Book", "author": "Test Author", "category": "Fiction", "total_copies": 3}'

# 3. Create a member
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "membership_number": "TEST001"}'

# 4. Borrow a book
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 1, "bookId": 1}'

# 5. Return the book
curl -X POST http://localhost:3000/transactions/1/return
```

### Test Coverage

- ✅ All CRUD operations
- ✅ Business rule enforcement
- ✅ Error handling
- ✅ State transitions
- ✅ Fine calculations
- ✅ Member suspension logic
- ✅ Data integrity constraints

---

## 💡 Examples

### Complete Workflow Example

```bash
# Step 1: Create books
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-0-13-468599-1",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Technology",
    "total_copies": 5
  }'

# Step 2: Create member
curl -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "membership_number": "LIB2024001"
  }'

# Step 3: Member borrows book
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 1, "bookId": 1}'

# Step 4: Check member's borrowed books
curl http://localhost:3000/members/1/borrowed

# Step 5: After 14 days, return the book
curl -X POST http://localhost:3000/transactions/1/return

# Step 6: If overdue, pay fine
curl -X POST http://localhost:3000/fines/1/pay
```

### Error Handling Examples

**Attempting to borrow with unpaid fines:**
```bash
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 1, "bookId": 2}'

# Response: 403 Forbidden
{
  "error": "Member has unpaid fines"
}
```

**Exceeding borrow limit:**
```bash
# After borrowing 3 books...
curl -X POST http://localhost:3000/transactions/borrow \
  -H "Content-Type: application/json" \
  -d '{"memberId": 1, "bookId": 4}'

# Response: 400 Bad Request
{
  "error": "Borrow limit exceeded (max 3 books)"
}
```

---

## 🚀 Advanced Features

### Transaction Safety
All critical operations use Prisma transactions to ensure ACID compliance:
```javascript
await prisma.$transaction(async (tx) => {
  // Multiple operations that must succeed or fail together
  await tx.transaction.create({...});
  await tx.book.update({...});
  await tx.member.update({...});
});
```

### Automatic State Management
- Book status automatically updates based on available copies
- Transaction status changes from ACTIVE to OVERDUE automatically
- Member status toggles between ACTIVE and SUSPENDED based on overdue count

### Fine Calculation Algorithm
```javascript
overdueDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24))
fineAmount = overdueDays × $0.50
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

### Business Rules Configuration

Located in `src/utils/businessRules.js`:

```javascript
const BUSINESS_RULES = {
  MAX_BORROWS: 3,              // Maximum books per member
  LOAN_DAYS: 14,               // Loan period in days
  FINE_PER_DAY: 0.50,          // Fine rate per day
  OVERDUE_SUSPENSION_THRESHOLD: 3  // Books to trigger suspension
};
```

---

## 🤝 Contributing

This project demonstrates modern backend development practices. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 License

This project is created for educational purposes.

---

## 👨‍💻 Author

Created as part of the GPP Tasks Week-2 assignment.

---

## 📞 Support

For questions or issues, please create an issue in the repository.

---

<div align="center">

**Built with ❤️ using Node.js, Express, PostgreSQL, and Prisma**

<!-- ⭐ Star this repository if you found it helpful! -->

</div>
