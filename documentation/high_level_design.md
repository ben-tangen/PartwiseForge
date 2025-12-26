# High-Level Design

**Author: Ben Tangen**

## 1. Overview

Partwise Forge is a web-based application designed to help users manage PC parts inventory, assemble builds, optimize profitability, generate listings, and analyze financial and operational data. The system integrates optional AI assistance while ensuring all final decisions remain under user control.

The architecture prioritizes:

* Clear separation of concerns
* Scalability for future features (teams, mobile app)
* Maintainability and extensibility
* Safe and efficient AI usage, integrating LLaMA 3.1 and current data sources through LangChain
* Modern frontend experience with Vite, JSX, Tailwind, and DaisyUI

---

## 2. System Actors

### Primary Actors

* **User**: Manages parts, builds PCs, tracks finances, optionally uses AI tools
* **Admin**: Has all user capabilities plus access to platform-wide analytics and maintenance tools

### Secondary Actors

* **LLaMA 3.1 LLM via LangChain**: Provides AI suggestions, build optimization, listing generation, and tech chat
* **Analytics Engine**: Computes user and platform statistics

---

## 3. Core System Modules

### 3.1 Authentication & Authorization

Responsibilities:

* User registration and login (Django auth)
* Role-based access control (user vs admin)
* Subscription tier enforcement (free vs premium)

Design Notes:

* Admins bypass premium restrictions
* No shared data between users

---

### 3.2 Inventory Management Module

Responsibilities:

* Create, update, and archive parts
* Track part state implicitly
* Maintain part ownership

Key Design Decisions:

* Parts are never deleted; they are archived
* State is derived, not manually set

---

### 3.3 Build Management Module

Responsibilities:

* Manual build creation
* AI-assisted build suggestions (LLaMA 3.1 + LangChain)
* Hypothetical builds
* Build valuation

Key Design Decisions:

* Builds are flexible and not forced into sales
* Hypothetical part usage is explicitly flagged
* Integration with AI for suggestions must allow user verification before applying changes

---

### 3.4 Compatibility Engine

Responsibilities:

* Validate part compatibility
* Emit warnings and errors

Design Notes:

* Rule-based compatibility for CPU, motherboard, and RAM
* Advisory-only enforcement by default
* Compatibility checks can leverage AI for guidance but remain advisory

---

### 3.5 AI Assistance Module

Responsibilities:

* Build optimization suggestions
* Listing generation
* Tech-focused chatbot
* Integration with current data sources via LangChain

Constraints:

* AI never applies changes automatically
* Monthly usage limits enforced via token tracking
* Outputs are suggestions or copy-ready text
* Supports current inventory, builds, and market data

---

### 3.6 Listing & Sales Module

Responsibilities:

* Internal listing creation
* Sale recording
* Profit computation

Design Notes:

* Listings do not imply sales
* Sales are irreversible

---

### 3.7 Finance Module

Responsibilities:

* Track spending and revenue
* Compute profit
* Display financial insights in user and admin dashboards

---

### 3.8 Analytics Module

Responsibilities:

* User-level analytics
* Admin-level analytics
* Time-based reporting (daily, weekly, monthly, yearly)

Design Notes:

* Analytics stored for quick access
* Admins can recompute analytics on demand

---

## 4. Data Flow Overview

1. User adds parts → Inventory Module
2. Parts assigned to builds → Build Module
3. Compatibility checks run → Compatibility Engine
4. AI suggestions requested → AI Module (LLaMA 3.1 via LangChain)
5. Build listed or sold → Listing & Sales Module
6. Data aggregated → Analytics Module

---

## 5. Technology Stack & Boundaries

### Frontend

* Vite with JSX files
* Tailwind + DaisyUI for styling
* Designed to be portable to mobile platforms

### Backend

* Django REST framework
* Modular service architecture
* API endpoints for frontend and AI modules

### AI Integration

* LLaMA 3.1 LLM
* LangChain for real-time data access
* Usage tracked and limited per user/subscription

### Database

* Relational database (Django ORM)
* Strong referential integrity

---

## 6. Security Considerations

* User data isolation
* Role-based access control
* AI abuse prevention and usage limits
* Non-invasive analytics collection

---

## 7. Scalability & Future Expansion

Planned future considerations:

* Team or organization accounts
* Mobile app port
* Expanded compatibility rules
* Marketplace export integrations

---

## 8. Non-Goals

* Automated selling or posting
* Forced monetization
* Fully autonomous AI decision-making

---

## 9. Summary

The high-level design of Partwise Forge emphasizes user control, clear data ownership, extensible architecture, and safe AI integration with LLaMA 3.1 and LangChain. The system leverages modern frontend technologies (Vite, JSX, Tailwind, DaisyUI) and Django backend to create a scalable, maintainable platform for PC build management, AI-assisted optimization, and analytics.
