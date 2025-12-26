# Models

**Author: Ben Tangen**

This document defines the core data models for the PC inventory, build, listing, sales, analytics, and AI-assisted optimization system.  
The system is designed to support individual users, optional admin privileges, and future expansion to teams or organizations without enforcing them now.

---

## 1. User Models

### User (Base)
Represents any authenticated user of the system.

User
- id
- username
- email
- role (user | admin)
- created_at

Notes:
- No user-to-user interaction.
- No shared inventory.
- Each user owns their own data.
- Admins also function as normal users with additional privileges.

---

### Admin (extends User)

Admin
- can_recompute_analytics
- can_view_global_stats
- has_premium_features

Notes:
- Admins have their own inventory, builds, and finances.
- Admins can access platform-wide analytics.
- Admin access is for development and maintenance only.

---

## 2. Inventory & Part Models

### Part (Base Class)

Part
- id
- owner_user_id
- name
- brand
- model
- purchase_price
- part_out_price_min
- part_out_price_max
- state (implicit)
- assigned_build_id (nullable)
- created_at

Implicit State Rules:
- not_used → assigned_build_id = null
- used → assigned to a build
- used_multiple_times → hypothetical assignment
- sold → referenced by a Sale

Notes:
- A part cannot belong to multiple users.
- Parts can exist unassigned.
- State is derived, not manually set.

---

### Part Categories (Inheritance)

CorePart extends Part  
OptionalPart extends Part  
Peripheral extends Part  

---

### Specific Part Types

#### CPU
CPU
- socket
- generation
- supported_ram_type

#### Motherboard
Motherboard
- socket
- supported_ram_type
- form_factor

#### RAM
RAM
- ram_type
- capacity_gb

#### GPU
GPU
- vram_gb

#### Storage
Storage
- type (HDD | SSD | NVMe)
- capacity_gb

#### PSU
PSU
- wattage

#### Case
Case
- form_factor

---

### Optional / Peripheral Parts

WiFiCard  
Fan  
Monitor  
Mouse  
Keyboard  

Notes:
- Optional parts are not required for a build.
- Form factor applies only where relevant.
- Size constraints are advisory, not enforced.

---

## 3. Build Models

### Build

Build
- id
- owner_user_id
- title
- description
- intended_for_sale (boolean)
- total_cost (computed)
- estimated_value (computed)
- created_at

Build Types:
- Manual assembly
- AI-assisted assembly (requires user confirmation)

Notes:
- Builds do not require a price.
- Builds can exist purely for personal or hobby use.
- Builds may reference hypothetical parts.

---

### BuildPart (Join Model)

BuildPart
- build_id
- part_id
- hypothetical (boolean)

Notes:
- Hypothetical parts allow reuse for valuation.
- Hypothetical usage triggers used_multiple_times state.

---

## 4. Archives

### ArchivedPart

ArchivedPart
- original_part_id
- archived_reason (used_in_build | sold)
- archived_at

### ArchivedBuild

ArchivedBuild
- original_build_id
- sold_price
- archived_at

Notes:
- Parts used in sold builds are archived.
- Builds are archived when sold.

---

## 5. Listing Models

### Listing

Listing
- id
- owner_user_id
- title
- description
- price
- related_build_id (nullable)
- active (boolean)
- created_at

Notes:
- Listings are internal only.
- A listing can exist without being sold.
- One universal listing type.

---

## 6. Sales & Finance Models

### Sale

Sale
- id
- owner_user_id
- build_id (nullable)
- total_sale_price
- profit (computed)
- sold_at

Rules:
- A sale may reference a build.
- Profit = sale price − total cost.

---

### FinanceSummary (Computed)

FinanceSummary
- total_spent
- total_earned
- total_profit

Notes:
- Displayed on a dedicated finance page.
- Admins have their own finance view.

---

## 7. Compatibility Models

### CompatibilityRule

CompatibilityRule
- part_type_a
- part_type_b
- rule_description

Examples:
- CPU socket must match motherboard socket
- CPU generation determines RAM type

Behavior:
- Generates warnings or errors
- Advisory by default
- Errors shown when clearly incompatible

---

## 8. AI & Optimization Models

### OptimizationRun (Ephemeral)

OptimizationRun
- build_id
- strategy (best_pairing | best_profit)
- suggested_changes

Notes:
- No historical storage.
- User must confirm changes.
- AI cannot apply changes automatically.

---

### AIUsageTracker

AIUsageTracker
- user_id
- monthly_token_limit
- tokens_used
- usage_percentage

---

### AIChatbot

AIChatbot
- context_scope (inventory | builds | general_tech)

Notes:
- Separate chatbot for tech-related questions.
- Explanatory responses for chat.
- Suggestion-only outputs.

---

## 9. Analytics Models

### UserAnalytics

UserAnalytics
- time_range (daily | weekly | monthly | yearly)
- builds_created
- parts_added
- profit

---

### AdminAnalytics

AdminAnalytics
- total_users
- premium_users
- total_parts
- total_builds
- total_user_profit

Notes:
- Separate admin-only dashboard.
- Non-invasive metrics.
- Used strictly for development insight.

---

## 10. Scope

This document defines all core models for:
- Inventory management
- Builds
- Sales and finance
- AI-assisted optimization
- Analytics
- Admin tooling

Future documents:
- High-level design
- Low-level design
- System architecture
