# Low-Level Design

**Author: Ben Tangen**

This document details the low-level design of Partwise Forge, including module interactions, class responsibilities, data flow, and system behavior. It builds upon the high-level design and maps the architecture to concrete software components.

---

## 1. Architecture Overview

The system follows a modular, service-oriented architecture with clearly defined boundaries between:

* Frontend (Vite + JSX + Tailwind + DaisyUI)
* Backend (Django REST Framework)
* AI Services (LLaMA 3.1 via LangChain)
* Database (Django ORM + relational database)
* Analytics Engine

All modules communicate primarily through REST APIs or internal function calls within Django services.

---

## 2. Module Breakdown

### 2.1 Frontend Module

**Components:**

* Inventory Pages
* Build Pages
* AI Interaction Panels
* Listings & Sales Pages
* Finance & Analytics Dashboards

**Responsibilities:**

* Render UI components with Tailwind + DaisyUI styling
* Handle user input and validation
* Call backend API endpoints for CRUD operations
* Render AI suggestions and analytics data

**Notes:**

* Vite + JSX ensures fast development and hot reload
* UI designed to be portable to mobile devices

---

### 2.2 Backend Module

**Components:**

* Django REST API endpoints
* Model layer (models.md)
* Business logic services
* AI interaction service
* Analytics computation service

**Responsibilities:**

* Expose CRUD endpoints for users, parts, builds, listings, and sales
* Enforce authentication and authorization
* Maintain referential integrity
* Process AI requests and return results
* Compute financial and analytics data on demand

**Notes:**

* Service layer separates business logic from models
* Each module can be tested independently

---

### 2.3 AI Services

**Components:**

* LLaMA 3.1 Model via LangChain
* Token usage tracker
* Chatbot for tech questions
* Build optimization engine
* Listing generation service

**Responsibilities:**

* Suggest optimized builds
* Generate copy-ready listing text
* Answer tech-related user queries
* Limit token usage per subscription

**Notes:**

* All outputs are suggestions; user confirmation required
* LangChain enables AI to pull current data dynamically
* AI has read-only access to inventory, builds, and relevant analytics

---

### 2.4 Analytics Engine

**Components:**

* User Analytics Service
* Admin Analytics Service
* Scheduled computation module (optional)

**Responsibilities:**

* Compute stats per time period: daily, weekly, monthly, yearly
* Aggregate user and admin metrics
* Store analytics results for fast retrieval

**Notes:**

* Admin analytics include total users, premium users, parts added, builds created, and total profits
* Computation can be triggered manually or scheduled

---

### 2.5 Database Layer

**Components:**

* Django ORM models (from models.md)
* Tables: users, parts, builds, listings, sales, AI usage, analytics

**Responsibilities:**

* Store persistent data with referential integrity
* Maintain historical archives for parts and builds
* Provide query interfaces for analytics and AI modules

**Notes:**

* Use indexes on frequently queried fields (user_id, build_id, timestamps)
* Archival tables keep historical data without interfering with active operations

---

## 3. Data Flow

1. User interacts with frontend UI → frontend sends API request to backend.
2. Backend validates request, updates models, triggers AI or analytics if needed.
3. AI module receives structured request → LLaMA 3.1 via LangChain → returns suggestion.
4. Backend saves AI suggestions and/or computed analytics.
5. Frontend displays results to the user, who confirms or edits.
6. Sales and listing updates propagate to finance and analytics modules.

---

## 4. Component Interactions

* **Inventory ↔ Build**: Parts assigned to builds, updates state (used/not used)
* **Build ↔ AI**: Optimization suggestions and hypothetical builds
* **Build ↔ Listing ↔ Sale**: Listing generated for a build; sale references build for profit computation
* **Analytics ↔ Backend**: Receives data from models; stores and retrieves aggregated stats
* **AI ↔ LangChain**: Pulls current data to improve suggestions and chatbot answers

---

## 5. Security & Constraints

* Role-based access control (user vs admin)
* User data isolation
* AI token usage limits per month
* Admin analytics strictly for development insight
* No automated decisions without user confirmation

---

## 6. Low-Level Design Notes

* Services are modular and testable independently
* Backend is split into: models, services, APIs, AI interfaces
* Frontend is component-driven using JSX + Tailwind/DaisyUI
* AI outputs are ephemeral unless confirmed by user
* All archival data stored separately to avoid cluttering active operations

---

## 7. Future Considerations

* Mobile app adaptation
* Expanded compatibility rule set
* Integration with external marketplaces
* Team or organization account support
* Optional scheduled analytics recomputation

---

## 8. Summary

The low-level design maps high-level modules to concrete Django, frontend, and AI components. It ensures:

* Clear responsibilities per module
* Data flow integrity
* User-controlled AI outputs
* Scalable and maintainable architecture for future expansion
