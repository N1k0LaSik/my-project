import { Router } from "express";
import * as StatusController from "../controllers/status.controller";

export const statusRoutes = Router();

statusRoutes.get("/", StatusController.getStatuses);
statusRoutes.get("/:id", StatusController.getStatusById);
statusRoutes.post("/", StatusController.createStatus);
statusRoutes.put("/:id", StatusController.updateStatus);
statusRoutes.patch("/:id", StatusController.updateStatus);
statusRoutes.delete("/:id", StatusController.deleteStatus);