import { TicketService } from "../services/ticket.service";
import { UserService } from "../services/user.service";
import { StatusService } from "../services/status.service";
import { UserRepository } from "../repositories/user.repository";

let userId: string;
let statusId: string;

beforeEach(() => {
  const all = UserRepository.findAll();
  all.forEach((u) => UserRepository.delete(u.id));

  const user = UserService.create({ name: "Test User", email: "test@example.com" });
  userId = user.id;

  const statuses = StatusService.getAll();
  statusId = statuses[0].id;
});

const validTicket = () => ({
  subject: "Test subject",
  message: "Test message that is long enough",
  priority: "High" as const,
  statusId,
  authorId: userId,
});

describe("TicketService", () => {
  test("create() створює тікет з id та датами", () => {
    const ticket = TicketService.create(validTicket());
    expect(ticket.id).toBeDefined();
    expect(ticket.createdAt).toBeDefined();
    expect(ticket.updatedAt).toBeDefined();
  });

  test("getAll() повертає список тікетів", () => {
    TicketService.create(validTicket());
    const { items, total } = TicketService.getAll({});
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(total).toBeGreaterThanOrEqual(1);
  });

  test("getById() повертає тікет за ID", () => {
    const created = TicketService.create(validTicket());
    const found = TicketService.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  test("getById() повертає null для неіснуючого ID", () => {
    const found = TicketService.getById("fake-id");
    expect(found).toBeNull();
  });

  test("create() кидає помилку якщо автор не існує", () => {
    expect(() =>
      TicketService.create({ ...validTicket(), authorId: "fake-id" })
    ).toThrow();
  });

  test("create() кидає помилку якщо статус не існує", () => {
    expect(() =>
      TicketService.create({ ...validTicket(), statusId: "fake-id" })
    ).toThrow();
  });

  test("update() оновлює поля тікету", () => {
    const created = TicketService.create(validTicket());
    const updated = TicketService.update(created.id, { priority: "Low" });
    expect(updated?.priority).toBe("Low");
  });

  test("delete() робить soft delete тікету", () => {
    const created = TicketService.create(validTicket());
    const deleted = TicketService.delete(created.id);
    expect(deleted).toBe(true);
    expect(TicketService.getById(created.id)).toBeNull();
  });
});