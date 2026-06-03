import { NextFunction, Request, Response } from "express";
import { AnalyticsRepository } from "../repositories/analytics.repository";

export const getTicketsWithDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string | undefined;
    const items = await AnalyticsRepository.findTicketsWithDetails(search);
    return res.status(200).json({ data: items, meta: { count: items.length } });
  } catch (err) {
    return next(err);
  }
};

export const getTicketsCountByStatus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await AnalyticsRepository.countTicketsByStatus();
    return res.status(200).json({ data: items });
  } catch (err) {
    return next(err);
  }
};