```md
# Review Notes and Improvements Made

I used AI to generate an initial draft for automating the `PATCH /booking/:id` endpoint.

I did **not** merge the raw output directly into the final suite. I reviewed it and improved it before relying on the implementation approach in the repository.

## Issues in the raw AI output

1. It hard-coded the base URL instead of using shared environment configuration.
2. It used direct request calls inline instead of the client/fixture structure used in the repository.
3. It hard-coded request payloads instead of using the shared JSON test data approach.
4. It did not generate unique booking names, which could cause collisions in repeated test runs.
5. It had minimal assertion descriptions, which makes failures less useful.
6. It did not align with the maintainable design patterns used elsewhere in the suite.
7. It did not reuse shared assertion helpers.
8. It mixed setup, execution, validation, and cleanup in a single block without the clearer separation used in the final code.

## Improvements in the final repository implementation

- Used shared Playwright fixtures from `tests/api/api.fixtures.ts`
- Used client classes from `src/api/clients`
- Used typed models from `src/api/types`
- Used reusable assertion helpers from `src/api/utils/assertions.ts`
- Used JSON-driven test data from `tests/api/data`
- Used unique booking data generation with `withUniqueGuest`
- Used clearer assertion descriptions
- Used a more maintainable lifecycle-style structure

## Final note

The AI output was useful as a starting point, but it did not meet my quality bar without review. I validated the final implementation by:

- running the tests locally
- checking assertion behaviour
- verifying cleanup
- and aligning the code with the design patterns used across the rest of the suite