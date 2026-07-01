import * as dashboardService from '../services/dashboardService.js';
import { formatSuccess } from '../utils/formatResponse.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const result = await dashboardService.getDashboardSummary(req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const getContinuePlaying = async (req, res, next) => {
  try {
    const result = await dashboardService.getContinuePlaying(req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};
