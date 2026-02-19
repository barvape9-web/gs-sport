# GS • Sport — Premium Sportswear eCommerce

A modern, full-stack eCommerce platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Three.js**. Features glassmorphism UI, 3D animations, a full admin panel, and Prisma + PostgreSQL backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS |
| Animation | Framer Motion |
| 3D Graphics | React Three Fiber + @react-three/drei |
| Charts | Recharts |
| State | Zustand (persistent) |
| Auth | jose (JWT) + bcryptjs |
| Database | PostgreSQL + Prisma ORM |
| Forms | react-hook-form + zod |
| Notifications | react-hot-toast |
| Icons | lucide-react |

---

## Features

- **Premium UI** — Glassmorphism design, gradient text, 3D floating orbs
- **Welcome Animation** — Full-screen intro on first visit
- **Men''s & Women''s Collections** — Gender-segmented product browsing
- **Shopping Cart** — Persistent drawer with quantity controls
- **JWT Auth** — HTTP-only cookie sessions, register/login/logout
- **User Dashboard** — Order history, profile, saved items
- **Admin Panel** — Analytics, product CRUD, order management, user management, live theme customization
- **Checkout Flow** — Multi-step: Shipping ? Payment ? Confirmation
- **Dynamic Theming** — Live color pickers, preset themes, dark/light mode

---

## Getting Started

### 1. Install Dependencies
```
npm install
```

### 2. Set Up Environment
```
cp .env.example .env
```
Edit `.env` with your PostgreSQL connection string and a strong JWT secret.

### 3. Set Up Database
```
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Run Dev Server
```
npm run dev
```
Open http://localhost:3000

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@gs-sport.com | admin123 |
| User | user@gs-sport.com | user123 |

---

## Scripts

| Command | Description |
|---|---|
| npm run dev | Start dev server |
| npm run build | Production build |
| npm run db:generate | Regenerate Prisma client |
| npm run db:migrate | Run migrations |
| npm run db:seed | Seed demo data |
| npm run db:studio | Prisma Studio GUI |
| npm run db:reset | Reset database |

---

## API Routes

- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- GET/POST /api/products
- GET/PUT/DELETE /api/products/[id]
- GET/POST /api/orders
- GET /api/orders/user
- GET/PUT /api/orders/[id]
- GET /api/admin/analytics
- GET /api/admin/users
- PUT/DELETE /api/admin/users/[id]

---

## Project Location

`c:\Users\user\Desktop\New folder\gs-sport`
