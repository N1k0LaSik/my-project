"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const users = [];
exports.UserRepository = {
    findAll: () => users,
    findById: (id) => users.find(u => u.id === id),
    create: (user) => {
        users.push(user);
        return user;
    },
    update: (id, data) => {
        const user = users.find(u => u.id === id);
        if (!user)
            return null;
        Object.assign(user, data);
        return user;
    },
    delete: (id) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return false;
        users.splice(index, 1);
        return true;
    }
};
