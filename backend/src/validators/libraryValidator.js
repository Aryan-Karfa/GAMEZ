import AppError from '../utils/AppError.js';

const VALID_STATUSES = ['TO_PLAY', 'PLAYING', 'COMPLETED', 'DISCONTINUED'];

export const validateAddGame = (req, res, next) => {
  const { rawgId, status } = req.body;

  if (rawgId === undefined || rawgId === null) {
    return next(new AppError('rawgId is required.', 400));
  }

  const numericId = Number(rawgId);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return next(new AppError('rawgId must be a positive integer.', 400));
  }

  req.body.rawgId = numericId;

  if (!status) {
    return next(new AppError('status is required.', 400));
  }

  if (!VALID_STATUSES.includes(status)) {
    return next(new AppError(`status must be one of: ${VALID_STATUSES.join(', ')}`, 400));
  }

  next();
};

export const validateUpdateEntry = (req, res, next) => {
  const { status, progress, playTimeMinutes } = req.body;

  const allowedKeys = ['status', 'progress', 'playTimeMinutes'];
  const extraKeys = Object.keys(req.body).filter(key => !allowedKeys.includes(key));
  if (extraKeys.length > 0) {
    return next(new AppError(`Unexpected fields in request body: ${extraKeys.join(', ')}`, 400));
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return next(new AppError(`status must be one of: ${VALID_STATUSES.join(', ')}`, 400));
    }
  }

  if (progress !== undefined) {
    const numericProgress = Number(progress);
    if (!Number.isInteger(numericProgress) || numericProgress < 0 || numericProgress > 100) {
      return next(new AppError('progress must be an integer between 0 and 100.', 400));
    }
    req.body.progress = numericProgress;
  }

  if (playTimeMinutes !== undefined) {
    const numericPlaytime = Number(playTimeMinutes);
    if (!Number.isInteger(numericPlaytime) || numericPlaytime < 0) {
      return next(new AppError('playTimeMinutes must be a non-negative integer.', 400));
    }
    req.body.playTimeMinutes = numericPlaytime;
  }

  next();
};
