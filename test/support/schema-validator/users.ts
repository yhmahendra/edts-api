export const createUserSchema = {
  type: "object",
  required: ["name", "job", "id", "createdAt"],
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    job: { type: "string" },
    id: { type: "string" },
    createdAt: { type: "string" },
  },
};

export const updateUserSchema = {
  type: "object",
  required: ["name", "job", "updatedAt"],
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    job: { type: "string" },
    updatedAt: { type: "string" },
  },
};

export const getUserListSchema = {
  type: "object",
  required: ["page", "per_page", "total", "total_pages", "data", "support"],
  properties: {
    page: { type: "number" },
    per_page: { type: "number" },
    total: { type: "number" },
    total_pages: { type: "number" },
    data: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "email", "first_name", "last_name", "avatar"],
        properties: {
          id: { type: "number" },
          email: { type: "string" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          avatar: { type: "string" },
        },
      },
    },
    support: {
      type: "object",
      required: ["url", "text"],
      properties: {
        url: { type: "string" },
        text: { type: "string" },
      },
    },
  },
};

export const getSingleUserSchema = {
  type: "object",
  required: ["data", "support"],
  properties: {
    data: {
      type: "object",
      required: ["id", "email", "first_name", "last_name", "avatar"],
      properties: {
        id: { type: "number" },
        email: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        avatar: { type: "string" },
      },
    },
    support: {
      type: "object",
      required: ["url", "text"],
      properties: {
        url: { type: "string" },
        text: { type: "string" },
      },
    },
  },
};

export const notFoundSchema = {
  type: "object",
  properties: {},
};
