import { faker } from "@faker-js/faker";

export function payloadCreateUser() {
  return {
    name: faker.person.fullName(),
    job: faker.person.jobTitle(),
  };
}

export function payloadUpdateUser(overrides?: { name?: string; job?: string }) {
  return {
    name: overrides?.name ?? faker.person.fullName(),
    job: overrides?.job ?? faker.person.jobTitle(),
  };
}
