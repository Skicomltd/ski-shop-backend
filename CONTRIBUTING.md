# Contributing Skicom shop Api Server

This document outlines the rules, standards, and best practices for contributing to this NestJS application. Following these guidelines ensures consistency, maintainability, and readability across the codebase.

---

## 1. Directory Structure

| Directory                                                   | Purpose                                                                                                                                                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/db`                                                       | Holds TypeORM migration configurations.                                                                                                                                                                            |
| `/src/config`                                               | Holds all application configuration files. All config files must be named `configname.config.ts` (e.g., `mail.config.ts`). Synchronous config should use `registerAs` and async config should use `registerAsync`. All configurations must be loaded via config module so it is accessible via config service |
| `/src/events`                                               | Configures and initializes the NestJS Event Emitter. All application events must be registered in `events.registry.ts`.                                                                                      |
| `/src/exception`                                            | Custom exceptions. All exceptions must extend `ApiException`, except for reusable service modules.                                                                                                                 |
| `/src/interceptors`                                         | Application-wide interceptors. Module-specific interceptors should be defined locally within the module.                                                                                                           |
| `/src/mails`                                                | All mailable classes.                                                                                                                                                                                              |
| `/src/notifications`                                                | Holds notification classes (e.g. PayrollApprovalRequestNotification)                                                                                                                                                                                             |
| `/src/guards`                                                | Holds application-wide guards.                                                                                                                                                                                              |
| `/src/queues`                                               | Application-wide queue configurations (currently using BullMQ). Queues must be registered in the queue registry `queues.registry.ts`.                                                                                                    |
| `/src/seeders`                                              | Seeder files for each API resource. Seeder classes must implement the NestJS Seeder interface.                                                                                                                     |
| `/src/services`                                             | Global services (e.g., UtilsModule, MailModule, LogModule, PaymentsModule). All global modules should be imported and exported via a `ServicesModule`.                                                             |
| `/src/validations`                                          | Reusable validation pipes across the app.                                                                                                                                                                          |
| `/src/views`                                                | Renderable HTML and HBS files. `mail` folder for email templates; `pages` folder for web pages.                                                                                                                    |
| `/src/modules`                                              | API resource modules only. Each module should contain its controllers, DTOs, services, entities, interceptors, and interfaces.                                                                                     |
| `/src/main.ts`, `/src/app.service.ts`, `/src/app.module.ts` | Application initialization files.                                                                                                                                                                                  |
| `/src/seeder.ts`                                            | Application seeder initialization file.                                                                                                                                                                            |
| `/src/index.d.ts`                                           | Global type declarations.                                                                                                                                                                                          |

---

## 2. File Naming Conventions

* All filenames must be in `kebab` case. It should be lowercase, using `-` as a separator.
* Examples:

  * Service: `app.service.ts`, `file-system.service.ts`
  * Decorator: `role.decorator.ts`
  * Interceptor: `text-transform.interceptor.ts`

---

## 3. Configuration Files

* Use `registerAs` for synchronous configuration.
* Use `registerAsync` for async configuration.
* All configuration should be loaded in `AppModule` via `ConfigModule.forRoot()` or module-specific `registerAsync`.
---

## 4. Events and Queues

### 4.1 Event Registry

All application-wide **event names** must be declared in `src/events/events.registry.ts`.
These events are dispatched through the NestJS `EventEmitter` and are the single source of truth for event naming.

```ts
// src/events/events.registry.ts
export const EventRegistry = {
  EVENT_NAME: 'event.name'
} as const;

```

#### Event Configuration

All event configurations must be declared in `src/events/events.module.ts` using `EventEmitterModule`:

```ts
// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
  ],
})
export class EventsModule {}
```

---

### 4.2 Queue Registry

All application-wide **queue names** must be declared in `src/queues/queues.registry.ts`.
These queues are processed using `BullMQ`, and the registry ensures consistent naming across producers and consumers.

```ts
// src/queues/queues.registry.ts
export const QueueRegistry = {
 QUEUE_NAME: 'queue-name'
} as const;

```

#### Queue Configuration

All queue configurations must be declared in `src/queues/queues.module.ts` using `BullModule`:

```ts
// src/queues/queues.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class QueuesModule {}
```

---

## 5. Exceptions

* All custom exceptions must extend the `ApiException` base class.
* Standardizing exceptions ensures proper logging and consistent error messages.
* Only reusable service modules may throw exceptions outside `ApiException`.

---

## 6. Interceptors

* All endpoints must return consistent responses.
* Each resource must have at least:

  * `resource-name-singular.interceptor.ts`
  * `resource-name-plural.interceptor.ts`
* Interceptors implement the `IInterceptor` interface:

```ts
interface IInterceptor {
  transform(data: unknown): unknown
}
```

* Create an abstract class for each resource extending `IInterceptor` in the resource’s `interfaces` directory.
* The plural interceptor should handle pagination if required.

---

## 7. API Resource Structure

* Generated using `nest g resource <name>`.
* Each resource should have:

  * Controller
  * Service
  * Entity
  * DTO (with validation using Joi)
  * Interceptors
  * Interfaces

**Example DTO with Joi Validation:**

```ts
import Joi from 'joi'
import { Folder } from '@/modules/folders/entities/folder.entity'

export class CreateFileDto {
  folderId?: string
  folder?: Folder
  name: string
  url: string
  mimetype: string
  size: number
  companyId: string
}

export const createFileSchema = Joi.object({
  folderId: Joi.string().uuid()
})
```

---

## 8. API Resource Service Classes

* All API resource services must implement the `IService` interface:

```ts
interface IService<T> {
  create(data: unknown, manager?: EntityManager): Promise<T>
  find(data: unknown): Promise<[T[], number]>
  findById(id: string): Promise<T>
  findOne(filter: FindOptionsWhere<T>): Promise<T>
  exists(filter: FindOptionsWhere<T>): Promise<boolean>
  update(entity: T, data: unknown, manager?: EntityManager): Promise<T>
  remove(filter: FindOptionsWhere<T>): Promise<number>
}
```

**Guidelines for Services:**

* Service classes **must only handle database business logic**.
* Each method must have **one clear responsibility**, focused solely on persistence (create, query, update, delete, existence checks).
* Services must **not** contain orchestration logic, validation, or request-level handling — that belongs in controllers or pipes.
* Services must be **purely transactional** in nature (operate against repositories, entities, and transactions).

**Example Service:**

```ts
@Injectable()
export class FilesService implements IService<File> {
  async create(data: CreateFileDto, manager?: EntityManager) { ... }
  async find({ search, folderId }: IQueryFilter) { ... }
  async findById(id: string) { ... }
  async findOne(where: FindOptionsWhere<File>) { ... }
  async exists(filter: FindOptionsWhere<File>) { ... }
  async update(entity: File, data: UpdateFileDto, manager?: EntityManager) { ... }
  async remove(filter: FindOptionsWhere<File>, manager?: EntityManager) { ... }
}
```

---

## 9. Controllers

* Controllers act as **delegators**.
* They are responsible for:

  * Validating requests (via DTOs & pipes).
  * Delegating to service methods.
  * Combining service calls when orchestration is required.
  * Returning the standardized response (transformed by interceptors).
* Controllers **must not** contain direct database logic.
* Controllers **may** publish events, enqueue jobs, or call external service modules if needed.

---

## 10. Global Services Module

* All globally reusable services should be imported/exported through `ServicesModule`.
* Examples: `UtilsModule`, `MailModule`, `LogModule`, `PaymentsModule`, `NotificationsModule`.

---

## 11. Barrel Exports vs Explicit Imports

To avoid circular dependencies and undefined runtime errors, contributors must follow these rules when creating or updating `index.ts` barrel files:

### ✅ Safe to Barrel-Export

These files can be freely re-exported from a module’s `index.ts`:

* **DTOs** (`*.dto.ts`)
* **Entities** (`*.entity.ts`)
* **Interfaces** (`*.interface.ts`)
* **Constants** (`*.constants.ts`)
* **Exceptions** (`*.exception.ts`)

Example:

```ts
// src/modules/users/index.ts
export * from './dto'
export * from './entities'
export * from './interfaces'
export * from './constants'
```

This allows clean imports elsewhere:

```ts
import { CreateUserDto } from '@modules/users'
```

---

### ❌ Must Be Imported Explicitly

The following **must not** be barrel-exported, as they cause circular imports or import-order issues:

* NestJS **Modules** (`*.module.ts`)
* **Services** (`*.service.ts`)
* **Decorators** (`*.decorator.ts`)
* **Providers**

Always import them directly:

```ts
import { UsersModule } from '@modules/users/users.module'
import { UsersService } from '@modules/users/users.service'
import { CheckPolicies } from '@modules/auth/decorators/check-policy.decorator'
```

---

### Rule of Thumb

* **Passive code** (types, constants, DTOs, entities, exceptions) → Barrel-export ✅
* **Active code** (modules, services, decorators, providers) → Explicit import ❌

This ensures clean separation, avoids circular dependencies, and prevents “undefined” errors when decorators or services load.

---

## 12. General Guidelines

* Always use NestJS module system and dependency injection.
* Keep code modular and reusable.
* Follow naming conventions strictly.
* Maintain consistent error handling.
* Ensure API responses are standardized using interceptors.
* Use DTO validation (preferably with Joi) for all incoming requests.
* Declare all events in EventRegistry and configure them in EventsModule.
* Declare all queues in QueueRegistry and configure them in QueuesModule.
* Never hardcode event or queue names outside their registry.
* Follow **SRP (Single Responsibility Principle)**:

  * Services = database business logic only.
  * Controllers = delegators/orchestrators.

## 13. Submitting Issues

To keep the project organized and make it easier to triage and resolve issues, please follow these guidelines when submitting a new issue.

### Guidelines

* Ensure the issue is clear and concise.
* Include **steps to reproduce** if applicable.
* Include **expected behavior** and **actual behavior**.
* Include relevant **screenshots** or **logs** if possible.
* Tag the issue appropriately (e.g., `bug`, `enhancement`, `feature request`, `documentation`).

### Issue Template

You can copy this template when creating a new issue:

```markdown
# Issue Title
<!-- A short, descriptive title -->

## Description
<!-- Explain the issue or feature request clearly -->

## Steps to Reproduce (for bugs)
1. Go to '...'
2. Click on '...'
3. Observe '...'

## Expected Behavior
<!-- What you expected to happen -->

## Actual Behavior
<!-- What actually happened -->

## Environment
<!-- Include any relevant environment info (Node version, OS, etc.) -->

## Screenshots / Logs
<!-- Optional: Include any screenshots or log output -->

## Additional Context
<!-- Optional: Any other context or suggestions -->
```

---

## 14. Making Commits

To maintain a clean, readable Git history, follow these **commit guidelines**:

### Commit Message Format

Use **Conventional Commits** style:

```
<type>(<scope>): <short description>
```

#### Types

* `feat` → A new feature
* `fix` → A bug fix
* `docs` → Documentation only changes
* `style` → Formatting, missing semi-colons, white-space, etc.
* `refactor` → Code change that neither fixes a bug nor adds a feature
* `perf` → Performance improvements
* `test` → Adding missing tests or correcting existing tests
* `chore` → Changes to build process, dependencies, or tooling

#### Scope

* Scope refers to the module of the code affected (e.g., `auth`, `users`, `payments`).

#### Examples

```
feat(auth): add Google login for mobile apps
fix(users): prevent login for unverified emails
docs(contributing): add issue and commit guidelines
```

### Commit Guidelines

* Keep the **subject line ≤ 50 characters**.
* Use the **imperative mood** (“fix”, “add”, “update”) in the subject line.
* Separate subject from body with a blank line.
* Body lines should wrap at ~72 characters.
* Include a **detailed description in the body** if the change is complex.
* Reference any relevant issue number using `#<issue_number>`.

#### Example of a detailed commit:

```
feat(cart): sync guest cart on login

Merged guest cart items with authenticated user's existing cart.
Ensured no duplicates and preserved item quantities.

Closes #45
```

---

### 15. Pull Requests (Optional Note)

* Always branch from `main` or the latest `development` branch.
* Name your branch descriptively:

  ```
  feat/auth/google-login
  fix/cart/sync-login
  ```
* Link your PR to the corresponding issue using `Closes #<issue_number>`.
* PRs must pass all tests and lint checks before merging.
* Include a brief description of your changes in the PR body.

