import AppError from '../utils/AppError.js';

export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    return next(new AppError('Username is required', 400));
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return next(new AppError('Username must be 3-30 characters long and can only contain letters, numbers, and underscores', 400));
  }

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  if (password.length < 8 || password.length > 100) {
    return next(new AppError('Password must be between 8 and 100 characters long', 400));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  next();
};
