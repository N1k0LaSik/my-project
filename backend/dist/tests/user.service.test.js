"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../services/user.service");
const user_repository_1 = require("../repositories/user.repository");
// Очищаємо репозиторій перед кожним тестом
beforeEach(() => {
    const all = user_repository_1.UserRepository.findAll();
    all.forEach((u) => user_repository_1.UserRepository.delete(u.id));
});
describe("UserService", () => {
    test("create() створює користувача з id", () => {
        const user = user_service_1.UserService.create({ name: "John", email: "john@example.com" });
        expect(user.id).toBeDefined();
        expect(user.name).toBe("John");
        expect(user.email).toBe("john@example.com");
    });
    test("getAll() повертає всіх користувачів", () => {
        user_service_1.UserService.create({ name: "John", email: "john@example.com" });
        user_service_1.UserService.create({ name: "Jane", email: "jane@example.com" });
        const all = user_service_1.UserService.getAll();
        expect(all.length).toBe(2);
    });
    test("getById() повертає користувача за ID", () => {
        const created = user_service_1.UserService.create({ name: "John", email: "john@example.com" });
        const found = user_service_1.UserService.getById(created.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
    });
    test("getById() повертає undefined для неіснуючого ID", () => {
        const found = user_service_1.UserService.getById("fake-id");
        expect(found).toBeUndefined();
    });
    test("update() оновлює поля користувача", () => {
        const created = user_service_1.UserService.create({ name: "John", email: "john@example.com" });
        const updated = user_service_1.UserService.update(created.id, { name: "Updated John" });
        expect(updated?.name).toBe("Updated John");
        expect(updated?.email).toBe("john@example.com");
    });
    test("update() повертає null для неіснуючого ID", () => {
        const result = user_service_1.UserService.update("fake-id", { name: "Test" });
        expect(result).toBeNull();
    });
    test("delete() видаляє користувача", () => {
        const created = user_service_1.UserService.create({ name: "John", email: "john@example.com" });
        const deleted = user_service_1.UserService.delete(created.id);
        expect(deleted).toBe(true);
        expect(user_service_1.UserService.getById(created.id)).toBeUndefined();
    });
    test("delete() повертає false для неіснуючого ID", () => {
        const result = user_service_1.UserService.delete("fake-id");
        expect(result).toBe(false);
    });
});
