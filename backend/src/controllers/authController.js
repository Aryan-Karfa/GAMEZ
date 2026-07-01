import * as authService from '../services/authService.js';
import { formatSuccess } from '../utils/formatResponse.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register(username, email, password);
    res.status(201).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};
