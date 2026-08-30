# Employee Management Application

A responsive Employee Management app for listing, searching, creating, updating, and deleting employee records against a REST API.

## Overview

The application loads employees from a remote API, lets users find a record by ID, and supports full CRUD through a validated form. Country names for the form come from a separate country endpoint. Missing API fields are shown as `NULL` rather than invented values.

## Features

- Employee listing (desktop table and mobile cards)
- Search by employee ID
- Add employee
- Edit employee (form is pre-filled)
- Delete employee with confirmation
- Country selection from the country API
- Client-side form validation
- Responsive layout
- Loading, error, and empty states

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- Material UI
- React Hook Form
- Zod
- Vitest
- React Testing Library
- MSW
- ESLint

## Getting Started

Requires Node.js and npm (the project is developed against current Node LTS).

```bash
cp .env.example .env
# Set VITE_API_BASE_URL in .env
npm install
npm run dev
```

Other commands:

```bash
npm run test      # Vitest in watch mode
npm run test:run  # Vitest once
npm run lint
npm run build
```

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL for employee and country endpoints (no trailing slash required) |

`.env` is gitignored. `.env.example` shows the required key with a placeholder. Do not commit real API URLs or secrets.

The app throws at startup if `VITE_API_BASE_URL` is missing.

## API Integration

All requests are relative to `VITE_API_BASE_URL`:

- `GET /employee` — list employees
- `GET /employee/:id` — get one employee
- `POST /employee` — create employee
- `PUT /employee/:id` — update employee
- `DELETE /employee/:id` — delete employee
- `GET /country` — list countries for the form dropdown

## State Management

- **RTK Query** holds server state (employees and countries), including cache tags so create/update/delete refresh the list.
- **Redux slice** (`employeesUi`) holds form mode, the employee being edited, and the success snackbar message.
- **Local React state** covers search-active vs list view and the employee pending delete confirmation.

Countries are requested only when Add or Edit is open. Later opens reuse the RTK Query cache.

## Component Architecture

Smart/business logic lives in the container. Presentational components receive data and callbacks.

- `EmployeeManagementContainer` — queries, mutations, and UI orchestration
- `EmployeeList` — table/cards and View more details
- `EmployeeForm` — add/edit dialog
- `EmployeeSearch` — search-by-ID form
- `DeleteEmployeeDialog` — delete confirmation
- Shared: `PageHeader`, `LoadingState`, `ErrorState`, `EmptyState`

Employee extra details (country ID, state, district, department) are rendered inside `EmployeeList` after View more, not as a separate details component.

```text
src/
├── app/            store, RTK Query base API, providers
├── features/
│   ├── employees/  API, container, presentational components, slice, types
│   └── countries/  country API and types
├── components/common/
├── schemas/
└── test/           MSW handlers, fixtures, render helpers
```

## Form Validation

Zod + React Hook Form, on both create and edit:

- **Name** — required, 2–50 characters, letters, spaces, periods, hyphens, and apostrophes
- **Email** — required, valid email, max 100 characters
- **Mobile** — required, 10–15 digits, no spaces or symbols
- **Country** — required (select)
- **State** — required, 2–50 characters
- **District** — required, 2–50 characters

Invalid forms are not submitted.

## Error Handling

- List GET failure with Retry
- Search 404: “Employee not found”
- Other search failures shown as an error
- Form validation messages on each field
- Create/update/delete API failures stay on the form or delete dialog (no false success)
- Country GET failure is shown in the form
- Empty list and not-found states
- Delete requires confirmation before calling the API

## Testing

Tests use Vitest, React Testing Library, and MSW. Handlers mock employee and country HTTP calls against `http://localhost/api/v1`. Unhandled requests fail the test. Tests do not call the real MockAPI.

Covered behaviors include listing, search (found / not found / error / clear), CRUD success, create/update/delete failures, country dropdown and country GET failure, list retry, and form validation.

```bash
npm run test
npm run test:run
```

## Responsive Design

- **Desktop (`sm` and up):** table with Avatar, ID, Name, Email, Mobile, Country, and Actions
- **Mobile:** card list with the same summary fields
- View more reveals Country ID, State, District, and Department when the API provided them (otherwise `NULL`)

## Assumptions / MockAPI Limitations

- Employee `country` is a country name string, not a nested object.
- The country API can return duplicate names; the dropdown keeps one option per name and maps `countryId` from the selected name when a match exists.
- State and District are free-text; there is no state/district API.
- The form uses `email`. `emailId` is not the form email field and is not shown in the list.
- Missing or invalid faker values (for example some mobile strings) display as `NULL`.
- On update, extra API fields such as `department`, `emailId`, and `avatar` are sent back if they were already on the record, so a full PUT does not wipe them.
- `GET /country` runs when the add/edit form opens, not on initial page load.
