import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";

// Очищаємо репозиторій перед кожним тестом
beforeEach(() => {
  const all = UserRepository.findAll();
  all.forEach((u) => UserRepository.delete(u.id));
});

describe("UserService", () => {
  test("create() створює користувача з id", () => {
    const user = UserService.create({ name: "John", email: "john@example.com" });
    expect(user.id).toBeDefined();
    expect(user.name).toBe("John");
    expect(user.email).toBe("john@example.com");
  });

  test("getAll() повертає всіх користувачів", () => {
    UserService.create({ name: "John", email: "john@example.com" });
    UserService.create({ name: "Jane", email: "jane@example.com" });
    const all = UserService.getAll();
    expect(all.length).toBe(2);
  });

  test("getById() повертає користувача за ID", () => {
    const created = UserService.create({ name: "John", email: "john@example.com" });
    const found = UserService.getById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });

  test("getById() повертає undefined для неіснуючого ID", () => {
    const found = UserService.getById("fake-id");
    expect(found).toBeUndefined();
  });

  test("update() оновлює поля користувача", () => {
    const created = UserService.create({ name: "John", email: "john@example.com" });
    const updated = UserService.update(created.id, { name: "Updated John" });
    expect(updated?.name).toBe("Updated John");
    expect(updated?.email).toBe("john@example.com");
  });

  test("update() повертає null для неіснуючого ID", () => {
    const result = UserService.update("fake-id", { name: "Test" });
    expect(result).toBeNull();
  });

  test("delete() видаляє користувача", () => {
    const created = UserService.create({ name: "John", email: "john@example.com" });
    const deleted = UserService.delete(created.id);
    expect(deleted).toBe(true);
    expect(UserService.getById(created.id)).toBeUndefined();
  });

  test("delete() повертає false для неіснуючого ID", () => {
    const result = UserService.delete("fake-id");
    expect(result).toBe(false);
  });
});