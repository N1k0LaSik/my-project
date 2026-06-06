import { all, get, run } from "../db/dbClient";
import { User } from "../models/user.model";

export const UserRepository = {
  findAll: (): Promise<User[]> => {
    return all<User>("SELECT id, name, email, createdAt FROM Users ORDER BY createdAt DESC;");
  },

  findById: (id: string): Promise<User | undefined> => {
    return get<User>(
      `SELECT id, name, email, createdAt FROM Users WHERE id = ?;`,
      [id]
    );
  },

  findByEmail: (email: string): Promise<User | undefined> => {
    return get<User>(
      `SELECT id, name, email, createdAt FROM Users WHERE email = ?;`,
      [email]
    );
  },

  create: async (user: User): Promise<User> => {
    await run(
      `INSERT INTO Users (id, name, email, createdAt) VALUES (?, ?, ?, ?);`,
      [user.id, user.name, user.email, user.createdAt]
    );
    return (await get<User>(
      `SELECT id, name, email, createdAt FROM Users WHERE id = ?;`,
      [user.id]
    ))!;
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    const fields: string[] = [];
    const params: unknown[] = [];
    if (data.name !== undefined) { fields.push("name = ?"); params.push(data.name); }
    if (data.email !== undefined) { fields.push("email = ?"); params.push(data.email); }
    if (fields.length === 0) return null;

    params.push(id);
    const result = await run(
      `UPDATE Users SET ${fields.join(", ")} WHERE id = ?;`,
      params
    );
    if (result.changes === 0) return null;
    return (await get<User>(
      `SELECT id, name, email, createdAt FROM Users WHERE id = ?;`,
      [id]
    )) ?? null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(`DELETE FROM Users WHERE id = ?;`, [id]);
    return result.changes > 0;
  },
};