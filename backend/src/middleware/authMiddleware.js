import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';
import { config } from '../config/env.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('Authentication signature is missing', 401));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError('Authentication signature format is malformed', 401));
    }

    const token = parts[1];
    if (!token) {
      return next(new AppError('Authentication token is empty', 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Authentication token expired. Re-authenticate.', 401));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Authentication token signature is invalid', 401));
      }
      return next(new AppError('Authentication token validation failed', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return next(new AppError('Authenticated operator profile does not exist', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
