# Partwise Forge

**Author: Ben Tangen**

## Software Requirements Specification (SRS)

---

## 1. Introduction

### 1.1 Purpose

This document defines the requirements for **Partwise Forge**, a web application that helps users manage PC parts inventory, track costs and profits, build and optimize computer systems, and leverage AI-driven insights for pricing and listings. The document is intended to guide design, development, and future expansion.

### 1.2 Scope

Partwise Forge is designed for individuals who buy, sell, and assemble PCs or PC parts. The system will:

* Track parts and full systems in an inventory
* Associate monetary values with parts, bundles, and full PCs
* Support building PCs from available inventory
* Enforce compatibility constraints between parts
* Provide analytics and insights into profitability
* Offer AI-assisted pricing and listing generation for premium users

### 1.3 Definitions & Terminology

* **Part**: A physical PC component (CPU, GPU, RAM, etc.)
* **Build**: A collection of compatible parts forming a PC
* **Inventory**: The set of parts owned by a user
* **Optimization**: Automated grouping of parts into builds to maximize profit
* **Listing**: A generated or manual sale post for a part or build
* **Premium User**: A subscribed user with access to AI features

---

## 2. User Roles

### 2.1 Standard User

* Manages inventory and builds
* Tracks purchases and sales
* Views basic analytics

### 2.2 Premium User

* All Standard User capabilities
* Access to AI-driven pricing suggestions
* Access to AI-generated listings
* Advanced analytics and optimization tools

### 2.3 Administrator

* Access to system-wide analytics
* User and subscription oversight
* Visibility into AI usage and performance metrics

---

## 3. Functional Requirements

### 3.1 User & Access Management

* The system shall support user authentication and authorization
* The system shall distinguish between standard users, premium users, and administrators
* The system shall enforce feature access based on subscription tier

### 3.2 Inventory Management

* The system shall allow users to maintain an inventory of parts
* The system shall allow parts to exist independently of builds
* The system shall support multiple specialized part types (e.g., CPU, GPU, RAM)
* The system shall track form factor classifications where applicable

### 3.3 Compatibility Management

* The system shall model compatibility relationships between parts
* The system shall prevent incompatible parts from being placed into a build
* The system shall support extensible compatibility rules

### 3.4 Build Management

* The system shall allow users to create and modify builds
* The system shall associate builds with parts from inventory
* The system shall support build purposes (e.g., resale, personal use)
* The system shall evaluate build validity based on compatibility rules

### 3.5 Build Optimization

* The system shall provide a mechanism to automatically group inventory parts into builds
* The system shall prioritize profit maximization during optimization
* The system shall record optimization outcomes for analysis

### 3.6 Financial Tracking

* The system shall track purchase prices for parts, bundles, and full PCs
* The system shall associate prices with one or more parts
* The system shall track sales prices for parts and builds
* The system shall calculate profit and loss metrics
* The system shall exclude shipping-related costs

### 3.7 AI-Assisted Features (Premium)

* The system shall generate AI-based price suggestions
* The system shall log AI decisions and outcomes
* The system shall generate draft listings based on completed builds
* The system shall allow users to accept, modify, or reject AI outputs

### 3.8 Listings & Sales

* The system shall support creation of listings for parts or builds
* The system shall track listing status
* The system shall associate listings with sales data

### 3.9 Analytics & Insights

* The system shall provide user-level analytics dashboards
* The system shall compute profitability metrics
* The system shall provide inventory turnover insights
* The system shall support admin-level global analytics

### 3.10 Payments & Subscriptions

* The system shall integrate with Stripe to support premium subscriptions and one-time payments.
* The system shall create Checkout Sessions (Stripe-hosted) for secure payment collection and use webhook events to confirm payment and subscription state.
* The system shall require the following environment configuration: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
* The system shall not store raw payment card data on the server; use Stripe-hosted flows and tokens.

---

## 4. Non-Functional Requirements

### 4.1 Usability

* The system shall provide a clean, intuitive web-based interface
* The system shall support responsive design

### 4.2 Performance

* Inventory and build operations shall complete within acceptable interactive response times
* Optimization operations shall complete within a reasonable time frame based on inventory size

### 4.3 Scalability

* The system shall support growth in users, inventory size, and analytics data
* The data model shall allow new part types and compatibility rules to be added

### 4.4 Security

* The system shall securely store user credentials
* The system shall enforce access control for premium and admin features

### 4.5 Maintainability

* The system shall follow modular design principles
* Models and services shall be extensible without major refactors

---

## 5. Data & Model Overview (Conceptual)

The system data model includes, but is not limited to:

* User, Role, Subscription
* Inventory, Part, Specialized Part Types
* Compatibility Rules
* Build and Build-Part relationships
* Purchases, Sales, and Price Records
* AI Suggestions and Decision Logs
* Listings and Analytics Records

---

## 6. Assumptions & Constraints

* The system operates as a web application
* AI functionality depends on external or internal ML services
* Shipping and logistics costs are intentionally excluded

---

## 7. Future Considerations

* Expanded optimization strategies
* Community or shared build features
* Market-wide pricing insights
* Additional AI explainability and transparency features

---

## 8. Approval

This document serves as the baseline requirements for Partwise Forge and may evolve as development progresses.
