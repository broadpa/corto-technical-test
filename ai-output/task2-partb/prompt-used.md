# Prompt Used

Generate a Playwright TypeScript API test for the Restful Booker `PATCH /booking/:id` endpoint.

Requirements:
- Use Playwright test runner
- Authenticate using `POST /auth`
- Create a booking first
- Patch the booking using `PATCH /booking/:id`
- Verify the patched values using `GET /booking/:id`
- Clean up with `DELETE /booking/:id`
- Keep the code simple and readable