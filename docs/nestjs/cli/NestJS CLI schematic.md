### 1. **application (`application` / `application`)**

Generates a new standalone NestJS application workspace.

**Example:**

```bash
nest new my-nest-app --package-manager pnpm --strict --directory projects/api
```

---

### 2. **class (`class` / `cl`)**

Generates a basic TypeScript class.

**Example:**

```bash
nest g class utils/logger --no-spec
```

Creates: `utils/logger.class.ts`

---

### 3. **configuration (`configuration` / `config`)**

Generates a configuration file for the Nest CLI.

**Example:**

```bash
nest g configuration --project api
```

Creates: `nest-cli.json` for the `api` project if in monorepo.

---

### 4. **controller (`controller` / `co`)**

Generates a controller with optional spec and REST boilerplate.

**Example:**

```bash
nest g co user --flat --path src/modules/user --no-spec
```

Creates: `user.controller.ts` in `src/modules/user`

---

### 5. **decorator (`decorator` / `d`)**

Generates a custom decorator.

**Example:**

```bash
nest g d auth/roles --type parameter --no-spec
```

Creates: `roles.decorator.ts` under `auth` folder

---

### 6. **filter (`filter` / `f`)**

Generates an exception filter.

**Example:**

```bash
nest g f common/filters/http-exception --flat
```

Creates: `http-exception.filter.ts`

---

### 7. **gateway (`gateway` / `ga`)**

Generates a WebSocket gateway (e.g., for real-time apps).

**Example:**

```bash
nest g ga chat --path src/modules/chat --no-spec
```

Creates: `chat.gateway.ts`

---

### 8. **guard (`guard` / `gu`)**

Generates a guard for authorization logic.

**Example:**

```bash
nest g gu auth/roles --implements CanActivate --flat
```

Creates: `roles.guard.ts`

---

### 9. **interceptor (`interceptor` / `itc`)**

Generates an interceptor (e.g., for logging, transformation).

**Example:**

```bash
nest g itc common/interceptors/logging --no-spec
```

Creates: `logging.interceptor.ts`

---

### 10. **interface (`interface` / `itf`)**

Generates a TypeScript interface.

**Example:**

```bash
nest g itf dto/user.dto --no-spec
```

Creates: `user.dto.ts` with a basic interface

---

### 11. **library (`library` / `lib`)**

Generates a new library within a monorepo project.

**Example:**

```bash
nest g lib shared/utils --directory libs
```

Creates: A library under `libs/shared/utils`

---

### 12. **middleware (`middleware` / `mi`)**

Generates middleware (e.g., logging, auth tokens).

**Example:**

```bash
nest g mi common/middleware/logger --no-spec
```

Creates: `logger.middleware.ts`

---

### 13. **module (`module` / `mo`)**

Generates a NestJS module.

**Example:**

```bash
nest g mo user --flat --path src/modules/user
```

Creates: `user.module.ts`

---

### 14. **pipe (`pipe` / `pi`)**

Generates a pipe (e.g., for validation, transformation).

**Example:**

```bash
nest g pi validation/parse-int --no-spec
```

Creates: `parse-int.pipe.ts`

---

### 15. **provider (`provider` / `pr`)**

Generates a provider (can be a service or any injectable class).

**Example:**

```bash
nest g pr common/providers/token --flat
```

Creates: `token.provider.ts`

---

### 16. **resolver (`resolver` / `r`)**

Generates a GraphQL resolver.

**Example:**

```bash
nest g r user --type crud --no-spec
```

Creates: `user.resolver.ts`

---

### 17. **resource (`resource` / `res`)**

Generates a full CRUD resource (controller, service, module, DTOs).

**Example:**

```bash
nest g res product --no-spec --path src/modules --flat --type graphql-code-first
```

Creates: `product.module.ts`, `product.resolver.ts`, `product.service.ts`, DTOs, etc.

---

### 18. **service (`service` / `s`)**

Generates a service class.

**Example:**

```bash
nest g s user/services/user --no-spec --flat
```

Creates: `user.service.ts`

---

### 19. **sub-app (`sub-app` / `app`)**

Generates a sub-application inside a monorepo.

**Example:**

```bash
nest g app admin --directory apps --strict
```

Creates: A sub-app inside `apps/admin`

---

Let me know if you’d like to create aliases or templates for frequent use, or to integrate any of these schematics into a CI pipeline.

