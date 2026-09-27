# ⚡ Backend Ledger

### A transaction-driven financial backend built with Node.js, Express & MongoDB.

<p align="center">

**Authentication • Accounts • Transactions • Ledger • Idempotency • Email**

</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge\&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-5-black?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge\&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</p>

---

## 🧩 The Problem

Financial systems are not simply CRUD applications.

A basic CRUD backend might do:

```text
Create → Read → Update → Delete
```

A financial backend has a different problem:

```text
Request
   ↓
Authentication
   ↓
Validation
   ↓
Transaction
   ↓
Ledger Entry
   ↓
Consistency
   ↓
Auditability
```

A failed request, duplicate request, partial update, or inconsistent balance can create serious problems.

**Backend Ledger** is an attempt to model these problems in a real backend system.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      Client      │
                         │ Web / Mobile /   │
                         │    Postman       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Express API    │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
           ┌────────────────┐          ┌────────────────┐
           │ Auth Middleware│          │ Request Logger │
           └───────┬────────┘          └────────────────┘
                   │
                   ▼
          ┌────────────────────┐
          │    Controllers     │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │      Services      │
          │ Business Logic     │
          └─────────┬──────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
 ┌────────────────┐    ┌────────────────┐
 │    MongoDB     │    │    Nodemailer  │
 │                │    │     Email      │
 │ Users          │    └────────────────┘
 │ Accounts       │
 │ Transactions   │
 │ Ledger Entries │
 └────────────────┘
```

---

# 🧠 Core Engineering Concepts

This project focuses on more than simply creating REST endpoints.

### 01 — Authentication

Users authenticate using JWT.

```text
Register
   ↓
Password Hash
   ↓
MongoDB
   ↓
Login
   ↓
JWT
   ↓
Protected API
```

---

### 02 — Ledger-Based Transactions

A financial operation creates a record of what happened.

For example:

```text
Alice ─────── ₹500 ───────► Bob

Alice
  ↓
DEBIT  ₹500

Bob
  ↓
CREDIT ₹500
```

The transaction history provides an auditable trail of financial activity.

---

### 03 — Idempotency

One of the most important concepts in payment systems is:

> **One request should not accidentally become two transactions.**

Imagine:

```text
Client
   │
   │ Transfer ₹500
   ▼
Server
   │
   │ Transaction processed
   │
   X Network timeout
   │
   ▼
Client retries
```

Without idempotency:

```text
₹500 + ₹500 = ₹1000 transferred
```

With an idempotency key:

```text
Request #1
key = tx_123
      ↓
Processed

Request #2
key = tx_123
      ↓
Already processed
      ↓
Do not duplicate
```

This project uses idempotency concepts to make transaction requests safer.

---

# 💳 Transaction Lifecycle

A transfer follows a controlled lifecycle:

```text
                 TRANSFER REQUEST
                        │
                        ▼
                Authenticate User
                        │
                        ▼
                 Validate Input
                        │
                        ▼
              Validate Idempotency
                        │
                        ▼
                Find Source Account
                        │
                        ▼
              Find Destination Account
                        │
                        ▼
               Check Available Funds
                        │
                        ▼
                Create Transaction
                        │
                ┌───────┴───────┐
                ▼               ▼
             DEBIT            CREDIT
             Sender           Receiver
                │               │
                └───────┬───────┘
                        ▼
                 Record Ledger
                        │
                        ▼
                Transaction Success
```

---

# 🗃️ Data Model

The backend revolves around four major entities:

```text
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ owns
     ▼
┌──────────┐
│ Account  │
└────┬─────┘
     │
     │ creates
     ▼
┌──────────────┐
│ Transaction  │
└──────┬───────┘
       │
       │ produces
       ▼
┌──────────────┐
│ Ledger Entry │
└──────────────┘
```

### User

Responsible for identity and authentication.

### Account

Represents the financial account associated with a user.

### Transaction

Represents a business-level transfer.

### Ledger Entry

Represents the individual financial movement generated by a transaction.

---

# 🔐 Security Model

Security is treated as part of the backend design rather than an afterthought.

```text
                Incoming Request
                       │
                       ▼
               Authentication
                       │
                       ▼
                 JWT Verify
                       │
                       ▼
                Authorization
                       │
                       ▼
               Input Validation
                       │
                       ▼
                Business Logic
```

Security considerations include:

* Password hashing
* JWT authentication
* Protected routes
* Environment-based secrets
* Request validation
* Idempotency
* Controlled database access
* Sensitive credentials excluded from Git

---

# 📡 API Design

The API follows a REST-oriented structure.

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Accounts

```http
POST /api/accounts
GET  /api/accounts
GET  /api/accounts/:id
```

## Transactions

```http
POST /api/transactions
GET  /api/transactions
GET  /api/transactions/:id
```

> Endpoints may evolve as the project develops.

---

# 📦 Project Structure

```text
backend-ledger/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
│
└── src/
    │
    ├── app.js
    │
    ├── config/
    │   └── database.js
    │
    ├── controllers/
    │
    ├── middleware/
    │
    ├── models/
    │
    ├── routes/
    │
    └── services/
```

The project follows a separation-of-concerns approach:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
Database
```

This keeps HTTP handling separate from business logic and database operations.

---

# 🧰 Tech Stack

| Layer             | Technology |
| ----------------- | ---------- |
| Runtime           | Node.js    |
| Framework         | Express.js |
| Database          | MongoDB    |
| ODM               | Mongoose   |
| Authentication    | JWT        |
| Password Security | bcrypt     |
| Email             | Nodemailer |
| Logging           | Morgan     |
| Configuration     | dotenv     |
| Development       | Nodemon    |

---

# ⚙️ Local Development

### Clone

```bash
git clone https://github.com/ankurdotio/backend-ledger.git

cd backend-ledger
```

### Install

```bash
npm install
```

### Environment

Create `.env`:

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

EMAIL_USER=your_email
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
```

### Run

```bash
npm run dev
```

Server:

```text
http://localhost:3000
```

---

# 📈 Engineering Decisions

### Why MongoDB?

The application works with document-oriented entities such as:

```text
User
Account
Transaction
Ledger
```

MongoDB with Mongoose provides schema validation and a straightforward data-access layer.

### Why JWT?

JWT allows authenticated requests to carry a signed identity token without keeping the primary authentication state inside the API process.

### Why Idempotency?

Because transaction APIs must account for retries caused by:

* network failures
* client retries
* timeouts
* duplicate requests

---

# 🧪 Testing the API

The API can be tested using tools such as:

```text
Postman
Thunder Client
curl
```

Example:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "********"
}
```

---

# 📊 Observability

The backend uses request logging during development to make API behavior easier to inspect.

Example:

```text
POST /api/auth/login       200
POST /api/accounts        201
POST /api/transactions    201
GET  /api/transactions    200
```

Future observability improvements:

```text
Logs
  ↓
Metrics
  ↓
Monitoring
  ↓
Alerts
```

---

# 🚧 Current Status

```text
Authentication       ████████████████████ 100%
Database             ████████████████████ 100%
REST API             ███████████████░░░░░  75%
Ledger               █████████████░░░░░░░  65%
Transactions         ████████████░░░░░░░░  60%
Testing              ██████░░░░░░░░░░░░░░  30%
Deployment            ███░░░░░░░░░░░░░░░░░  15%
```

> Progress percentages are approximate and should be updated as development continues.

---

# 🔮 Roadmap

### Backend

* [ ] Complete transaction service
* [ ] Improve error handling
* [ ] Add request validation
* [ ] Add pagination
* [ ] Add transaction filtering

### Reliability

* [ ] Automated tests
* [ ] Integration tests
* [ ] Rate limiting
* [ ] Retry strategy
* [ ] Better idempotency handling

### Infrastructure

* [ ] Docker
* [ ] CI/CD
* [ ] Production deployment
* [ ] Redis
* [ ] Monitoring

### Documentation

* [ ] Swagger / OpenAPI
* [ ] Architecture diagrams
* [ ] API examples
* [ ] Database ER diagram

---

# 🧠 What This Project Demonstrates

This project is built to demonstrate practical backend engineering concepts:

```text
                    Backend Engineering
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
 Authentication       Data Modeling       API Design
       │                   │                   │
       ├──────────────┐    ├──────────────┐    │
       ▼              ▼    ▼              ▼    ▼
      JWT          Security MongoDB    Ledger REST
       │              │      │            │
       └──────────────┴──────┴────────────┴───┐
                                              ▼
                                      Reliable Backend
```

The goal is not just to build endpoints.

The goal is to understand **how backend systems behave when real-world problems occur**.

---

# 👨‍💻 Author

### Bhawana 

Building backend systems with **Node.js, Express, MongoDB & TypeScript**.



---

<p align="center">




</p>
