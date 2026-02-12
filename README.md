# Government Audit Management System

A secure and transparent platform for managing government audits, facilitating seamless collaboration between Public users, Accountants, and Administrators.

**Architecture:** Modular Monolith

## 📂 Project Structure

```text
root/
├── backend/                  # Node.js & Express API
│   ├── src/
│   │   ├── modules/          # Feature-based improvements
│   │   │   ├── admin/        # Admin controller & routes
│   │   │   ├── audits/       # Audit management logic
│   │   │   ├── auth/         # Authentication & User models
│   │   │   └── shelf/        # "My Shelf" functionality
│   │   ├── shared/           # Shared utilities
│   │   │   ├── logger/       # Winston file-based logger
│   │   │   └── middleware/   # Auth, Error Handling, Rate Limiters
│   ├── app.js                # Express app configuration
│   └── server.js             # Server entry point
│
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Dashboards, Layout)
│   │   ├── context/          # React Context (Auth State)
│   │   ├── pages/            # Page-level components (Login, Register)
│   │   └── utils/            # API helpers (Axios config)
│   └── vite.config.js        # Vite configuration
│
└── docker-compose.yml        # Container orchestration
```

## 🛠️ Technology Stack

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Logging:** Winston (File-based logging)

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios

## 🔒 Security Implementation

Security is a core pillar of this application. We have implemented the following measures:

1.  **Rate Limiting:**
    *   Login endpoints are protected against brute-force attacks.
    *   **Policy:** 5 attempts per 5 minutes per IP address.

2.  **Date Integrity & Injection Protection:**
    *   **NoSQL Injection:** `express-mongo-sanitize` cleanses all incoming requests to prevent operator injection.
    *   **XSS Protection:** `helmet` sets secure HTTP headers.
    *   **Validation:** Strict Mongoose schemas ensure data conforms to expected types and formats.

3.  **Authentication & Authorization:**
    *   **Stateless:** Fully stateless JWT authentication.
    *   **Password Security:** Passwords are hashed using `bcryptjs` before storage.
    *   **RBAC:** Middleware ensures users can only access routes permitted for their role (e.g., only Admins can delete audits).
    *   **Uniqueness:** Strict enforcement of unique usernames and emails to prevent identity conflicts.

4.  **Error Handling:**
    *   Centralized error handling ensures no sensitive stack traces are leaked to the client.
    *   User-friendly error messages (e.g., "Incorrect email or password" instead of raw database errors).


## �🚀 Getting Started

For detailed installation and setup instructions, please refer to [SETUP.md](./SETUP.md).

### Quick Start
1.  **Backend:** `npm install` -> `npm run dev` (Port 5000)
2.  **Frontend:** `npm install` -> `npm run dev` (Port 5173)

---

