# M2N-Booking Project Documentation

Welcome to the **M2N-Booking** documentation! This guide is designed to give you a complete, human-readable overview of the project's architecture, technologies, features, and file structure. Whether you are a new developer joining the team or just exploring the codebase, this document will help you understand how everything connects and works together.

---

## 🌟 Project Overview

M2N-Booking is a comprehensive, full-stack hotel and property booking system. Instead of being a single monolithic application, it is divided into **three distinct portals** to serve different types of users efficiently:

1. **User Portal (`frontend` & `backend`)**: The public-facing website where guests can browse hotels, view rooms, and make reservations. It features a highly interactive and animated UI.
2. **Admin Portal (`admin/frontend` & `admin/backend`)**: The management dashboard for Superadmins and Hotel Admins to manage hotels, room categories, receptionists, and overall bookings.
3. **Reception Portal (`reception/frontend` & `reception/backend`)**: A dedicated dashboard for hotel receptionists to handle day-to-day operations like check-ins, check-outs, and managing walk-in or online bookings.

---

## 🛠️ Technology Stack

The project is built using the **MERN-like** stack (PostgreSQL, Express, React, Node.js) powered by **TypeScript** for type safety across both frontend and backend.

### Frontend Technologies
- **React (v19)**: The core UI library.
- **Vite**: Ultra-fast build tool and development server.
- **TypeScript**: For robust, type-safe code.
- **Tailwind CSS (v4)**: Utility-first styling for beautiful, responsive designs.
- **React Router DOM**: For client-side routing.
- **Zustand**: A small, fast state management solution (used heavily in Admin and Reception portals).
- **Framer Motion & GSAP**: For complex, smooth animations (User Portal).
- **Three.js / React Three Fiber**: For rendering 3D elements in the UI (User Portal).
- **Axios**: For making HTTP requests to the backend APIs.

### Backend Technologies
- **Node.js & Express.js**: The core server framework.
- **TypeScript & tsx**: For writing and executing typed backend code.
- **PostgreSQL & Prisma**: SQL database hosted on **Supabase**, interacted with using the Prisma ORM.
- **JWT (JSON Web Tokens)**: For secure user authentication and authorization.
- **Bcryptjs**: For securely hashing passwords.
- **Cloudinary & Multer**: For handling image uploads (e.g., hotel pictures, room images).
- **Nodemailer**: For sending automated emails (booking confirmations, OTPs).
- **Razorpay**: Integrated payment gateway for booking transactions.
- **Security Middleware**: `helmet`, `express-rate-limit`, and `express-xss-sanitizer` to protect against common web vulnerabilities.

---

## ✨ Key Features

### 1. User Application
- **Interactive UI**: Stunning, animated interface with 3D elements for a premium feel.
- **Hotel Browsing**: Browse available hotels, view galleries, and explore amenities (Dining, Spa, Events).
- **Room Booking**: Real-time room availability, detailed room descriptions, and seamless booking flow.
- **Authentication**: Email/Password login and Google OAuth integration.
- **Payments**: Integrated Razorpay for secure checkout.
- **User Dashboard**: Manage profiles and view past/upcoming bookings.

### 2. Admin Application
- **Role-based Access**: Superadmin (manages all) and Hotel Admin (manages specific hotels).
- **Hotel Management**: Add, edit, or remove hotels and their details/images.
- **Room Category Management**: Define global room categories and assign them to specific hotels.
- **Staff Management**: Create and manage Receptionist accounts for different branches.
- **Booking Oversight**: View and manage all bookings across the platform.

### 3. Reception Application
- **Live Booking Management**: View incoming bookings for their assigned hotel.
- **Check-in / Check-out**: Process guest arrivals and departures.
- **QR Code Integration**: Generate and verify QR codes for quick booking validation.
- **Room Status**: Monitor which rooms are occupied, available, or require maintenance.

---

## 📂 Directory Structure & File Descriptions

The root of the repository is neatly divided into the three main portals. Here is a breakdown of what you will find inside.

### `backend/` (User API Server)
Handles all business logic for the public user portal.
- **`src/index.ts`**: The entry point of the server. Configures Express and registers routes.
- **`src/utils/prisma.ts`**: The Prisma client instance.
  - `User.ts`: Customer data and authentication details.
- **`src/routes/`**: API endpoints.
  - `authRoutes.ts`: Login, register, Google Auth, and password reset endpoints.
  - `bookingRoutes.ts`: Endpoints to create, fetch, and manage user bookings.
- **`src/controllers/`**: Contains the actual logic executed when a route is hit.
- **`src/middlewares/`**: Security, authentication verification (JWT checking), and error handling functions.
- **`package.json`**: Lists backend dependencies (Express, Prisma, Razorpay, etc.).

### `frontend/` (User Web App)
The beautiful, animated React application for customers.
- **`src/App.tsx`**: The main React component. Sets up routing (Home, About, Hotels, Rooms, Booking, Login) and global animations (Framer Motion / GSAP).
- **`src/pages/`**: Individual page components.
  - `Home.tsx`, `About.tsx`, `Contact.tsx`: Standard informational pages.
  - `Hotels.tsx`, `HotelDetail.tsx`, `Rooms.tsx`: Pages to explore properties and rooms.
  - `Login.tsx`, `Register.tsx`, `MyBookings.tsx`: User account pages.
- **`src/components/`**: Reusable UI parts.
  - `Navbar.tsx`, `Footer.tsx`: Global layout elements.
  - `LoadingScreen.tsx`, `PageTransition.tsx`, `CustomCursor.tsx`: Enhances the visual experience.
- **`src/lib/`**: Helper functions and utilities.
- **`package.json`**: Lists frontend dependencies (React, Three.js, GSAP, Tailwind).

### `admin/backend/` (Admin API Server)
The secure backend for administrators.
- **`src/routes/`**: 
  - `adminRoutes.ts`: Routes for managing staff and system settings.
  - `hotelRoutes.ts`: Endpoints for CRUD operations on hotels (with image upload via Cloudinary).
  - `globalCategoryRoutes.ts`: Managing room templates.

### `admin/frontend/` (Admin Dashboard)
The React application used by administrators.
- **`src/App.tsx`**: Manages routing and an auto-logout feature (logs out after 15 minutes of inactivity for security).
- **`src/pages/AdminDashboard.tsx`**: The main hub where admins see metrics and manage the system.
- **`src/pages/Login.tsx`**: Secure login portal for admins.
- **`src/store/authStore.ts`**: Uses Zustand to keep track of the currently logged-in admin.
- **`src/components/`**: Dashboard widgets, forms (like `RoomCategoryForm.tsx`), and data tables.

### `reception/backend/` (Reception API Server)
The backend tailored for hotel receptionists.
- **`src/routes/receptionistRoutes.ts`**: Endpoints specific to reception duties (validating bookings, updating check-in status).
- **`src/utils/`**: Helper functions, including QR code generation for booking tickets.

### `reception/frontend/` (Reception Dashboard)
The React application used at the front desk.
- **`src/App.tsx`**: Sets up routing for the Receptionist dashboard, distinct from the Admin dashboard.
- **`src/pages/AdminDashboard.tsx`**: (Often reused/adapted for reception) Displays the daily arrivals, departures, and current room status.

### Root Files
- **`update-ports.js`**: A utility script used to configure or update the ports across the different microservices for local development.
- **`.gitignore`**: Ensures that sensitive files (`node_modules`, `.env`) are not pushed to version control.

---

## 🚀 Getting Started for Developers

If you are just joining the project, here is how you navigate the development environment:

1. **Environment Variables**: Each backend (`backend/`, `admin/backend/`, `reception/backend/`) and frontend will have its own `.env` file (or use the root one for DB). Ensure these are set up with your Supabase `DATABASE_URL`, JWT secrets, Cloudinary credentials, and Razorpay keys.
2. **Installation**: You will need to run `npm install` inside each of the 6 main directories (3 frontends, 3 backends).
3. **Running the Apps**: 
   - Backend servers typically run via `npm run dev` (using `tsx watch`).
   - Frontend apps run via `npm run dev` (using Vite).
4. **State Management**: When working in the Admin or Reception portals, remember that **Zustand** is used for global state (like user sessions). In the User portal, state is mostly localized or managed via standard React context.
5. **Styling**: We use **Tailwind CSS v4**. Avoid writing custom CSS unless absolutely necessary; use Tailwind utility classes directly in the components.

This modular architecture ensures that a bug or heavy traffic on the public User Portal does not bring down the critical Admin or Reception operational systems. Happy coding!
