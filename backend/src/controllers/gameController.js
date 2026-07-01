import * as gameService from '../services/gameService.js';
import { formatSuccess } from '../utils/formatResponse.js';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_ORDERING } from '../constants/rawg.js';
import AppError from '../utils/AppError.js';

export const searchGames = async (req, res, next) => {
  try {
    const { q, page: pageQuery, limit: limitQuery, ordering } = req.query;

    if (!q || q.trim().length === 0) {
      throw new AppError("Search query 'q' is required.", 400);
    }
    if (q.trim().length < 2) {
      throw new AppError("Search query 'q' must be at least 2 characters long.", 400);
    }

    // Parse and clamp pagination parameters
    let page = parseInt(pageQuery, 10);
    if (isNaN(page) || page < 1) {
      page = DEFAULT_PAGE;
    }

    let limit = parseInt(limitQuery, 10);
    if (isNaN(limit) || limit < 1) {
      limit = DEFAULT_LIMIT;
    } else if (limit > MAX_LIMIT) {
      limit = MAX_LIMIT;
    }

    const sortOrder = ordering || DEFAULT_ORDERING;

    const result = await gameService.searchGames(q.trim(), page, limit, sortOrder);

    res.status(200).json({
      success: true,
      data: result.games,
      meta: {
        page,
        limit,
        hasNextPage: result.hasNextPage
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getGameDetails = async (req, res, next) => {
  try {
    const { rawgId } = req.params;
    const numericId = parseInt(rawgId, 10);

    if (isNaN(numericId) || numericId <= 0) {
      throw new AppError("Invalid game ID format.", 400);
    }

    const result = await gameService.getGameDetails(numericId);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};
