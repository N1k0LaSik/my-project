import { all, get, run } from "../db/dbClient";
import { Status } from "../models/status.model";

export const StatusRepository = {
  findAll: (): Promise<Status[]> => {
    return all<Status>("SELECT id, name, color FROM Statuses ORDER BY name ASC;");
  },

  findById: (id: string): Promise<Status | undefined> => {
    return get<Status>(`SELECT id, name, color FROM Statuses WHERE id = '${id}';`);
  },

  findByName: (name: string): Promise<Status | undefined> => {
    return get<Status>(`SELECT id, name, color FROM Statuses WHERE name = '${name}';`);
  },

  create: async (status: Status): Promise<Status> => {
    await run(`
      INSERT INTO Statuses (id, name, color)
      VALUES ('${status.id}', '${status.name.replace(/'/g, "''")}', '${status.color}');
    `);
    return (await get<Status>(`SELECT id, name, color FROM Statuses WHERE id = '${status.id}';`))!;
  },

  update: async (id: string, data: Partial<Omit<Status, "id">>): Promise<Status | null> => {
    const fields: string[] = [];
    if (data.name !== undefined) fields.push(`name = '${data.name.replace(/'/g, "''")}'`);
    if (data.color !== undefined) fields.push(`color = '${data.color}'`);
    if (fields.length === 0) return null;

    const result = await run(`UPDATE Statuses SET ${fields.join(", ")} WHERE id = '${id}';`);
    if (result.changes === 0) return null;
    return (await get<Status>(`SELECT id, name, color FROM Statuses WHERE id = '${id}';`)) ?? null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(`DELETE FROM Statuses WHERE id = '${id}';`);
    return result.changes > 0;
  },
};