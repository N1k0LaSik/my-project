import { TicketService } from "../services/ticket.service";
import { UserService } from "../services/user.service";
import { StatusService } from "../services/status.service";
import { UserRepository } from "../repositories/user.repository";
 
let userId: string;
let statusId: string;
 
beforeEach(async () => {
  const all = await UserRepository.findAll();
  for (const u of all) await UserRepository.delete(u.id);
 
  const user = await UserService.create({ name: "Test User", email: "test@example.com" });
  userId = user.id;
 
  const statuses = await StatusService.getAll();
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
  test("create() створює тікет з id та датами", async () => {
    const ticket = await TicketService.create(validTicket());
    expect(ticket.id).toBeDefined();
    expect(ticket.createdAt).toBeDefined();
    expect(ticket.updatedAt).toBeDefined();
  });
 
  test("getAll() повертає список тікетів", async () => {
    await TicketService.create(validTicket());
    const { items, total } = await TicketService.getAll({});
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(total).toBeGreaterThanOrEqual(1);
  });
 
  test("getById() повертає тікет за ID", async () => {
    const created = await TicketService.create(validTicket());
    const found = await TicketService.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });
 
  test("getById() повертає null для неіснуючого ID", async () => {
    const found = await TicketService.getById("fake-id");
    expect(found).toBeNull();
  });
 
  test("update() оновлює поля тікету", async () => {
    const created = await TicketService.create(validTicket());
    const updated = await TicketService.update(created.id, { priority: "Low" });
    expect(updated?.priority).toBe("Low");
  });
 
  test("delete() робить soft delete тікету", async () => {
    const created = await TicketService.create(validTicket());
    const deleted = await TicketService.delete(created.id);
    expect(deleted).toBe(true);
    expect(await TicketService.getById(created.id)).toBeNull();
  });
});