import { StatusService } from "../services/status.service";
 
describe("StatusService", () => {
  test("getAll() повертає дефолтні статуси", async () => {
    const all = await StatusService.getAll();
    expect(all.length).toBeGreaterThanOrEqual(4);
  });
 
  test("getById() повертає статус за ID", async () => {
    const all = await StatusService.getAll();
    const first = all[0];
    const found = await StatusService.getById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
  });
 
  test("getById() повертає undefined для неіснуючого ID", async () => {
    const found = await StatusService.getById("fake-id");
    expect(found).toBeUndefined();
  });
 
  test("create() створює новий статус", async () => {
    const status = await StatusService.create({ name: "TestStatus", color: "#123456" });
    expect(status.id).toBeDefined();
    expect(status.name).toBe("TestStatus");
  });
 
  test("update() повертає null для неіснуючого ID", async () => {
    const result = await StatusService.update("fake-id", { name: "Test" });
    expect(result).toBeNull();
  });
});