import { User } from "../models/user.model";

const users: User[] = [];


export const UserRepository = {
  findAll: () => users,

  findById: (id: string) => users.find(u => u.id === id),

  create: (user: User) => {
    users.push(user);
    return user;
  },

  update: (id: string, data: Partial<User>) => {
    const user = users.find(u => u.id === id);
    if (!user) return null;

    Object.assign(user, data);
    return user;
  },

  delete: (id: string) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
};