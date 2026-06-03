import { Router } from "express";
import { exportTickets, importTickets } from "../controllers/export-import.controller";

export const exportImportRoutes = Router();

exportImportRoutes.get("/export/tickets", exportTickets);
exportImportRoutes.post("/import/tickets", importTickets);