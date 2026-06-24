import { expect } from "chai";

type ApiResponse = {
  status: number;
  body: unknown;
};

export function expectStatusCode(response: ApiResponse, expectedStatus: number): void {
  expect(response.status, `Expected status ${expectedStatus} but got ${response.status}`).to.equal(expectedStatus);
}

export function expectBodyProperty(response: ApiResponse, path: string, expectedValue: unknown): void {
  const parts = path.split(".");
  let current: unknown = response.body;
  for (const part of parts) {
    expect(current, `Path "${path}" not reachable at "${part}"`).to.be.an("object").that.has.property(part);
    current = (current as Record<string, unknown>)[part];
  }
  expect(current, `Expected body.${path} to equal ${String(expectedValue)}`).to.equal(expectedValue);
}

export function expectBodyHasKeys(response: ApiResponse, keys: string[]): void {
  expect(response.body).to.be.an("object").that.includes.all.keys(keys);
}

export function expectArrayNotEmpty(arr: unknown[]): void {
  expect(arr).to.be.an("array").that.is.not.empty;
}

export function expectArrayEmpty(arr: unknown[]): void {
  expect(arr).to.be.an("array").that.is.empty;
}

export function expectStringNotEmpty(value: string, fieldName: string): void {
  expect(value, `${fieldName} should not be empty`).to.be.a("string").that.is.not.empty;
}

export function expectIsIsoDate(value: string, fieldName: string): void {
  const isValid = !isNaN(Date.parse(value));
  expect(isValid, `${fieldName} should be a valid ISO date string, got: ${value}`).to.be.true;
}

export function expectBodyMatchesPayload(
  response: ApiResponse,
  payload: Record<string, unknown>
): void {
  for (const [key, val] of Object.entries(payload)) {
    expect((response.body as Record<string, unknown>)[key], `body.${key} mismatch`).to.equal(val);
  }
}
