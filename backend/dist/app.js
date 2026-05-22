"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const error_handler_middleware_1 = require("./middleware/error-handler.middleware");
const user_routes_1 = require("./routes/user.routes");
const status_routes_1 = require("./routes/status.routes");
const ticket_routes_1 = require("./routes/ticket.routes");
const ticket_message_routes_1 = require("./routes/ticket-message.routes");
const swagger_1 = require("./swagger");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use(logger_middleware_1.logger);
exports.app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
exports.app.use("/api/users", user_routes_1.userRoutes);
exports.app.use("/api/statuses", status_routes_1.statusRoutes);
exports.app.use("/api/tickets", ticket_routes_1.ticketRoutes);
exports.app.use("/api/tickets/:ticketId/messages", ticket_message_routes_1.ticketMessageRoutes);
exports.app.use(error_handler_middleware_1.errorHandler);
exports.app.post("/api/tickets", (req, res) => {
    console.log("DIRECT HIT");
    res.json({ ok: true });
});
