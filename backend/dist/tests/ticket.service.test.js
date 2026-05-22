"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = require("../services/ticket.service");
const user_service_1 = require("../services/user.service");
const status_service_1 = require("../services/status.service");
const user_repository_1 = require("../repositories/user.repository");
let userId;
let statusId;
beforeEach(() => {
    const all = user_repository_1.UserRepository.findAll();
    all.forEach((u) => user_repository_1.UserRepository.delete(u.id));
    const user = user_service_1.UserService.create({ name: "Test User", email: "test@example.com" });
    userId = user.id;
    const statuses = status_service_1.StatusService.getAll();
    statusId = statuses[0].id;
});
const validTicket = () => ({
    subject: "Test subject",
    message: "Test message that is long enough",
    priority: "High",
    statusId,
    authorId: userId,
});
describe("TicketService", () => {
    test("create() створює тікет з id та датами", () => {
        const ticket = ticket_service_1.TicketService.create(validTicket());
        expect(ticket.id).toBeDefined();
        expect(ticket.createdAt).toBeDefined();
        expect(ticket.updatedAt).toBeDefined();
    });
    test("getAll() повертає список тікетів", () => {
        ticket_service_1.TicketService.create(validTicket());
        const { items, total } = ticket_service_1.TicketService.getAll({});
        expect(items.length).toBeGreaterThanOrEqual(1);
        expect(total).toBeGreaterThanOrEqual(1);
    });
    test("getById() повертає тікет за ID", () => {
        const created = ticket_service_1.TicketService.create(validTicket());
        const found = ticket_service_1.TicketService.getById(created.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
    });
    test("getById() повертає null для неіснуючого ID", () => {
        const found = ticket_service_1.TicketService.getById("fake-id");
        expect(found).toBeNull();
    });
    test("create() кидає помилку якщо автор не існує", () => {
        expect(() => ticket_service_1.TicketService.create({ ...validTicket(), authorId: "fake-id" })).toThrow();
    });
    test("create() кидає помилку якщо статус не існує", () => {
        expect(() => ticket_service_1.TicketService.create({ ...validTicket(), statusId: "fake-id" })).toThrow();
    });
    test("update() оновлює поля тікету", () => {
        const created = ticket_service_1.TicketService.create(validTicket());
        const updated = ticket_service_1.TicketService.update(created.id, { priority: "Low" });
        expect(updated?.priority).toBe("Low");
    });
    test("delete() робить soft delete тікету", () => {
        const created = ticket_service_1.TicketService.create(validTicket());
        const deleted = ticket_service_1.TicketService.delete(created.id);
        expect(deleted).toBe(true);
        expect(ticket_service_1.TicketService.getById(created.id)).toBeNull();
    });
});
