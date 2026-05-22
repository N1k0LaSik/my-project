"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_service_1 = require("../services/status.service");
describe("StatusService", () => {
    test("getAll() повертає дефолтні статуси", () => {
        const all = status_service_1.StatusService.getAll();
        expect(all.length).toBeGreaterThanOrEqual(4);
    });
    test("getById() повертає статус за ID", () => {
        const all = status_service_1.StatusService.getAll();
        const first = all[0];
        const found = status_service_1.StatusService.getById(first.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(first.id);
    });
    test("getById() повертає undefined для неіснуючого ID", () => {
        const found = status_service_1.StatusService.getById("fake-id");
        expect(found).toBeUndefined();
    });
    test("create() створює новий статус", () => {
        const status = status_service_1.StatusService.create({ name: "TestStatus", color: "#123456" });
        expect(status.id).toBeDefined();
        expect(status.name).toBe("TestStatus");
    });
    test("create() кидає помилку при дублікаті назви", () => {
        expect(() => status_service_1.StatusService.create({ name: "Open", color: "#000000" })).toThrow();
    });
    test("update() повертає null для неіснуючого ID", () => {
        const result = status_service_1.StatusService.update("fake-id", { name: "Test" });
        expect(result).toBeNull();
    });
});
