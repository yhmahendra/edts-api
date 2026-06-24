export const createUserInvalidCases = [
  {
    id: "NEG-001",
    description: "empty name field",
    payload: { name: "", job: "Engineer" },
  },
  {
    id: "NEG-002",
    description: "empty job field",
    payload: { name: "John Doe", job: "" },
  },
  {
    id: "NEG-003",
    description: "empty body",
    payload: {},
  },
];

export const updateUserInvalidCases = [
  {
    id: "NEG-004",
    description: "empty name on update",
    payload: { name: "", job: "Manager" },
  },
  {
    id: "NEG-005",
    description: "empty body on update",
    payload: {},
  },
];

export const getUserPageCases = [
  {
    id: "POS-006",
    description: "page 1",
    page: 1,
    expectedStatus: 200,
  },
  {
    id: "POS-007",
    description: "page 2",
    page: 2,
    expectedStatus: 200,
  },
  {
    id: "POS-008",
    description: "page with no users returns empty data",
    page: 999,
    expectedStatus: 200,
  },
];

export const getSingleUserCases = [
  {
    id: "POS-009",
    description: "existing user",
    userId: 2,
    expectedStatus: 200,
  },
  {
    id: "NEG-010",
    description: "non-existent user",
    userId: 999,
    expectedStatus: 404,
  },
];

export const deleteUserCases = [
  {
    id: "POS-011",
    description: "existing user",
    userId: 2,
    expectedStatus: 204,
  },
  {
    id: "POS-012",
    description: "non-existent user still returns 204 (idempotent)",
    userId: 999,
    expectedStatus: 204,
  },
];
