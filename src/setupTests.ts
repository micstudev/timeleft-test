import "@testing-library/jest-dom";

// Ensure Jest globals are available
global.jest = jest;

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};
