import * as preferencesService from '../services/preferencesService.js';
import { formatSuccess } from '../utils/formatResponse.js';

/**
 * GET /api/v1/preferences
 * Fetch or auto-create preferences for the authenticated user.
 */
export const getPreferences = async (req, res, next) => {
  try {
    const preferences = await preferencesService.findOrCreatePreferences(req.user.id);
    res.status(200).json(formatSuccess(preferences));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/preferences
 * Update preferences for the authenticated user.
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const preferences = await preferencesService.updatePreferences(req.user.id, req.body);
    res.status(200).json(formatSuccess(preferences));
  } catch (err) {
    next(err);
  }
};
