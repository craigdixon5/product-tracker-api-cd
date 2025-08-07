# Simple Price Alert API built with TDD in JavaScript.

## Features

- **Create price alerts** with confirmation messages
- **Time-based checking** wi**Complete test coverage includes:**

- Alert creation with validation
- CSRF protection and token generation
- Price checking simulation
- Frequency validation (hourly/daily/weekly)
- Error handling
- Performance testing
- API documentation

## Architecture settings (hourly/daily/weekly)

- **Price simulation** from static JSON data
- **Email notifications** when price conditions are met
- **Complete validation** and error handling
- **Built-in API documentation** endpoint
- **Health checks** for monitoring
- **CSRF protection** for secure form submissions
- **Structured logging** with Winston (JSON format)
- **Security headers** with Helmet middleware
- **Code formatting** with Prettier (80-char line splitting)
- **100% test coverage** with TDD methodology

## Quick Start API

A lightweight, Test-Driven Development (TDD) implementation of a price tracking API built in just **4 hours**. Perfect for rapid prototyping, learning TDD, or interview challenges.

## Quick Start

````bash
# Install dependencies
npm install

# Start the server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

#### Health Check

```bash
GET /health
````

#### Built-in API Documentation

```bash
GET /api/docs
```

_Returns comprehensive API information, security details, and endpoint specifications._

#### Get CSRF Token (Required for POST requests)

```bash
GET /csrf-token
```

**Response:**

```json
{
  "success": true,
  "csrfToken": "abc123...",
  "message": "Include this token in x-csrf-token header or _csrf body field for protected requests"
}
```

### Create Price Alert

```bash
POST /alerts
Content-Type: application/json
x-csrf-token: [token from /csrf-token]

{
  "productUrl": "https://example.com/product1",
  "targetPrice": 100,
  "email": "user@example.com",
  "frequency": "daily"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1754501955434",
    "productUrl": "https://example.com/product1",
    "targetPrice": 100,
    "email": "user@example.com",
    "frequency": "daily",
    "isActive": true,
    "createdAt": "2025-08-06T17:39:15.434Z"
  },
  "message": "Price alert has been set! You will be notified when the product price meets or drops below £100. Price checks will run daily."
}
```

### Get All Alerts

```bash
GET /alerts
```

### Manual Price Check

```bash
POST /check-prices
x-csrf-token: [token from /csrf-token]
```

## Testing

Built with TDD approach. Run tests:

```

## Testing

npm test

**Complete test coverage includes:**

- Alert creation with validation
- CSRF protection and token generation
- Price checking simulation
- Frequency validation (hourly/daily/weekly)
- Error handling
- Performance testing
- API documentation


## Dependencies

Only **8 essential packages:**

**Runtime Dependencies:**

- **`express`** - Web framework
- **`helmet`** - Security headers middleware
- **`winston`** - Structured logging
- **`csrf`** - CSRF protection
- **`cookie-parser`** - Cookie handling for sessions

**Development Dependencies:**

- **`prettier`** - Code formatting (80-char line splitting)
- **`jest`** - Testing framework
- **`supertest`** - API testing

## Development

The entire API was built using TDD methodology:

1. **Red:** Write failing test
2. **Green:** Write minimal code to pass
3. **Refactor:** Improve code while keeping tests green
4. **Repeat:** Add next feature

This ensures every line of code has a purpose and is tested.

---
```
