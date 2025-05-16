# Authentication Module

A robust and secure authentication module for NestJS, using Prisma ORM, JWT authentication via HTTP-only cookies, and full Swagger API documentation. OAuth support for Google and GitHub is scaffolded for future extension.

---

* JWT-based auth via HTTP-only cookies and optional bearer header
* User registration and login
* Swagger support
* Future support placeholders for Google and GitHub OAuth

---

## 🔐 Features

- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ JWT authentication via:
  - Secure HTTP-only cookies (primary)
  - Authorization header (Bearer, optional)
- ✅ Swagger API documentation
- ✅ Prisma ORM integration
- 🚧 OAuth2 support for Google and GitHub (scaffolded)

---

## 🛠 Tech Stack

- [NestJS](https://nestjs.com)
- [Prisma ORM](https://www.prisma.io/)
- [Passport.js](http://www.passportjs.org/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)
- [OAuth2](https://oauth.net/2/) (Google, GitHub — planned)

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/evillan0315/auth-module.git
cd auth-module
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run the application

```bash
npm run start:dev
```

### 5. Swagger API

Visit [http://localhost:3000/api](http://localhost:3000/api) for the full Swagger UI documentation.

---

## 🔑 API Endpoints

### 📥 Register

```
POST /auth/register
```

**Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe",
  "phone_number": "+123456789"
}
```

### 🔓 Login

```
POST /auth/login
```

Sets a secure `jwt` cookie. Returns access token for optional use in Authorization header.

### 🧾 Get Current User

```
GET /auth/me
```

**Headers**:

* `Authorization: Bearer <token>` *(optional if cookie is present)*

---

## 🧪 Testing

You can test the login & session flow with:

### 🔐 Login and get JWT cookie

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123"}' \
  -c cookie.txt
```

### 👤 Get current user with cookie

```bash
curl http://localhost:3000/auth/me \
  -b cookie.txt
```

---

## 🌍 OAuth2 Integration (Coming Soon)

Planned support for:

* 🔗 Google
* 🐱 GitHub

### Folder structure preview:

```
auth/
├── strategies/
│   ├── google.strategy.ts      # Google OAuth (planned)
│   └── github.strategy.ts      # GitHub OAuth (planned)
├── sessions/
│   └── session.service.ts      # Session persistence via Prisma
```

> OAuth tokens will also support cookie + bearer pattern with token issuance on success.

---

## 📁 Project Structure

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── auth.strategy.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
├── prisma/
│   └── prisma.service.ts
```

---

## 🧰 Tools

| Tool            | Usage                        |
| --------------- | ---------------------------- |
| `bcrypt`        | Hashing user passwords       |
| `cookie-parser` | Parsing JWT from cookies     |
| `@nestjs/jwt`   | Token signing and validation |
| `passport`      | Strategy-based auth          |
| `swagger`       | API docs                     |

---

## 📄 License

MIT License — © Eddie Villanueva

---
