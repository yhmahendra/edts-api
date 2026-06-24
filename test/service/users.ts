import { expect } from "chai";
import * as endpoint from "@endpoint/users";
import * as payload from "@data/payload/users";
import * as testData from "@data/test/users";
import * as scenario from "@data/scenario/users";
import * as expectedCondition from "@utils/expected-response";

let createdUserId: string = "";

describe("Service Users (reqres.in):", function () {

  // Step 1: POST /api/users
  it("POS-001 - POST create user with valid payload", async () => {
    const body = payload.payloadCreateUser();
    const response = await endpoint.createUser(body);

    expectedCondition.expectStatusCode(response, 201);
    expectedCondition.expectBodyHasKeys(response, ["id", "name", "job", "createdAt"]);
    expectedCondition.expectStringNotEmpty(response.body.id as string, "id");
    expectedCondition.expectIsIsoDate(response.body.createdAt as string, "createdAt");
    expectedCondition.expectBodyMatchesPayload(response, body);

    createdUserId = response.body.id as string;
  });

  it("POS-001b - POST create user returns unique id each time", async () => {
    const body = payload.payloadCreateUser();
    const response = await endpoint.createUser(body);

    expectedCondition.expectStatusCode(response, 201);
    expect(response.body.id).to.be.a("string").and.not.equal(createdUserId);
  });

  scenario.createUserInvalidCases.forEach((tc) => {
    it(`${tc.id} - POST create user with ${tc.description}`, async () => {
      const response = await endpoint.createUser(tc.payload);

      expectedCondition.expectStatusCode(response, 201);
      expectedCondition.expectBodyHasKeys(response, ["id", "createdAt"]);
    });
  });

  // Step 2: GET /api/users?page=2
  it("POS-002 - GET users page 2 returns paginated list", async () => {
    const response = await endpoint.getAllUsersPaged(testData.PAGE_WITH_DATA);

    expectedCondition.expectStatusCode(response, 200);
    expectedCondition.expectBodyHasKeys(response, ["page", "per_page", "total", "total_pages", "data", "support"]);
    expect(response.body.page).to.equal(testData.PAGE_WITH_DATA);
    expectedCondition.expectArrayNotEmpty(response.body.data as unknown[]);

    const firstUser = (response.body.data as Record<string, unknown>[])[0];
    expect(firstUser).to.have.all.keys(["id", "email", "first_name", "last_name", "avatar"]);
  });

  it("POS-002b - GET users each item has non-empty email, avatar and valid id", async () => {
    const response = await endpoint.getAllUsersPaged(testData.PAGE_WITH_DATA);
    const users = response.body.data as { email: string; avatar: string; id: number }[];

    users.forEach((user) => {
      expectedCondition.expectStringNotEmpty(user.email, "email");
      expectedCondition.expectStringNotEmpty(user.avatar, "avatar");
      expect(user.id).to.be.a("number").and.greaterThan(0);
    });
  });

  it("POS-002c - GET users total and total_pages are positive numbers", async () => {
    const response = await endpoint.getAllUsersPaged(testData.PAGE_WITH_DATA);

    expect(response.body.total).to.be.a("number").and.greaterThan(0);
    expect(response.body.total_pages).to.be.a("number").and.greaterThan(0);
  });

  it("NEG-002a - GET users page 999 returns empty data array", async () => {
    const response = await endpoint.getAllUsersPaged(testData.PAGE_WITHOUT_DATA);

    expectedCondition.expectStatusCode(response, 200);
    expectedCondition.expectArrayEmpty(response.body.data as unknown[]);
  });

  // Step 3: PUT /api/users/2
  it("POS-003 - PUT update user returns 200 with updatedAt", async () => {
    const body = payload.payloadUpdateUser();
    const response = await endpoint.updateUser(testData.EXISTING_USER_ID, body);

    expectedCondition.expectStatusCode(response, 200);
    expectedCondition.expectBodyHasKeys(response, ["name", "job", "updatedAt"]);
    expectedCondition.expectBodyMatchesPayload(response, body);
    expectedCondition.expectIsIsoDate(response.body.updatedAt as string, "updatedAt");
  });

  it("POS-003b - PUT update user updatedAt is a recent timestamp", async () => {
    const body = payload.payloadUpdateUser();
    const before = Date.now();
    const response = await endpoint.updateUser(testData.EXISTING_USER_ID, body);
    const after = Date.now();

    const updatedAt = new Date(response.body.updatedAt as string).getTime();
    expect(updatedAt).to.be.gte(before - 5000).and.lte(after + 5000);
  });

  it("POS-003c - PUT update user reflects exact name and job sent", async () => {
    const body = payload.payloadUpdateUser({ name: "Alice Test", job: "QA Engineer" });
    const response = await endpoint.updateUser(testData.EXISTING_USER_ID, body);

    expectedCondition.expectStatusCode(response, 200);
    expect(response.body.name).to.equal("Alice Test");
    expect(response.body.job).to.equal("QA Engineer");
  });

  scenario.updateUserInvalidCases.forEach((tc) => {
    it(`${tc.id} - PUT update user with ${tc.description}`, async () => {
      const response = await endpoint.updateUser(testData.EXISTING_USER_ID, tc.payload);

      expectedCondition.expectStatusCode(response, 200);
      expectedCondition.expectBodyHasKeys(response, ["updatedAt"]);
    });
  });

  it("NEG-003a - PUT update non-existent user still returns 200", async () => {
    const body = payload.payloadUpdateUser();
    const response = await endpoint.updateUser(testData.NON_EXISTENT_USER_ID, body);

    expectedCondition.expectStatusCode(response, 200);
  });

  // Step 4: GET /api/users/2
  it("POS-004 - GET single user returns correct data", async () => {
    const response = await endpoint.getSingleUser(testData.EXISTING_USER_ID);

    expectedCondition.expectStatusCode(response, 200);
    expectedCondition.expectBodyHasKeys(response, ["data", "support"]);

    const user = response.body.data as typeof testData.knownUser & { avatar: string };
    expect(user.id).to.equal(testData.knownUser.id);
    expect(user.email).to.equal(testData.knownUser.email);
    expect(user.first_name).to.equal(testData.knownUser.first_name);
    expect(user.last_name).to.equal(testData.knownUser.last_name);
    expectedCondition.expectStringNotEmpty(user.avatar, "avatar");
  });

  it("POS-004b - GET single user data has all required fields", async () => {
    const response = await endpoint.getSingleUser(testData.EXISTING_USER_ID);
    const user = response.body.data as Record<string, unknown>;

    expect(user).to.have.all.keys(["id", "email", "first_name", "last_name", "avatar"]);
    expect(user.id).to.be.a("number");
    expect(user.email).to.be.a("string").that.includes("@");
  });

  it("NEG-004a - GET single user with non-existent id returns 404 and empty body", async () => {
    const response = await endpoint.getSingleUser(testData.NON_EXISTENT_USER_ID);

    expectedCondition.expectStatusCode(response, 404);
    expect(response.body).to.deep.equal({});
  });

  // Step 5: DELETE /api/users/2
  it("POS-005 - DELETE user returns 204 with no body", async () => {
    const response = await endpoint.deleteUser(testData.EXISTING_USER_ID);

    expectedCondition.expectStatusCode(response, 204);
    expect(response.body).to.deep.equal({});
  });

  scenario.deleteUserCases.forEach((tc) => {
    it(`${tc.id} - DELETE ${tc.description} returns ${tc.expectedStatus}`, async () => {
      const response = await endpoint.deleteUser(tc.userId);

      expectedCondition.expectStatusCode(response, tc.expectedStatus);
    });
  });

});
