# Casa Steph Iberico

Modern full-stack e-commerce platform for premium Iberian charcuterie & fromages, developed for an artisanal business with local delivery service in the Metz region, France.

**Repository:** [github.com/Flavionz/casa-steph-iberico](https://github.com/Flavionz/casa-steph-iberico)

---

## Overview

Casa Steph Iberico is a production-ready e-commerce application built for an artisanal boutique specializing in authentic Iberian gourmet products. The platform addresses specific business requirements including local delivery logistics, manual payment flow, transactional email notifications, inventory management, and a full administrative interface.

**Note:** This is an active client project. The repository is public for portfolio purposes with client authorization, showcasing real-world development practices and problem-solving approaches.

---

## Technical Architecture

### Frontend Stack
- React 18 with TypeScript for type-safe component development
- React Router v6 for client-side routing and navigation
- Tailwind CSS for responsive, utility-first styling
- Context API for global state management (cart, auth)
- Axios for API communication
- Vite as build tool and development server

### Backend Stack
- Node.js with Express 5 framework
- Prisma ORM for type-safe database operations
- PostgreSQL 16 for production-grade data persistence
- JWT-based authentication (7-day tokens) with bcryptjs password hashing
- Nodemailer for transactional emails (SMTP)
- Cloudinary for cloud image storage and delivery
- PDFKit for invoice PDF generation
- Helmet for HTTP security headers
- express-rate-limit for auth endpoint protection
- RESTful API architecture

### Infrastructure
- **Frontend deploy:** Vercel (Hobby plan)
- **Backend deploy:** Render (free tier — Starter for production)
- **Database:** Neon PostgreSQL (serverless, EU West 2 London)
- **Local dev:** Docker Compose (PostgreSQL + PgAdmin)
- **Image storage:** Cloudinary

---

## Core Features

### Customer-Facing Interface
The platform provides a seamless shopping experience with product browsing, category filtering, shopping cart, and a multi-step checkout process. The design is fully responsive across mobile, tablet, and desktop with a premium dark-themed aesthetic.

A key business feature is the **postal code validation system** that verifies delivery eligibility based on geographic proximity to Metz, reflecting the owner's personal delivery model across two defined delivery zones.

### Payment Flow (SumUp Manual Link)
The payment process is deliberately manual to suit the business model:
1. Customer places an order and selects a contact preference (email or WhatsApp)
2. The owner (Pitt) receives an email notification
3. Pitt generates a SumUp payment link and pastes it into the admin dashboard
4. If email preference: the system automatically sends the payment link to the customer
5. If WhatsApp preference: Pitt copies the link and sends it manually
6. Pitt confirms payment and updates the order status through fulfillment

### Order Status Workflow
`en_attente` → `lien_envoye` → `paye` → `en_preparation` → `pret_pour_livraison` → `livre` / `annule`

### Authentication & Account Management
- JWT-based login and registration with role-based access (admin / customer)
- Secure password reset via one-time email token (1-hour expiry, single use)
- User profile management with persistent delivery address
- Order history with detail page per order

### Administrative Interface
The admin dashboard provides full operational control:
- Product catalog management (CRUD + image upload via Cloudinary)
- Real-time inventory tracking
- Order management with status updates and delivery time slot selection
- Payment link input per order (triggers automatic email if preference is email)
- User management
- Downloadable PDF invoice per order (available once paid or delivered)

### Email Notifications (Nodemailer)
- Welcome email on registration
- Order confirmation with order summary
- Payment link email with recap, CTA button, and next steps
- Order ready for pickup/delivery notification
- Order delivered confirmation
- Password reset link

### Security
- JWT secret: no hardcoded fallback — server crashes at boot if missing
- Rate limiting on all auth endpoints (10 req / 15 min)
- One-time use password reset tokens
- Order total recalculated server-side from DB prices (client total ignored)
- Minimum password length: 8 characters
- Helmet: XSS protection, clickjacking prevention, MIME sniffing, HSTS

---

## Database Design

The application uses a relational schema managed with Prisma (`db push`, no migration files):

**Users** — authentication credentials (hashed), role, delivery address, postal code, reset token (one-time use).

**Products** — name, description, price, stock, Cloudinary image URL, category relationship.

**Categories** — logical groupings for the product catalog.

**Orders** — user relationship, items (JSON), delivery address, contact preference, SumUp link, payment status, order status, timestamps.

**OrderItems** — individual line items linked to orders and products.

**FeaturedProducts** — curated product selection displayed on the homepage storefront.

---

## Delivery Zones

| Zone | Postal Codes | Fee |
|------|-------------|-----|
| Zone 1 (≤7 km) | 57000, 57050, 57070, 57140, 57155, 57160, 57950 | Free |
| Zone 2 (7–15 km) | 57130, 57170, 57245, 57420, 57530, 57645, 57685 | €5 (free for orders ≥ €100) |

Minimum order: €30

---

## Branch Strategy

| Branch | Purpose                                                      |
|--------|--------------------------------------------------------------|
| `main` | Active branch — SumUp manual payment flow (production-ready) |
| `v1.0.0` (tag) | Stripe integration — preserved for future upgrade                  |

---

## Project Status

Feature-complete and staging-deployed. Awaiting client go-live decision (custom domain + production SMTP credentials).

**Staging:**
- Frontend: [casa-steph-iberico.vercel.app](https://casa-steph-iberico.vercel.app)
- Backend: [auberge-backend.onrender.com](https://auberge-backend.onrender.com)

---

## Technical Highlights

- Full-stack TypeScript on the frontend, JavaScript on the backend
- Serverless PostgreSQL via Neon with Prisma ORM
- JWT authentication with one-time password reset flow
- Manual payment flow with SumUp integration (no webhook dependency)
- Transactional email system with HTML templates (Nodemailer)
- Cloud image management via Cloudinary
- PDF invoice generation with PDFKit (TVA 20%)
- Two-zone delivery validation via postal code
- Real-time inventory tracking
- Security hardened: Helmet, rate limiting, server-side price validation
- Docker Compose for local development parity

---

## Developer

**Flavio Terenzi**
Full-Stack Developer

[GitHub](https://github.com/Flavionz) | [LinkedIn](https://www.linkedin.com/in/flavioterenzi/)

---


