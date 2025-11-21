# Development Plan: NestJS Termii SDK

This document outlines the development plan for creating the NestJS Termii SDK. Each major feature is a task that should be completed, tested, and committed separately.

## Phase 1: Project Foundation & Core Module

- [x] **1.1: Environment and Dependency Setup**
  - [x] Install dependencies: `@nestjs/axios` and `@nestjs/config`.
  - [x] Configure `@nestjs/config` in `app.module.ts` to load environment variables.
  - [x] Create `.env.example` file with `TERII_API_KEY`, `TERII_SENDER_ID`, and `TERII_BASE_URL` placeholders.
  - [x] Add `.env` to the `.gitignore` file.

- [x] **1.2: Initial Project Structure**
  - [x] Create a new directory `src/termii` for all SDK-related source code.
  - [x] Create an `examples` directory to house test implementations.
  - [x] Update `tsconfig.json` `paths` to include a library alias (e.g., `@termii-sdk/*`).

- [x] **1.3: Foundational Files**
  - [x] Create `LICENSE` file (default to MIT).
  - [x] Create `CONTRIBUTING.md` with basic guidelines.
  - [x] Create an initial `CHANGELOG.md`.

- [x] **1.4: Core Module Implementation**
  - [x] Create `src/termii/termii.module.ts`.
  - [x] Implement `TermiiModule.forRoot` and `TermiiModule.forRootAsync` for configuration.
  - [x] Define configuration interfaces in `src/termii/interfaces/termii-options.interface.ts`.

- [x] **1.5: Common Utilities**
  - [x] Create a base service or HTTP wrapper for handling API calls.
  - [x] Define custom exception classes in `src/termii/exceptions/`.
  - [x] Create `src/termii/dtos/` for request models.
  - [x] Create `src/termii/responses/` for response models.
  - [x] Create `src/termii/enums/` for enums.
  - [x] Create `src/termii/types/` for common types/interfaces.

## Phase 2: API Feature Implementation

> For each service below, the steps are:
>
> 1.  Create the service file (e.g., `insights.service.ts`).
> 2.  Define request/response interfaces/DTOs for its methods.
> 3.  Implement the methods, calling the Termii API.
> 4.  Write comprehensive unit tests for the service.
> 5.  Create a runnable example demonstrating the service's features in the `examples` directory.

- [x] **2.1: Insights API (`InsightsService`)**
  - [x] Implement `getBalance()`
  - [x] Implement `search()`
  - [x] Implement `getStatus()`
  - [x] Implement `getHistory()`
  - [x] Write unit tests for `InsightsService`.
  - [x] Create example for `InsightsService`.
  - [x] **2.1.7: Debug example execution issue**

-   [x] **2.2: Messaging API (`MessagingService`)**

    -   [x] Implement `sendMessage()`

    -   [x] Implement `sendBulkMessage()`

    -   [x] Implement `sendWithTemplate()`

    -   [x] Write unit tests for `MessagingService`.

    -   [x] Create example for `MessagingService`.

-   [x] **2.3: Token API (`TokenService`)**

    -   [x] Implement `sendToken()`

    -   [x] Implement `verifyToken()`

    -   [x] Implement `inAppToken()`

    -   [x] Write unit tests for `TokenService`.

    -   [x] Create example for `TokenService`.

-   [x] **2.4: Sender ID API (`SenderIdService`)**

    -   [x] Implement `list()`

    -   [x] Implement `request()`

    -   [x] Write unit tests for `SenderIdService`.

    -   [x] Create example for `SenderIdService`.

-   [x] **2.5: Contacts API (`ContactsService`)**

    -   [x] Implement Phonebook methods (`list`, `create`, `update`, `delete`)

    -   [x] Implement Contact methods (`list`, `add`, `addBulk`, `delete`)

    -   [x] Write unit tests for `ContactsService`.

    -   [x] Create example for `ContactsService`.

- [ ] **2.6: Campaigns API (`CampaignsService`)**
  - [ ] Implement Campaign methods (`fetch`, `history`, `send`)
  - [ ] Write unit tests for `CampaignsService`.
  - [ ] Create example for `CampaignsService`.

- [ ] **2.7: Conversations API (`ConversationsService`)**
  - [ ] Implement Conversation methods (`list`, `toggleRead`, `send`)
  - [ ] Write unit tests for `ConversationsService`.
  - [ ] Create example for `ConversationsService`.

## Phase 3: Documentation & Finalization

- [ ] **3.1: Finalize `README.md`**
  - [ ] Add installation instructions.
  - [ ] Add quick start and configuration examples.
  - [ ] Add usage examples for every implemented service.
  - [ ] Document the error handling strategy.

- [ ] **3.2: API Reference Documentation**
  - [ ] Add TSDoc comments to all public methods, interfaces, and classes.
  - [ ] Create `API.md` and populate it with generated or manually written API reference documentation.

- [ ] **3.3: Example Usage Review**
  - [ ] Review and refine all usage examples in the `examples` directory.
  - [ ] Ensure examples are clear and easy to understand.

- [ ] **3.4: Continuous Integration (CI)**
  - [ ] Create a GitHub Actions workflow (`.github/workflows/ci.yml`).
  - [ ] The workflow should run linting, tests, and a production build on every push/PR to `main`.

- [ ] **3.5: Final Polish**
  - [ ] Update `package.json` with keywords, author info, repository link, etc.
  - [ ] Review and update `CHANGELOG.md`.
  - [ ] Perform a final review of all code and documentation.
