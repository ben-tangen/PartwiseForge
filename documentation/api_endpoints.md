# API Endpoints

**Author: Ben Tangen**

This document defines all API endpoints for Partwise Forge, including routes, methods, request/response formats, and permissions.

Endpoints are grouped by module: Authentication, Inventory, Builds, Listings/Sales, AI, and Analytics.

---

## 1. Authentication / Users

### 1.1 Register User

* **URL:** `/api/register/`
* **Method:** POST
* **Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

* **Response Body:**

```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": "user"
}
```

* **Permissions:** Public

### 1.2 Login User

* **URL:** `/api/login/`
* **Method:** POST
* **Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

* **Response Body:**

```json
{
  "token": "jwt-token",
  "user_id": 1,
  "role": "user"
}
```

* **Permissions:** Public

### 1.3 Get User Info

* **URL:** `/api/users/{id}/`
* **Method:** GET
* **Response Body:**

```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": "user",
  "created_at": "timestamp"
}
```

* **Permissions:** Authenticated (user or admin)

---

## 2. Inventory / Parts

### 2.1 List Parts

* **URL:** `/api/parts/`
* **Method:** GET
* **Response Body:**

```json
[
  {
    "id": 1,
    "name": "string",
    "type": "CPU",
    "state": "not_used",
    "assigned_build_id": null
  }
]
```

* **Permissions:** Authenticated (user or admin)

### 2.2 Create Part

* **URL:** `/api/parts/`
* **Method:** POST
* **Request Body:**

```json
{
  "name": "string",
  "type": "CPU",
  "brand": "string",
  "model": "string",
  "purchase_price": 300,
  "part_out_price_min": 280,
  "part_out_price_max": 320
}
```

* **Response Body:** Newly created part object
* **Permissions:** Authenticated (user or admin)

### 2.3 Update Part

* **URL:** `/api/parts/{id}/`
* **Method:** PUT
* **Request Body:** Updated fields
* **Response Body:** Updated part object
* **Permissions:** Authenticated (owner or admin)

### 2.4 Delete / Archive Part

* **URL:** `/api/parts/{id}/archive/`
* **Method:** POST
* **Response Body:** Archived part confirmation
* **Permissions:** Authenticated (owner or admin)

---

## 3. Builds

### 3.1 List Builds

* **URL:** `/api/builds/`
* **Method:** GET
* **Response Body:** List of builds with parts and state
* **Permissions:** Authenticated (user or admin)

### 3.2 Create Build

* **URL:** `/api/builds/`
* **Method:** POST
* **Request Body:**

```json
{
  "title": "Gaming PC",
  "description": "High-end build",
  "intended_for_sale": true,
  "parts": [1, 2, 3]
}
```

* **Permissions:** Authenticated (user or admin)

### 3.3 Update Build

* **URL:** `/api/builds/{id}/`
* **Method:** PUT
* **Request Body:** Updated fields, parts array
* **Permissions:** Authenticated (owner or admin)

### 3.4 Delete / Archive Build

* **URL:** `/api/builds/{id}/archive/`
* **Method:** POST
* **Permissions:** Authenticated (owner or admin)

---

## 4. Listings / Sales

### 4.1 Create Listing

* **URL:** `/api/listings/`
* **Method:** POST
* **Request Body:**

```json
{
  "title": "Gaming PC for Sale",
  "description": "Specs: ...",
  "price": 1500,
  "build_id": 1
}
```

* **Permissions:** Authenticated (owner or admin)

### 4.2 Record Sale

* **URL:** `/api/sales/`
* **Method:** POST
* **Request Body:**

```json
{
  "build_id": 1,
  "total_sale_price": 1500
}
```

* **Response Body:** Sale confirmation with profit computation
* **Permissions:** Authenticated (owner or admin)

---

## 5. AI / Optimization

### 5.1 Request Build Optimization

* **URL:** `/api/ai/optimize_build/`
* **Method:** POST
* **Request Body:**

```json
{
  "build_id": 1,
  "strategy": "best_profit"
}
```

* **Response Body:**

```json
{
  "suggested_changes": ["Replace GPU with XYZ", ...],
  "estimated_profit_increase": 50
}
```

* **Permissions:** Authenticated (premium users only)

### 5.2 Generate Listing Text

* **URL:** `/api/ai/generate_listing/`
* **Method:** POST
* **Request Body:**

```json
{
  "build_id": 1
}
```

* **Response Body:** Copy-ready title and description
* **Permissions:** Authenticated (premium users only)

### 5.3 Tech Chatbot

* **URL:** `/api/ai/chat/`
* **Method:** POST
* **Request Body:**

```json
{
  "query": "Which RAM is compatible with this CPU?",
  "context_scope": "inventory"
}
```

* **Response Body:** AI-generated explanation / guidance
* **Permissions:** Authenticated (premium users only)

---

## 6. Analytics

### 6.1 User Analytics

* **URL:** `/api/analytics/user/`
* **Method:** GET
* **Query Parameters:** `time_range=daily|weekly|monthly|yearly`
* **Response Body:** Aggregated stats for user (parts added, builds created, profit)
* **Permissions:** Authenticated (user or admin)

### 6.2 Admin Analytics

* **URL:** `/api/analytics/admin/`
* **Method:** GET
* **Query Parameters:** `time_range=daily|weekly|monthly|yearly`
* **Response Body:** Platform-wide metrics (total users, premium users, parts, builds, total profit)
* **Permissions:** Admin only

---

This document ensures a clear blueprint for frontend-backend interactions, including AI endpoints, role-based access, and all major system operations.

---

## 7. Payments / Subscriptions

This system uses Stripe to manage premium subscriptions and payments. The backend will create Checkout Sessions for client-side redirects and verify webhooks for subscription events.

### 7.1 Create Checkout Session

* **URL:** `/api/payments/create-checkout-session/`
* **Method:** POST
* **Request Body:**

```json
{
  "price_id": "string",        // optional if server-side configured
  "success_url": "string",
  "cancel_url": "string"
}
```

* **Response Body:**

```json
{
  "session_id": "string",
  "url": "https://checkout.stripe.com/..."
}
```

* **Permissions:** Authenticated

### 7.2 Webhook Receiver

* **URL:** `/api/payments/webhook/`
* **Method:** POST
* **Request Body:** Stripe event payload (see Stripe docs)
* **Behavior:** Verify signature using `STRIPE_WEBHOOK_SECRET`, then handle events such as `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.updated`, and `customer.subscription.deleted` to grant/revoke premium access and record billing info.
* **Permissions:** Public endpoint, must validate webhook signature

### 7.3 Query Subscription Status

* **URL:** `/api/payments/subscription/`
* **Method:** GET
* **Response Body:**

```json
{
  "status": "active|past_due|canceled|inactive",
  "current_period_end": "timestamp",
  "price_id": "string"
}
```

* **Permissions:** Authenticated (user)

Include client-side guidance to redirect to the Stripe Checkout URL returned from the create-checkout-session call, and to handle success/cancel flows. See `README.md` for required environment variables.
