# Jotink



## Description

**Jotink**  JotInk is a modern, secure, and efficient note-taking API service designed to help users capture thoughts, ideas, tasks, and important information seamlessly. Built with a robust Node.js and TypeScript backend, and powered by MongoDB, JotInk provides users with a simple yet powerful platform for creating, organizing, and retrieving notes—anytime, anywhere.


## Features 

- [x] CRUD operations for user and Notes
- [x] Authentication & Authorization (Faux)
- [x] Input validation (Joi)
- [x] MongoDB integration
- [x] Rate limiting and logging

## Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **MongoDB** 
- **Joi** for input validation
- **Mongoose ODM** 

## Getting Started

### Prerequisites

- Node.js LTS version
- npm or yarn
- MongoDB running locally or via a service

### 1. Clone The Repo

```bash
git clone https://github.com/Kelvin-Teck/jotink.git
cd jotink
```
### 2. Install the Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory with the following:

```env
# ──────── Environment Configuration ────────
NODE_ENV=production             # Set to 'development' or 'production'
PORT=8100                       # Port your application will run on

# ──────── Database Configuration ────────

MONGO_URI_DEVELOPMENT=mongodb://localhost:27017/jotink
MONGO_URI_TEST=mongodb://localhost:27017/jotink
MONGO_URI_PRODUCTION=mongodb+srv://<your_username>:<your_password>@jotink.bj2vnds.mongodb.net/?retryWrites=true&w=majority&appName=jotink
MONGO_DB_NAME=jotink

# ──────── JWT & Security ────────
ACCESS_TOKEN_SECRET=your-super-secure-access-token-secret-here
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-here

ACCESS_TOKEN_EXP=2h            # Token lifespan (e.g., 15m, 2h)
REFRESH_TOKEN_EXP=7d           # Token lifespan (e.g., 7d, 30d)
JWT_ISSUER=jotink-app
JWT_AUDIENCE=jotink-app-users

```

### 5. Start the Development Server
```bash
npm run dev
```
The server should now be running on `http://localhost:<your_specified_port>`


## API Reference

You can explore and test all endpoints using our Postman documentation:

👉 [Jotink API Postman Docs](https://documenter.getpostman.com/view/30059286/2sB34ZpiyC)

## 🗂️ Project Structure

```bash
Jotink/
├── src/
│   ├── config/            # environment configurations   
│   ├── controllers/       # Route handlers for each feature
|   |-- helpers/           # Helper Functions
|   |-- logs/              # Error logs
|   |-- errors/            # Error Handlers Definition (e.g. BAD REQUEST, FORBIDDEN REQUEST,etc.) 
|   |-- repositories/      # Database Interaction 
│   ├── middlewares/       # Custom middleware (e.g., auth, error handler)
│   ├── models/            # Mongoose models
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic and integrations
│   ├── utils/             # Helper functions
|   |-- validators/        # Validations (e.g. input validation)
|   |    |-- schemas/      # Input validation Schemas
│   ├── types/             # TypeScript type definitions
|   |-- app.ts             # Express framework initailization, middleware setup, etc.  
│   └── index.ts           # Application entry point
│
|
├── .env                   # Environment variable definitions
├── .gitignore             # Git ignored files
├── nodemon.json           # Nodemon configuration
├── package-lock.json      # Packages Lock File    
|-- package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Project documentation


```

## Contributing

Contributions are welcome and appreciated! Here’s how you can help:

### Getting Started

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
Developer & Maintainer of Jotink
[GitHub](https://github.com/Kelvin-Teck)

Built with ❤️ using Node.js, TypeScript, and MongoDB.

**Acknowledgements**

A Big Thanks to everyone for their support.
Special shout-out to the open-source community for continuous inspiration.