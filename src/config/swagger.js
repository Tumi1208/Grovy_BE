const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const port = `${process.env.PORT || 5000}`.trim() || "5000";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Grovy API",
      version: "1.0.0",
      description:
        "Backend API documentation for the Grovy grocery mobile app.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        MessageResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Grovy backend is running.",
            },
          },
          required: ["message"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Please sign in to continue.",
            },
          },
          required: ["message"],
        },
        NotificationSettings: {
          type: "object",
          properties: {
            orderUpdates: {
              type: "boolean",
              example: true,
            },
            promotions: {
              type: "boolean",
              example: false,
            },
            deliveryReminders: {
              type: "boolean",
              example: true,
            },
            restockAlerts: {
              type: "boolean",
              example: false,
            },
          },
          required: [
            "orderUpdates",
            "promotions",
            "deliveryReminders",
            "restockAlerts",
          ],
        },
        UserAddress: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: "681624ab9d4f7a5f0b21d002",
            },
            label: {
              type: "string",
              example: "Home",
            },
            recipientName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phoneNumber: {
              type: "string",
              example: "+84901234567",
            },
            addressLine: {
              type: "string",
              example: "123 Le Loi",
            },
            area: {
              type: "string",
              example: "District 1",
            },
            notes: {
              type: "string",
              example: "Leave at the front desk",
            },
            isDefault: {
              type: "boolean",
              example: true,
            },
          },
          required: [
            "id",
            "label",
            "recipientName",
            "phoneNumber",
            "addressLine",
            "area",
            "notes",
            "isDefault",
          ],
        },
        PaymentMethod: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: "681624ab9d4f7a5f0b21d003",
            },
            type: {
              type: "string",
              enum: ["cash", "card"],
              example: "cash",
            },
            label: {
              type: "string",
              example: "Cash on Delivery",
            },
            description: {
              type: "string",
              example: "Pay when your groceries arrive.",
            },
            brand: {
              type: "string",
              example: "",
            },
            cardholderName: {
              type: "string",
              example: "",
            },
            last4: {
              type: "string",
              example: "",
            },
            expiry: {
              type: "string",
              example: "",
            },
            isDefault: {
              type: "boolean",
              example: true,
            },
          },
          required: [
            "id",
            "type",
            "label",
            "description",
            "brand",
            "cardholderName",
            "last4",
            "expiry",
            "isDefault",
          ],
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: "681624ab9d4f7a5f0b21d001",
            },
            displayName: {
              type: "string",
              example: "Nguyen Van A",
            },
            name: {
              type: "string",
              example: "Nguyen Van A",
            },
            email: {
              type: "string",
              format: "email",
              example: "example123@example.com",
            },
            phone: {
              type: "string",
              example: "+84901234567",
            },
            avatarUrl: {
              type: "string",
              example: "https://example.com/avatar.png",
            },
            role: {
              type: "string",
              enum: ["user", "owner"],
              example: "user",
            },
            notificationSettings: {
              $ref: "#/components/schemas/NotificationSettings",
            },
            addresses: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UserAddress",
              },
            },
            paymentMethods: {
              type: "array",
              items: {
                $ref: "#/components/schemas/PaymentMethod",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-03T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-03T10:00:00.000Z",
            },
          },
          required: [
            "id",
            "displayName",
            "name",
            "email",
            "phone",
            "avatarUrl",
            "role",
            "notificationSettings",
            "addresses",
            "paymentMethods",
            "createdAt",
            "updatedAt",
          ],
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            message: {
              type: "string",
              example: "Signed in successfully.",
            },
          },
          required: ["token", "user", "message"],
        },
        CurrentUserResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
          },
          required: ["user"],
        },
        UserUpdateResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            message: {
              type: "string",
              example: "Profile updated successfully.",
            },
          },
          required: ["user", "message"],
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "apple-gala-1kg",
            },
            name: {
              type: "string",
              example: "Apple Gala 1kg",
            },
            slug: {
              type: "string",
              example: "apple-gala-1kg",
            },
            price: {
              type: "number",
              format: "float",
              example: 3.99,
            },
            category: {
              type: "string",
              example: "Fruits",
            },
            description: {
              type: "string",
              example: "Fresh Gala apples sold by the kilogram.",
            },
            stock: {
              type: "number",
              example: 25,
            },
            imageKey: {
              type: "string",
              example: "apple-gala-1kg",
            },
          },
          required: [
            "id",
            "name",
            "slug",
            "price",
            "category",
            "description",
            "stock",
            "imageKey",
          ],
        },
        ProductListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Product",
              },
            },
            total: {
              type: "integer",
              example: 2,
            },
          },
          required: ["items", "total"],
        },
        HealthStatus: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2026-05-03T10:00:00.000Z",
            },
            apiMode: {
              type: "string",
              example: "mvp",
            },
            productSourceMode: {
              type: "string",
              example: "local",
            },
            productSource: {
              type: "string",
              example: "local-json",
            },
            orderSource: {
              type: "string",
              example: "memory",
            },
            mongoConfigured: {
              type: "boolean",
              example: false,
            },
            mongoState: {
              type: "string",
              example: "disconnected",
            },
          },
          required: [
            "status",
            "timestamp",
            "apiMode",
            "productSourceMode",
            "productSource",
            "orderSource",
            "mongoConfigured",
            "mongoState",
          ],
        },
        OrderItem: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              example: "apple-gala-1kg",
            },
            name: {
              type: "string",
              example: "Apple Gala 1kg",
            },
            quantity: {
              type: "number",
              example: 2,
            },
            price: {
              type: "number",
              format: "float",
              example: 3.99,
            },
          },
          required: ["productId", "name", "quantity", "price"],
        },
        OrderAddressSnapshot: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: null,
            },
            label: {
              type: "string",
              example: "Delivery address",
            },
            recipientName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phoneNumber: {
              type: "string",
              example: "+84901234567",
            },
            addressLine: {
              type: "string",
              example: "123 Le Loi",
            },
            area: {
              type: "string",
              example: "District 1",
            },
            notes: {
              type: "string",
              example: "Call when arriving",
            },
            fullAddress: {
              type: "string",
              example: "123 Le Loi, District 1, HCMC, Vietnam",
            },
          },
          required: [
            "id",
            "label",
            "recipientName",
            "phoneNumber",
            "addressLine",
            "area",
            "notes",
            "fullAddress",
          ],
        },
        OrderPaymentMethodSnapshot: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: null,
            },
            type: {
              type: "string",
              example: "cash",
            },
            title: {
              type: "string",
              example: "Cash on Delivery",
            },
            meta: {
              type: "string",
              example: "",
            },
            label: {
              type: "string",
              example: "Cash on Delivery",
            },
            brand: {
              type: "string",
              example: "",
            },
            last4: {
              type: "string",
              example: "",
            },
          },
          required: ["id", "type", "title", "meta", "label", "brand", "last4"],
        },
        OrderAddressSnapshotInput: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: null,
            },
            label: {
              type: "string",
              example: "Delivery address",
            },
            recipientName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phoneNumber: {
              type: "string",
              example: "+84901234567",
            },
            addressLine: {
              type: "string",
              example: "123 Le Loi",
            },
            area: {
              type: "string",
              example: "District 1",
            },
            notes: {
              type: "string",
              example: "Call when arriving",
            },
            fullAddress: {
              type: "string",
              example: "123 Le Loi, District 1, HCMC, Vietnam",
            },
          },
          description:
            "Optional delivery address snapshot. Partial values are accepted and missing fields are defaulted by the backend.",
        },
        OrderPaymentMethodSnapshotInput: {
          type: "object",
          properties: {
            id: {
              type: "string",
              nullable: true,
              example: null,
            },
            type: {
              type: "string",
              example: "cash",
            },
            title: {
              type: "string",
              example: "Cash on Delivery",
            },
            meta: {
              type: "string",
              example: "",
            },
            label: {
              type: "string",
              example: "Cash on Delivery",
            },
            brand: {
              type: "string",
              example: "",
            },
            last4: {
              type: "string",
              example: "",
            },
          },
          description:
            "Optional payment snapshot. Partial values are accepted and missing fields are defaulted by the backend.",
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "GRV-260503-0930-123",
              description:
                "Serialized order identifier. Usually the generated order code.",
            },
            userId: {
              type: "string",
              nullable: true,
              example: "681624ab9d4f7a5f0b21d001",
            },
            ownerId: {
              type: "string",
              nullable: true,
              example: null,
            },
            shopId: {
              type: "string",
              nullable: true,
              example: null,
            },
            customerName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phone: {
              type: "string",
              example: "+84901234567",
            },
            address: {
              type: "string",
              example: "123 Le Loi, District 1, HCMC, Vietnam",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            itemCount: {
              type: "number",
              example: 2,
            },
            subtotal: {
              type: "number",
              format: "float",
              example: 7.98,
            },
            deliveryFee: {
              type: "number",
              format: "float",
              example: 1.5,
            },
            totalAmount: {
              type: "number",
              format: "float",
              example: 9.48,
            },
            deliveryAddressSnapshot: {
              $ref: "#/components/schemas/OrderAddressSnapshot",
            },
            paymentMethodSnapshot: {
              $ref: "#/components/schemas/OrderPaymentMethodSnapshot",
            },
            status: {
              type: "string",
              example: "pending",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-03T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-05-03T10:05:00.000Z",
            },
          },
          required: [
            "id",
            "userId",
            "ownerId",
            "shopId",
            "customerName",
            "phone",
            "address",
            "items",
            "itemCount",
            "subtotal",
            "deliveryFee",
            "totalAmount",
            "deliveryAddressSnapshot",
            "paymentMethodSnapshot",
            "status",
            "createdAt",
            "updatedAt",
          ],
        },
        OrderListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Order",
              },
            },
            total: {
              type: "integer",
              example: 1,
            },
          },
          required: ["items", "total"],
        },
        SignUpRequest: {
          type: "object",
          properties: {
            displayName: {
              type: "string",
              example: "Nguyen Van A",
            },
            email: {
              type: "string",
              format: "email",
              example: "example123@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
          required: ["displayName", "email", "password"],
        },
        SignInRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "example123@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "password123",
            },
          },
          required: ["email", "password"],
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            displayName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phone: {
              type: "string",
              example: "+84901234567",
            },
            avatarUrl: {
              type: "string",
              example: "https://example.com/avatar.png",
            },
            email: {
              type: "string",
              format: "email",
              example: "example123@example.com",
            },
          },
          description:
            "Only displayName, phone, avatarUrl, and email are accepted. Email cannot be changed in this MVP.",
        },
        CreateOrderRequest: {
          type: "object",
          properties: {
            customerName: {
              type: "string",
              example: "Nguyen Van A",
            },
            phone: {
              type: "string",
              example: "+84901234567",
            },
            address: {
              type: "string",
              example: "123 Le Loi, District 1, HCMC, Vietnam",
            },
            deliveryAddressSnapshot: {
              $ref: "#/components/schemas/OrderAddressSnapshotInput",
            },
            paymentMethodSnapshot: {
              $ref: "#/components/schemas/OrderPaymentMethodSnapshotInput",
            },
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            deliveryFee: {
              type: "number",
              format: "float",
              example: 1.5,
              default: 0,
            },
          },
          required: ["customerName", "phone", "address", "items"],
        },
      },
    },
    tags: [
      {
        name: "System",
      },
      {
        name: "Health",
      },
      {
        name: "Auth",
      },
      {
        name: "Products",
      },
      {
        name: "Orders",
      },
      {
        name: "Users",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../app.js"),
    path.join(__dirname, "../routes/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
