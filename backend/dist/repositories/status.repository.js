"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusRepository = void 0;
const uuid_1 = require("uuid");
// Дефолтні статуси одразу в пам'яті
const statuses = [
    { id: (0, uuid_1.v4)(), name: "Open", color: "#3498db" },
    { id: (0, uuid_1.v4)(), name: "In Progress", color: "#f39c12" },
    { id: (0, uuid_1.v4)(), name: "Resolved", color: "#2ecc71" },
    { id: (0, uuid_1.v4)(), name: "Closed", color: "#95a5a6" },
];
exports.StatusRepository = {
    findAll: () => [...statuses],
    findById: (id) => statuses.find(s => s.id === id),
    findByName: (name) => statuses.find(s => s.name.toLowerCase() === name.toLowerCase()),
    create: (status) => {
        statuses.push(status);
        return status;
    },
    update: (id, data) => {
        const status = statuses.find(s => s.id === id);
        if (!status)
            return null;
        Object.assign(status, data);
        return status;
    },
    delete: (id) => {
        const index = statuses.findIndex(s => s.id === id);
        if (index === -1)
            return false;
        statuses.splice(index, 1);
        return true;
    },
};
