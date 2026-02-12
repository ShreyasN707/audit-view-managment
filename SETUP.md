# 🚀 Getting Started

Follow these instructions to set up the Government Audit Management System locally.

## Prerequisites
*   **Node.js**: v18 or higher
*   **MongoDB**: Local installation or MongoDB Atlas Connection URI
*   **Git**: For cloning the repository

## Installation

### 1. Clone the Repository
```bash
git clone <repository_url>
cd audit-management-system
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**Configuration (.env):**
Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/audit_system
JWT_SECRET=your_super_secret_key_change_this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Start the backend server:
```bash
npm run dev
```
*The server will start on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm run dev
```
*The frontend will start on `http://localhost:5173`*

## Accessing the Application

*   **Public Portal:** Open [http://localhost:5173](http://localhost:5173) to view audits and register.
*   **Admin Login:** Use the credentials defined in your `.env` file (Default: `admin` / `admin123`).
*   **Accountant Access:** Admins must create Accountant accounts first via the Admin Dashboard.
