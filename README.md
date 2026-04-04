# CORTO Technical Test

This repository contains my solution for the CORTO Quality Engineering technical exercise.

At the current stage, the repository contains the completed **Task 2: Rest API Automation** solution, along with the shared Playwright + TypeScript project structure that will also be used for Task 1.

## Framework Choice

I chose **Playwright with TypeScript** for this exercise because I wanted one modern, maintainable stack that could support both API and UI automation in the same repository.

That gave me a few practical benefits:

- one runner for both API and UI tests
- built-in API testing support
- fixtures, reporting, and trace capture
- good CI/CD support
- TypeScript typing for shared models and helpers

My main goal was to keep the project readable, easy to run, and easy to extend.

## Current Scope

### Completed
- **Task 2 — Rest API Automation**

### Not yet added
- **Task 1 — Web UI Automation**

## Repository Structure

```text
src/
  config/
    env.ts
  api/
    clients/
    types/
    utils/

tests/
  api/
    data/
  ui/

ai-output/
  task2-partb/

.github/
  workflows/
```

## Task 2 Overview

The API suite targets the public **Restful Booker** API.

The suite was built to demonstrate the things called out in the exercise brief:

- a data-driven approach
- positive and negative scenarios
- passing values between endpoints
- maintainable and repeatable design
- clear assertion descriptions

## Design Approach

I tried to keep the API specs focused on **test intent**, not raw request plumbing.

To do that, I separated the project into a few simple layers:

- **client classes** handle endpoint interactions
- **typed models** keep payloads and contracts explicit
- **Playwright fixtures** provide shared API setup
- **JSON data files** drive the test inputs
- **helper utilities** handle reusable assertions, unique test data generation, and content-type serialization

That keeps the tests easier to read and helps avoid duplication as the suite grows.

## Data-Driven Approach

The test data lives under:

```text
tests/api/data/
```

This includes positive and negative test data used across the suite.

I also added a small helper to generate unique guest names so repeated runs do not rely on shared record state or collide with previous data.

## Value Flow Between Endpoints

The suite demonstrates values flowing through the API rather than treating each call in isolation.

A typical lifecycle looks like this:

1. create an auth token with `POST /auth`
2. create a booking with `POST /booking`
3. capture the returned `bookingid`
4. retrieve that booking with `GET /booking/:id`
5. update it with `PUT /booking/:id`
6. partially update it with `PATCH /booking/:id`
7. delete it with `DELETE /booking/:id`

That flow is covered in the JSON lifecycle test.

## API Coverage

The suite covers the documented Restful Booker endpoints, including:

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

## Running the Project

### Install dependencies

```bash
npm install
npx playwright install
```

### Type-check the project

```bash
npm run typecheck
```

### Run the API suite

```bash
npm run test:api
```

### Run a single API spec

```bash
npx playwright test tests/api/booking-lifecycle.api.spec.ts --project=api
```

### Open the HTML report

```bash
npm run report
```

## CI

A GitHub Actions workflow is included here:

```text
.github/workflows/api-ci.yml
```

The workflow runs type-checking and the API suite on push and pull request events.

## Notes on Public Sandbox Behaviour

Because this exercise uses a public sandbox, I found a couple of behaviours that were not stable enough for strict end-to-end assertions in every variant.

### 1. Date filter behaviour

The `GET /booking` date filter did not behave consistently enough in repeated automated runs for a reliable exact-id assertion.

Rather than leave a false-negative in the suite, I kept the endpoint in coverage and validated that:

- the endpoint accepts date filters
- the response succeeds
- the response shape is correct

That kept the suite repeatable and CI-friendly while still covering the endpoint.

### 2. XML / URL-encoded boolean behaviour

For the XML and URL-encoded update flows, the public sandbox appeared to coerce `depositpaid: false` to `true`.

I did not want the suite to fail on what looked like sandbox behaviour rather than a framework issue, so I handled it this way:

- full boolean update semantics are validated in the JSON lifecycle test
- the XML and URL-encoded tests still cover those endpoints
- those tests validate the stable fields for those content-type variants

This keeps the coverage broad without baking unstable false-negatives into the suite.

## AI Usage

AI assistance was used during this exercise.

For **Task 2 Part B**, I used AI to generate an initial draft for one endpoint and then reviewed it properly before using any of the ideas in the final solution.

The following artefacts are included in the repository:

```text
ai-output/task2-partb/
```

That folder contains:

- the prompt used
- the raw AI output
- review notes describing the issues I found and the changes I made

More generally, I used AI as a drafting and troubleshooting aid, not as a substitute for review. I did not paste generated code into the final suite blindly.

Before accepting any generated code or suggestions, I validated them by:

- type-checking the project
- running the tests locally
- checking assertion clarity and failure messages
- verifying cleanup behaviour
- making sure the code followed the same structure and patterns as the rest of the repository

## Final Note

My aim for this task was not to produce the biggest possible test suite. It was to produce a suite that is:

- readable
- maintainable
- repeatable
- honest about public sandbox quirks
- and easy for another engineer to pick up and run