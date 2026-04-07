# CORTO Technical Test

This repository contains my solution for the CORTO Quality Engineering technical exercise.

I used **Playwright with TypeScript** so both the API and UI automation could live in the same project, share patterns, and run cleanly in CI.

## Current Scope

Completed in this repository:

- **Task 1 — Web UI Automation**
- **Task 2 — Rest API Automation**

## Repository Structure

```text
src/
  config/
    env.ts
  api/
    clients/
    types/
    utils/
  ui/
    api/
    pages/
    utils/

tests/
  api/
    data/
  ui/
    data/

ai-output/
  task2-partb/

.github/
  workflows/
```

## Why Playwright + TypeScript

I chose Playwright + TypeScript because it gave me:

- one framework for both API and UI automation
- built-in API support
- a modern test runner with fixtures and reporting
- strong TypeScript typing for shared helpers and models
- straightforward CI integration

My goal was to keep the solution maintainable and easy for another engineer to review and run.

---

# Task 1 — Web UI Automation

This task targets the DemoQA mini Book Store website.

I intentionally left **User Registration** out of scope, which the exercise explicitly allows. For the authenticated flows, I used the Book Store API for setup and cleanup so the UI tests could stay focused on user behaviour rather than account creation and test data preparation.

## Task 1 Design Approach

For the UI automation, I used:

- **page objects** for the main pages
- **fixtures** to keep setup clean
- **JSON test data** for reusable values
- **API-assisted setup/cleanup** for authenticated flows
- selectors based on visible behaviour where possible

I kept the UI coverage focused on a small number of stable, high-value scenarios rather than trying to automate the entire site.

## Task 1 UI Coverage

The UI suite covers:

- searching the catalog for a known title
- confirming a no-match search hides known books
- selecting a title and validating the selected route / visible row
- logging in with a valid user
- logging out from the profile page
- confirming a pre-associated book is visible in the user’s profile collection

## Task 1 Notes on Public Sandbox Behaviour

A few behaviours on the public demo site affected how I designed the UI tests:

1. **Book selection route**
   - The live site behaves more like a selected search route (`/books?search=<isbn>`) than a classic standalone details page.
   - I aligned the test with the actual stable behaviour of the public site rather than forcing a brittle expectation.

2. **Authenticated setup**
   - I used API-assisted setup for authenticated UI scenarios so the tests could focus on the UI behaviour being validated.
   - Temporary users are created per run to keep test isolation simple.

3. **Cleanup**
   - Cleanup is best-effort because the public sandbox can be inconsistent with destructive cleanup calls.
   - Unique users and isolated test data prevent that from affecting the core assertions.

---

# Task 2 — Rest API Automation

This task targets the public Restful Booker API.

The API suite was designed to show:

- a **data-driven** approach
- **positive and negative** coverage
- **value passing** between endpoints
- maintainable, reusable test structure
- clear assertion descriptions

## Task 2 Design Approach

I kept the API specs thin and pushed the reusable logic into a few layers:

- **client classes** for endpoint interactions
- **typed models** for payloads and contracts
- **fixtures** for shared setup
- **JSON test data** for positive and negative scenarios
- **utility helpers** for reusable assertions, serialization, and unique data generation

That keeps the specs focused on the intent of the test rather than raw request plumbing.

## Task 2 API Coverage

The API suite covers the documented Restful Booker endpoints, including:

- `GET /ping`
- `POST /auth`
- `GET /booking`
  - all booking ids
  - filter by firstname / lastname
  - date-filter contract validation
  - impossible filter / empty result case
- `GET /booking/:id`
- `POST /booking`
  - JSON
  - XML
  - URL-encoded
- `PUT /booking/:id`
  - JSON
  - XML
  - URL-encoded
- `PATCH /booking/:id`
  - JSON
  - XML
  - URL-encoded
- `DELETE /booking/:id`

## Task 2 Notes on Public Sandbox Behaviour

While building the API suite, I found two public-sandbox quirks that were not stable enough for strict assertions in every variant:

1. **Date filter behaviour**
   - The date filter was inconsistent enough that exact-id assertions were unreliable in repeated runs.
   - I kept the endpoint in coverage and validated the contract and response shape instead.

2. **XML / URL-encoded boolean behaviour**
   - In the XML and URL-encoded update flows, the public sandbox appeared to coerce `depositpaid: false` to `true`.
   - I kept those endpoints in coverage and validated the stable fields, while full boolean update semantics remain covered in the JSON lifecycle test.

---

# Running the Project

## Install dependencies

```bash
npm install
npx playwright install
```

## Type-check the project

```bash
npm run typecheck
```

## Run the API suite

```bash
npm run test:api
```

## Run the UI suite

```bash
npm run test:ui
```

## Run a single API spec

```bash
npx playwright test tests/api/booking-lifecycle.api.spec.ts --project=api
```

## Run a single UI spec

```bash
npx playwright test tests/ui/login.ui.spec.ts --project=ui-chromium --workers=1
```

## Open the HTML report

```bash
npm run report
```

---

# CI

The repository includes CI workflows for both API and UI execution:

```text
.github/workflows/api-ci.yml
.github/workflows/ui-ci.yml
```

The API workflow runs the API suite.

The UI workflow runs the UI suite conservatively against the public demo site to reduce flakiness from the sandbox environment.

---

# AI Usage

AI assistance was used during this exercise.

For **Task 2 Part B**, I used AI to generate an initial draft for one endpoint and included the following in the repository:

```text
ai-output/task2-partb/
```

That folder contains:

- the prompt used
- the raw AI output
- review notes describing the corrections and improvements I made

More broadly, I also used AI as a troubleshooting aid while stabilising the public sandbox tests. In particular, I used AI-assisted review of traces, screenshots, videos, selector behaviour, and route/timeline changes to narrow down issues such as:

- the selected-book route on the DemoQA Book Store page
- ambiguous or unstable UI locators
- token setup for authenticated UI flows
- cleanup inconsistencies in the public demo environment

I did not blindly paste generated code into the final solution.

Before accepting any generated output or suggested change, I validated it by:

- type-checking the project
- rerunning the affected tests locally
- checking assertion clarity and failure messages
- verifying cleanup behaviour
- keeping the code consistent with the rest of the framework structure

I also used AI to help refine parts of the README for clarity, structure, and completeness.

I treated this the same way I treated code-related AI assistance: I did not accept generated wording blindly. I reviewed the final documentation against the repository contents, the exercise brief, the actual commands required to run the project, and the trade-offs I had made during implementation to ensure the README remained accurate and representative of the final solution.

## Final Note

My aim was not to produce the biggest possible test suite. It was to produce something that is:

- readable
- maintainable
- repeatable
- honest about public sandbox behaviour
- and easy for another engineer to pick up and run
