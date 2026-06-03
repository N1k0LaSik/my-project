import { Router } from "express";
import { getTicketsWithDetails, getTicketsCountByStatus } from "../controllers/analytics.controller";

export const analyticsRoutes = Router();

analyticsRoutes.get("/tickets", getTicketsWithDetails);
analyticsRoutes.get("/tickets/count-by-status", getTicketsCountByStatus);