# Bagpackers Developers Platform

Welcome to the flagship enterprise platform for **Bagpackers Developers**—a global-grade AI automation and custom software engineering suite. This codebase integrates a high-performance Next.js frontend, a secure Spring Boot API gateway, and a managed Supabase PostgreSQL relational database.

---

## 🗂️ Monorepo Structure

```text
├── backend/                     # Spring Boot 3.3 (Java 17) API Gateway
│   ├── src/                     # Core MVC source files and JUnit tests
│   └── pom.xml                  # Maven dependency manager
├── database/                    # Persistence tier definitions
│   ├── schema.sql               # PostgreSQL DDL, Indexes, Triggers, & RLS Policies
│   └── seed.sql                 # Portfolio case studies and default logs
├── frontend/                    # Next.js 16 (App Router) client app
│   ├── src/                     # React Server Components & Framer Motion layout views
│   │   ├── app/                 # Nested routing paths (services, sandbox, admin, about, contact)
│   │   ├── components/          # Reusable components (Navbar, ROI Calculator, IDP Sandbox)
│   │   └── utils/               # Telemetry, dynamic API URL, and security sanitizers
│   └── package.json             # NPM dependencies
└── README.md                    # Root project documentation
```

---

## 🚀 Key Feature List

1. **Light/Dark Hybrid Theme**: High-contrast editorial style canvas (`#FAFAFA` background, `#09090B` charcoal typography) for marketing and portfolio panels, combined with rich zinc dark containers for administrative dashboards and FAQ blocks.
2. **Floating capsule Navbar**: Centered glassmorphic capsule menu featuring a 3-column Services mega-dropdown with double-bezel cards, fully responsive with nested mobile accordions.
3. **Interactive ROI Calculator**: A real-time client ROI estimator with adjustable sliders that dynamically projects engineering savings and compiles them into lead capture payloads.
4. **Intelligent Document Processing (IDP) Sandbox**: An interactive OCR-to-SQL compiler simulator demonstrating how physical logs and unstructured lists compile to structured database schemas safely.
5. **Secure Admin Dashboard**: Restricted client-side routes powered by **Stateless JWT Authentication** (15-minute short-lived access tokens and 7-day secure `HttpOnly` refresh cookies) enabling administrative staff to manage inquiries, check conversion telemetry, and configure dynamic metadata with Google Search and Social Open Graph sharing previews.
6. **Vercel Server Actions**: Securely bridges all client-to-backend operations (contact forms, lead submissions, sandbox execution, and administrative panel requests) via Next.js Server Actions, shielding backend API URLs and credentials from client inspection.
7. **Robust Rate-Limiting**: Enforces token-bucket rate limits (`Bucket4j`) on all public endpoints to protect processing servers from flood requests.

---

## 🛠️ Local Setup & Configuration

### 1. Database Provisioning (Supabase)
Create a PostgreSQL instance on Supabase and run the initialization scripts:
* Run [database/schema.sql](file:///Users/apple/Documents/bagpackersdevelopers/database/schema.sql) in your SQL editor.
* Run [database/seed.sql](file:///Users/apple/Documents/bagpackersdevelopers/database/seed.sql) to load dummy portfolio case studies.

### 2. Run Backend API (Spring Boot)
Ensure you have **Java 17** and **Maven** installed:
```bash
cd backend
mvn clean test             # Run the test suite
mvn spring-boot:run        # Run local server at http://localhost:8080
```

### 3. Run Frontend Client (Next.js)
Ensure you have **NodeJS 18+** installed:
```bash
cd frontend
npm install                # Install packages
npm run dev                # Run local hot-reloading dev server at http://localhost:3000
npm run build              # Compile optimized production bundle
```

---

## 🌐 Production Environment Variables

### A. Next.js Frontend (Vercel)
Configure the following vars in your project dashboard:
* `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Spring Boot API (e.g., `https://api.bagpackers.dev`).
* `API_BASE_URL`: Same as above (used during build-time dynamic static page generation).

### B. Spring Boot Backend (Render / AWS)
Configure the following environment variables:
* `SPRING_DATASOURCE_URL`: PostgreSQL JDBC connection string (e.g. `jdbc:postgresql://<db-host>:5432/postgres?sslmode=require`).
* `SPRING_DATASOURCE_USERNAME`: Supabase username (usually `postgres`).
* `SPRING_DATASOURCE_PASSWORD`: Supabase password.
* `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., `https://bagpackers.dev,https://www.bagpackers.dev`).
* `SPRING_SECURITY_ADMIN_TOKEN`: A secure token used to access admin dashboard stats.

---

## 🔒 Security Specifications
* **Privileged Function Isolation**: SQL trigger functions are restricted with `SECURITY INVOKER SET search_path = pg_catalog` to prevent search path hijackings.
* **Row-Level Security (RLS)**: Active RLS schemas protect client data and administrative database structures from unauthenticated requests.
* **XSS Protection**: Automatic input validation and HTML escaping protect enquiries and sandbox execution parameters.
* **Telemetry Anonymizer**: Google Analytics client hooks recursively scan event arguments to redact credential patterns or email addresses before sending.
