# Demo Credit 



## Description

**Demo-Credit**  Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.


## ✨ Features 

- [x] CRUD operations for user and wallet
- [x] Authentication & Authorization (Faux)
- [x] Input validation (Joi)
- [x] MySQL integration
- [x] Rate limiting and logging

## 🔧 Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **MySQL** 
- **Joi** for input validation
- **Jest** for testing
- **Knex ORM** 

## 🚀 Getting Started

### Prerequisites

- Node.js LTS version
- npm or yarn
- MySQL running locally or via a service

### 1. Clone The Repo

```bash
git clone https://github.com/Kelvin-Teck/demo-credit.git
cd demo-credit
```
### 2. Install the Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory with the following:

```env
NODE_ENV=<current_environment> # development or production
PORT=<your_specified_port> 
DB_HOST=<database_host> # if in development - <localhost> in production - <your_remote_databse_host>
DB_PORT=<your_database_port> # if in development defaults - 3306, production - <your_remote_database_port> 
DB_USER=<your_database_user>
DB_PASSWORD=<your_database_password>
DB_NAME=<your_database_name>
EMAIL_SERVICE=gmail
EMAIL_HOST=gmail
EMAIL_PORT=587
EMAIL_PASS=<your_email_app_password>
EMAIL_USER=<your_email_address>
ADJUTOR_API_BASE_URL=https://adjutor.lendsqr.com/v2
ADJUTOR_API_KEY=<your_api_key>
```
Make sure your MySQL server is running and the database `your_database_name` exists. You can create it with:

```sql
CREATE DATABASE <your_database_name>;
```

### 4. Running Database Migrations

```bash
npm run migrate
```
This will set up your tables using Knex.

### 5. Start the Development Server
```bash
npm run dev
```
The server should now be running on `http://localhost:<your_specified_port>`

## 💽 Database Design (ER Diagram)


Below is the Entity Relationship (ER) diagram representing the database schema for the Demo-Credit application:

![Demo-Credit ER Diagram](./demo-credit-erd_1.png)

> This diagram illustrates the relationships between users, wallets, transactions, and other core entities in the system.

## 📬 API Reference

You can explore and test all endpoints using our Postman documentation:

👉 [Demo-Credit API Postman Docs](https://documenter.getpostman.com/view/30059286/2sB2ixjE3E)

## 🗂️ Project Structure

```bash
demo-credit/
├── src/
│   ├── config/            # Database and environment configurations
│   ├── controllers/       # Route handlers for each feature (e.g., auth, wallet)
|   |-- database/          # Database Folder
|   |   |-- migrations/    # Database migrations files
|   |-- interfaces/        # TypeScript interface definitions 
│   ├── middlewares/       # Custom middleware (e.g., auth, error handler)
│   ├── models/            # Knex models and queries
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic and integrations (e.g., blacklist check)
│   ├── utils/             # Helper functions (e.g., formatters, validators)
│   ├── types/             # TypeScript type definitions
│   └── index.ts           # Application entry point
│
|
├── .env                   # Environment variable definitions
├── .gitignore             # Git ignored files
├── knexfile.ts            # Knex configuration
├── package-lock.json          
|-- package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Project documentation


```
## 🧪 Testing 

Ensure you’ve set up your test environment before running tests.

### 🔧 Setup
Install testing dependencies (if you haven’t already):

```bash
npm install --save-dev jest ts-jest @types/jest supertest
```
Add a test script to your package.json:

```json
"scripts": {
  "test": "jest"
}
```
### 🧪 Running Tests

```bash
npm run test
```

Tests are usually placed in a __tests__/ directory and follow this structure:

```
__tests__/
├── userController.spec.ts
├── walletController.spec.ts
├── userService.spec.ts
├── walletService.spec.ts
└── utils/
    └── apiResponse.spec.ts
    └── caseConverter.spec.ts
    └── helpers.spec.ts
    └── validator.spec.ts
```
## 🤝 Contributing

Contributions are welcome and appreciated! Here’s how you can help:

### 🚀 Getting Started

1. Fork the repo

2. Clone the repo

3. Create your feature branch

```bash
git checkout -b feature/your-feature-name
```
4. make your changes and Commit your changes

```bash
git commit -m "Add your feature description"
```
5. Push to the branch 

```bash
git push origin feature/your-feature-name
```
6. Open a **Pull Request** with a clear description of your changes

✅ **Guidelines**
- Follow consistent code formatting (TypeScript best practices).

- Add comments and update documentation if needed.

- Write or update tests when adding features or fixing bugs.

## 🪪 License
This project is licensed under the **MIT License**.  
See the [MIT License](https://opensource.org/licenses/MIT) for more information.


## Author / Acknowledgements
👤 **Author**

Eneh Kelvin Chukwuemeka
Developer & Maintainer of Demo-Credit
[GitHub](https://github.com/Kelvin-Teck)

Built with ❤️ using Node.js, TypeScript, and MySQL.

**🙌 Acknowledgements**

A Big Thanks to Lendsqr for the Adjutor Karma API for blacklist verification.

Inspired by modern fintech wallet systems and micro-lending architectures.

Special shout-out to the open-source community for continuous inspiration.