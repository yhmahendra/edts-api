import supertest from "supertest";

const request = supertest(process.env.REQRES_URL ?? "https://reqres.in");

const JSON_HEADERS = {
  "Content-Type": "application/json",
  ...(process.env.REQRES_API_KEY ? { "x-api-key": process.env.REQRES_API_KEY } : {}),
};

export const createUser = (body: object) =>
  request.post("/api/users").set(JSON_HEADERS).send(body);

export const getAllUsersPaged = (page: number) =>
  request.get("/api/users").set(JSON_HEADERS).query({ page });

export const updateUser = (userId: number, body: object) =>
  request.put(`/api/users/${userId}`).set(JSON_HEADERS).send(body);

export const getSingleUser = (userId: number) =>
  request.get(`/api/users/${userId}`).set(JSON_HEADERS);

export const deleteUser = (userId: number) =>
  request.delete(`/api/users/${userId}`).set(JSON_HEADERS);
