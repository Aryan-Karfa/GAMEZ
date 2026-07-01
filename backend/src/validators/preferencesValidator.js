import AppError from '../utils/AppError.js';

const VALID_THEMES = ['DARK'];
const VALID_VIEWS = ['CARD', 'LIST', 'SHELF'];

/**
 * Validate incoming request body for patching user preferences.
 */
export const validateUpdatePreferences = (req, res, next) => {
  const allowedKeys = ['theme', 'defaultView'];
  const bodyKeys = Object.keys(req.body);

  // 1. Reject unexpected fields
  const extraKeys = bodyKeys.filter(key => !allowedKeys.includes(key));
  if (extraKeys.length > 0) {
    return next(new AppError(`Unexpected fields in request body: ${extraKeys.join(', ')}`, 400));
  }

  // 2. Validate theme if provided
  if (req.body.theme !== undefined) {
    if (!VALID_THEMES.includes(req.body.theme)) {
      return next(new AppError(`theme must be one of: ${VALID_THEMES.join(', ')}`, 400));
    }
  }

  // 3. Validate defaultView if provided
  if (req.body.defaultView !== undefined) {
    if (!VALID_VIEWS.includes(req.body.defaultView)) {
      return next(new AppError(`defaultView must be one of: ${VALID_VIEWS.join(', ')}`, 400));
    }
  }

  next();
};
