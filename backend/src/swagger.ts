export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Ticket Support System API",
    version: "1.0.0",
    description: "REST API для системи заявок в техпідтримку",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Users", description: "Управління користувачами" },
    { name: "Statuses", description: "Управління статусами" },
    { name: "Tickets", description: "Управління тікетами" },
    { name: "TicketMessages", description: "Повідомлення до тікетів" },
  ],
  components: {
    schemas: {
      UserResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", minLength: 2, example: "John Doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
        },
      },
      StatusResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          name: { type: "string", example: "Open" },
          color: { type: "string", example: "#3498db" },
        },
      },
      CreateStatusRequest: {
        type: "object",
        required: ["name", "color"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 50, example: "Pending" },
          color: { type: "string", example: "#9b59b6" },
        },
      },
      TicketResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          subject: { type: "string", example: "Server is down" },
          message: { type: "string", example: "Production server stopped responding" },
          priority: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
          statusId: { type: "string", example: "uuid" },
          authorId: { type: "string", example: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateTicketRequest: {
        type: "object",
        required: ["subject", "message", "priority", "statusId", "authorId"],
        properties: {
          subject: { type: "string", minLength: 3, maxLength: 100, example: "Server is down" },
          message: { type: "string", minLength: 10, maxLength: 1000, example: "Production server stopped responding since morning" },
          priority: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
          statusId: { type: "string", example: "uuid" },
          authorId: { type: "string", example: "uuid" },
        },
      },
      UpdateTicketRequest: {
        type: "object",
        properties: {
          subject: { type: "string", minLength: 3, maxLength: 100 },
          message: { type: "string", minLength: 10, maxLength: 1000 },
          priority: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
          statusId: { type: "string" },
        },
      },
      TicketMessageResponse: {
        type: "object",
        properties: {
          id: { type: "string", example: "uuid" },
          ticketId: { type: "string", example: "uuid" },
          authorId: { type: "string", example: "uuid" },
          content: { type: "string", example: "Hello, I need help" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateTicketMessageRequest: {
        type: "object",
        required: ["authorId", "content"],
        properties: {
          authorId: { type: "string", example: "uuid" },
          content: { type: "string", minLength: 2, maxLength: 500, example: "Hello, I need help" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "VALIDATION_ERROR" },
              message: { type: "string", example: "Invalid request body" },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Отримати всіх користувачів",
        responses: {
          200: {
            description: "Список користувачів",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/UserResponse" } },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Створити користувача",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Користувача створено",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } },
          },
          400: {
            description: "Помилка валідації",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Отримати користувача за ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Користувач", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Оновити користувача",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
        },
        responses: {
          200: { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Часткове оновлення користувача",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
        },
        responses: {
          200: { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/UserResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Видалити користувача",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Видалено" },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/statuses": {
      get: {
        tags: ["Statuses"],
        summary: "Отримати всі статуси",
        responses: {
          200: {
            description: "Список статусів",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/StatusResponse" } },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Statuses"],
        summary: "Створити статус",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateStatusRequest" } } },
        },
        responses: {
          201: { description: "Створено", content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } } },
          400: { description: "Помилка валідації", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/statuses/{id}": {
      get: {
        tags: ["Statuses"],
        summary: "Отримати статус за ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Статус", content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Statuses"],
        summary: "Оновити статус",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateStatusRequest" } } },
        },
        responses: {
          200: { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/StatusResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Statuses"],
        summary: "Видалити статус",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Видалено" },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "Отримати всі тікети",
        parameters: [
          { name: "priority", in: "query", schema: { type: "string", enum: ["Low", "Medium", "High", "Critical"] } },
          { name: "statusId", in: "query", schema: { type: "string" } },
          { name: "authorId", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt", "subject", "priority"] } },
          { name: "sortDir", in: "query", schema: { type: "string", enum: ["asc", "desc"] } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "pageSize", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            description: "Список тікетів",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/TicketResponse" } },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Створити тікет",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTicketRequest" } } },
        },
        responses: {
          201: { description: "Створено", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketResponse" } } } },
          400: { description: "Помилка валідації", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Автор або статус не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tickets/{id}": {
      get: {
        tags: ["Tickets"],
        summary: "Отримати тікет за ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Тікет", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      put: {
        tags: ["Tickets"],
        summary: "Оновити тікет",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTicketRequest" } } },
        },
        responses: {
          200: { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Tickets"],
        summary: "Часткове оновлення тікету",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTicketRequest" } } },
        },
        responses: {
          200: { description: "Оновлено", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketResponse" } } } },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Tickets"],
        summary: "Soft delete тікету",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Видалено" },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tickets/{ticketId}/messages": {
      get: {
        tags: ["TicketMessages"],
        summary: "Отримати повідомлення тікету",
        parameters: [{ name: "ticketId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Список повідомлень",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/TicketMessageResponse" } },
                    total: { type: "number" },
                  },
                },
              },
            },
          },
          404: { description: "Тікет не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["TicketMessages"],
        summary: "Додати повідомлення до тікету",
        parameters: [{ name: "ticketId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTicketMessageRequest" } } },
        },
        responses: {
          201: { description: "Створено", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketMessageResponse" } } } },
          400: { description: "Помилка валідації", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "Тікет не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/tickets/{ticketId}/messages/{messageId}": {
      delete: {
        tags: ["TicketMessages"],
        summary: "Видалити повідомлення",
        parameters: [
          { name: "ticketId", in: "path", required: true, schema: { type: "string" } },
          { name: "messageId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          204: { description: "Видалено" },
          404: { description: "Не знайдено", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};