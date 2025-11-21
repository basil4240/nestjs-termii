# Product Requirements Document: NestJS Termii SDK

## 1. Overview

This document outlines the requirements for a NestJS SDK for the Termii API. The goal is to create a library that simplifies integration with the Termii platform for NestJS developers, providing a familiar and idiomatic development experience. The SDK will be a comprehensive wrapper around the Termii REST API, covering all its features and ensuring a high standard of quality through robust error handling, testing, and documentation.

## 2. Rationale and Strategic Fit

The Termii API provides powerful communication and verification services. A dedicated NestJS SDK will lower the barrier to entry for developers using the NestJS framework, encouraging wider adoption of Termii's services within that ecosystem. By providing a "Nest-like" experience, the SDK will feel like a natural extension of the framework, improving developer productivity and satisfaction.

## 3. Target Audience

The primary target audience is NestJS developers who need to integrate communication and verification features into their applications. This includes developers building applications that require:

- Transactional messaging (SMS, Voice, WhatsApp).
- One-Time Passwords (OTP) for user verification.
- Phone number intelligence and validation.
- Contact and list management.

## 4. Core Modules and Features

The SDK will be structured into logical modules that mirror the Termii API's resources.

### 4.1. Core Module (`TermiiModule`)

- **Dynamic Module:** The SDK will expose a dynamic `TermiiModule.forRoot()` and `TermiiModule.forRootAsync()` method for configuration.
- **Configuration:** Users must be able to configure the following:
  - `apiKey`: The secret API key from their Termii dashboard.
  - `senderId`: The default sender ID to use for messages.
  - `baseUrl`: The region-specific base URL for the API. This is crucial as Termii assigns different base URLs.
- **Service Injection:** The module will provide all the necessary services (e.g., `SmsService`, `TokenService`) to be injected into other NestJS providers, controllers, and services.

### 4.2. Insights API Module (`InsightsService`)

- **Get Balance:** Fetch the current account balance.
- **Search:** Verify phone numbers, check DND (Do-Not-Disturb) status, and identify network operators.
- **Get Status:** Check the delivery status of a message.
- **Get History:** Retrieve reports of inbound and outbound messages.

### 4.3. Messaging API Module (`MessagingService`)

- **Send Message:** Send a message to a single destination.
  - Supports multiple channels: `sms`, `whatsapp`.
  - Properly handle `dnd` (transactional) vs. `generic` routes.
- **Send Bulk Message:** Send the same message to multiple destinations in a single API call.
- **Device Template:** Send messages to a device using a pre-approved template.

### 4.4. Token API Module (`TokenService`)

- **Send Token:** Generate and send a one-time password (OTP).
  - Configurable message type (`numeric`, `alphanumeric`).
  - Configurable PIN length and time-to-live.
  - Support for multiple channels (`sms`, `whatsapp`, `voice`).
- **Verify Token:** Verify a token sent to a user.
- **In-App Token:** Generate a token that can be verified within the application without being sent to the user.

### 4.5. Sender ID API Module (`SenderIdService`)

- **List Sender IDs:** Retrieve all requested sender IDs and their statuses.
- **Request Sender ID:** Programmatically request a new sender ID.

### 4.6. Contacts API Module (`ContactsService`)

- **List Phonebooks:** Retrieve all phonebooks.
- **Create Phonebook:** Create a new phonebook.
- **Update Phonebook:** Update an existing phonebook.
- **Delete Phonebook:** Delete a phonebook.
- **List Contacts:** Retrieve all contacts in a given phonebook.
- **Add Contact:** Add a new contact to a phonebook.
- **Add Multiple Contacts:** Add contacts in bulk to a phonebook.
- **Delete Contact:** Delete a contact from a phonebook.

### 4.7. Campaigns API Module (`CampaignsService`)

- **Fetch Campaigns:** Retrieve all campaigns.
- **Fetch Campaign History:** Get the history and actions of a specific campaign.
- **Send Campaign:** Create and send a new campaign.

### 4.8. Conversations API Module (`ConversationsService`)

- **List Conversations:** Fetch all conversations.
- **Mark as Read/Unread:** Change the read status of a conversation.
- **Send Message:** Send a message within an existing conversation.

## 5. Technical Requirements

- **Framework:** Built for modern versions of NestJS.
- **HTTP Client:** Utilizes the `@nestjs/axios` package for all external HTTP requests.
- **Typing:** Strictly typed. All API request and response bodies will have corresponding TypeScript interfaces or DTOs. Enums will be used for fixed value fields (e.g., channels, message types).
- **Error Handling:** API errors from Termii (e.g., invalid API key, insufficient balance) will be caught and re-thrown as custom, descriptive NestJS exceptions (e.g., `TermiiApiKeyInvalidException`, `TermiiInsufficientBalanceException`).
- **Testing:** 100% unit test coverage for all services. E2E tests for critical paths.
- **CI/CD:** A GitHub Actions workflow will be set up to run linting, testing, and building on every push and pull request to the `main` branch.
- **Package:** Published to the `npm` registry.

## 6. Documentation and Developer Experience

- **README.md:** A comprehensive `README.md` file will include:
  - Installation instructions.
  - Quick start guide.
  - Detailed examples for configuring the module (`.forRoot` and `.forRootAsync`).
  - Usage examples for every single public method in every service.
  - Error handling guide.
  - Link to the official Termii API documentation.
- **Code Comments:** All public methods and interfaces will be documented with TSDoc comments.
- **Examples:** A separate `examples` directory or section in the documentation showing real-world use cases.

## 7. Non-Functional Requirements

- **Performance:** The SDK should add minimal overhead to the API requests.
- **Security:** The API key and other sensitive information should be handled securely. The SDK will not log sensitive data.
- **Reliability:** The SDK must be reliable and robust, with predictable behavior even when the Termii API is unavailable.

## 8. Out of Scope

- This SDK will not provide a frontend or a user interface.
- It will not manage API keys or other user credentials beyond configuration.
- It will only support the official Termii REST API. Other Termii products are out of scope.
