import { Status } from "../models/status.model";
import { v4 as uuid } from "uuid";

// Дефолтні статуси одразу в пам'яті
const statuses: Status[] = [
  { id: "00000000-0000-0000-0001-000000000001", name: "Open", color: "#3498db" },
  { id: "00000000-0000-0000-0001-000000000002", name: "In Progress", color: "#f39c12" },
  { id: "00000000-0000-0000-0001-000000000003", name: "Resolved", color: "#2ecc71" },
  { id: "00000000-0000-0000-0001-000000000004", name: "Closed", color: "#95a5a6" },
];

export const StatusRepository = {
  findAll: () => [...statuses],

  findById: (id: string) => statuses.find(s => s.id === id),

  findByName: (name: string) =>
    statuses.find(s => s.name.toLowerCase() === name.toLowerCase()),

  create: (status: Status) => {
    statuses.push(status);
    return status;
  },

  update: (id: string, data: Partial<Omit<Status, "id">>) => {
    const status = statuses.find(s => s.id === id);
    if (!status) return null;
    Object.assign(status, data);
    return status;
  },

  delete: (id: string) => {
    const index = statuses.findIndex(s => s.id === id);
    if (index === -1) return false;
    statuses.splice(index, 1);
    return true;
  },
};