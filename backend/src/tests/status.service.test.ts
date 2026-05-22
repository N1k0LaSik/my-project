import { StatusService } from "../services/status.service";
import { StatusRepository } from "../repositories/status.repository";

describe("StatusService", () => {
  test("getAll() повертає дефолтні статуси", () => {
    const all = StatusService.getAll();
    expect(all.length).toBeGreaterThanOrEqual(4);
  });

  test("getById() повертає статус за ID", () => {
    const all = StatusService.getAll();
    const first = all[0];
    const found = StatusService.getById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });

  test("getById() повертає undefined для неіснуючого ID", () => {
    const found = StatusService.getById("fake-id");
    expect(found).toBeUndefined();
  });

  test("create() створює новий статус", () => {
    const status = StatusService.create({ name: "TestStatus", color: "#123456" });
    expect(status.id).toBeDefined();
    expect(status.name).toBe("TestStatus");
  });

  test("create() кидає помилку при дублікаті назви", () => {
    expect(() =>
      StatusService.create({ name: "Open", color: "#000000" })
    ).toThrow();
  });

  test("update() повертає null для неіснуючого ID", () => {
    const result = StatusService.update("fake-id", { name: "Test" });
    expect(result).toBeNull();
  });
});