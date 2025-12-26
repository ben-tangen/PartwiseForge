# System Architecture

**Author: Ben Tangen**

This document provides a high-level architecture overview of Partwise Forge, illustrating the interaction between frontend, backend, AI services, database, and analytics modules. It complements the high-level and low-level design documents.

---

## 1. Architectural Overview

Partwise Forge uses a modular, layered architecture to ensure maintainability, scalability, and security. It separates concerns into distinct layers:

* **Frontend**: Vite + JSX, Tailwind + DaisyUI for UI/UX
* **Backend**: Django REST Framework handling business logic, model interactions, and API endpoints
* **AI Services**: LLaMA 3.1 LLM with LangChain for current data integration
* **Database Layer**: Relational database accessed via Django ORM
* **Analytics Layer**: User and Admin analytics computation and storage
* **Payment Processor**: Stripe for subscription and payment handling

---

## 2. Architectural Layers

### 2.1 Frontend Layer

**Responsibilities:**

* Render inventory, builds, listings, sales, and analytics pages
* Handle user input and validation
* Display AI suggestions for builds and listings
* Interactive dashboards for user and admin

**Components:**

* Inventory Page
* Build Page
* AI Suggestion Panel
* Listing & Sale Page
* Finance & Analytics Dashboard

**Technology:**

* Vite, JSX, Tailwind, DaisyUI

---

### 2.2 Backend Layer

**Responsibilities:**

* API endpoints for CRUD operations
* Authentication and authorization
* Business logic for builds, parts, listings, sales, and AI interaction
* Analytics computation service

**Components:**

* Django Models (from models.md)
* Services Layer (InventoryService, BuildService, AIService, AnalyticsService)
* REST API Layer

---

### 2.3 AI Services Layer

**Responsibilities:**

* LLaMA 3.1 model for build optimization, listing generation, and tech chatbot
* Integration with LangChain for current data
* Token usage tracking and monthly usage limits
* Provide AI suggestions only; user confirmation required

**Components:**

* Build Optimization Engine
* Listing Generation Service
* AI Tech Chatbot
* Token Usage Tracker

---

### 2.4 Database Layer

**Responsibilities:**

* Store user, part, build, listing, sale, AI usage, and analytics data
* Maintain referential integrity and archival records
* Provide efficient queries for analytics and AI modules

**Components:**

* Users Table
* Parts Table
* Builds Table
* Listings Table
* Sales Table
* AI Usage Table
* Analytics Tables

**Technology:**

* Relational Database via Django ORM

---

### 2.5 Analytics Layer

**Responsibilities:**

* Compute and store user-level and admin-level analytics
* Provide aggregated data for dashboards
* Support time-based reports: daily, weekly, monthly, yearly

**Components:**

* UserAnalyticsService
* AdminAnalyticsService
* Scheduled computation module

---

## 3. Component Interaction

```
[Frontend UI] <--REST--> [Backend Services] <---> [Database]
       |                    |
       |                    --> [AI Services: LLaMA 3.1 + LangChain]
       |
       --> [Analytics Engine]
```

**Flow:**

1. User interacts with frontend UI
2. Backend validates requests, performs business logic
3. AI Service provides suggestions (LLaMA 3.1 via LangChain)
4. Analytics service computes insights and stores results
5. Frontend displays updates for user confirmation

---

## 4. Security Considerations

* Role-based access control (user vs admin)
* AI usage limitations and token tracking
* Data isolation per user
* Admin-only analytics and global stats
* No autonomous AI actions
* Payment security: use Stripe Checkout and webhooks; validate webhook signatures using `STRIPE_WEBHOOK_SECRET`, and avoid storing raw card data on the server (use tokens/Checkout flows).

---

## 5. Scalability and Extensibility

* Modular services allow independent scaling of AI, backend, and analytics
* Frontend designed for web first, portable to mobile
* Future support for team/org accounts
* Expandable compatibility rules
* Optional marketplace integration

---

## 6. Summary

This architecture ensures:

* Clear separation of concerns
* Scalable and maintainable modules
* Secure user data and controlled AI usage
* Future expansion with minimal impact on existing modules
