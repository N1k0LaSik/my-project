import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
 
beforeEach(async () => {
  const all = await UserRepository.findAll();
  for (const u of all) await UserRepository.delete(u.id);
});
 
describe("UserService", () => {
  test("create() створює користувача з id", async () => {
    const user = await UserService.create({ name: "John", email: "john@example.com" });
    expect(user.id).toBeDefined();
    expect(user.name).toBe("John");
    expect(user.email).toBe("john@example.com");
  });
 
  test("getAll() повертає всіх користувачів", async () => {
    await UserService.create({ name: "John", email: "john@example.com" });
    await UserService.create({ name: "Jane", email: "jane@example.com" });
    const all = await UserService.getAll();
    expect(all.length).toBe(2);
  });
 
  test("getById() повертає користувача за ID", async () => {
    const created = await UserService.create({ name: "John", email: "john@example.com" });
    const found = await UserService.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });
 
  test("getById() повертає undefined для неіснуючого ID", async () => {
    const found = await UserService.getById("fake-id");
    expect(found).toBeUndefined();
  });
 
  test("update() оновлює поля користувача", async () => {
    const created = await UserService.create({ name: "John", email: "john@example.com" });
    const updated = await UserService.update(created.id, { name: "Updated John" });
    expect(updated?.name).toBe("Updated John");
    expect(updated?.email).toBe("john@example.com");
  });
 
  test("update() повертає null для неіснуючого ID", async () => {
    const result = await UserService.update("fake-id", { name: "Test" });
    expect(result).toBeNull();
  });
 
  test("delete() видаляє користувача", async () => {
    const created = await UserService.create({ name: "John", email: "john@example.com" });
    const deleted = await UserService.delete(created.id);
    expect(deleted).toBe(true);
    expect(await UserService.getById(created.id)).toBeUndefined();
  });
 
  test("delete() повертає false для неіснуючого ID", async () => {
    const result = await UserService.delete("fake-id");
    expect(result).toBe(false);
  });
});