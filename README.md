# Authentication Module

A robust and secure authentication module for **NestJS**, using **Prisma ORM**, **JWT authentication** via **HTTP-only cookies**, and full **Swagger API documentation**. Includes **email verification**, a **Nest CLI scaffolding tool**, and OAuth placeholders for future use.

---

* ✅ JWT-based auth via HTTP-only cookies and optional Bearer header
* ✅ User registration and login
* ✅ Email verification with JWT token links
* ✅ Role-based access control (RBAC)
* ✅ Swagger support with cookie + bearer authentication
* ✅ CLI tool to scaffold modules with service/controller/dto
* 🚧 Future support for Google and GitHub OAuth

---

## 🔐 Features

* ✅ User registration and login
* ✅ Password hashing with `bcrypt`
* ✅ JWT authentication via:

  * Secure **HTTP-only cookies** (primary)
  * Authorization **Bearer header** (fallback)
* ✅ Email verification flow:

  * Verification email with JWT link on registration
  * Endpoint for verifying tokens
  * Resend verification feature
* ✅ Role-based access guard with `@Roles()` decorator
* ✅ Swagger API documentation for all endpoints
* ✅ Prisma ORM integration with generated DTOs
* ✅ CLI scaffolding for modules (controller, service, DTOs)
* 🚧 OAuth2 support for Google and GitHub (scaffolded)

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

## 🚀 API Workflows

* **POST `/auth/register`** → Creates user, sends verification email
* **GET `/auth/verify-email?token=...`** → Verifies user's email
* **POST `/auth/resend-verification`** → Resends email verification link
* **POST `/auth/login`** → Logs user in and issues JWT cookie
* **POST `/auth/logout`** → Clears JWT cookie
* **Protected endpoints** → Require valid JWT + role checks via `@Roles()`

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

## 🛡️ Role-Based Access (RBAC)

### Decorator Usage

```ts
@Roles('ADMIN')
@Get('admin/dashboard')
getDashboard(@CurrentUser() user: User) {
  return { message: `Hello ${user.name}` };
}
```

### Guard Integration

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
```

---

## 🧪 Testing

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
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── interfaces/
│   │   └── auth-request.interface.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── jwt-user.dto.ts
│   └── strategies/
│       └── jwt.strategy.ts
├── mail/
│   ├── mail.module.ts
│   ├── mail.service.ts
│   └── templates/
│       ├── welcome.hbs
│       └── verify-email.hbs
├── libs/
│   ├── cli.ts
│   ├── generator.ts
│   ├── parser.ts
│   └── templates/
│       ├── controller.ts.ejs
│       ├── create-dto.ts.ejs
│       ├── module.ts.ejs
│       ├── service.ts.ejs
│       ├── update-dto.ts.ejs
├── prisma/
│   └── prisma.service.ts
```

---

## 🧰 Tools & Packages

| Package                  | Purpose                             |
| ------------------------ | ----------------------------------- |
| `@nestjs-modules/mailer` | Sending emails using templates      |
| `handlebars`             | Email templating                    |
| `@nestjs/jwt`            | JWT token creation and verification |
| `bcrypt`                 | Secure password hashing             |
| `cookie-parser`          | Parsing cookies from requests       |
| `passport`               | Authentication strategy management  |
| `@nestjs/swagger`        | API documentation                   |
| `@prisma/client`         | Database ORM                        |
| `nestjs-cli` (custom)    | Scaffolding service/controller/dtos |

---

## 🧑‍💻 Author

Made with love by [Eddie Villanueva](https://github.com/evillan0315)  
💌 [evillan0315@gmail.com](mailto:evillan0315@gmail.com)

---

## 📄 License

MIT License — © Eddie Villanueva


