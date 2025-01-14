import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/server";

// Start server before all tests
beforeAll(() => server.listen());

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
