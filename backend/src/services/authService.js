import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

export const register = async (username, email, password) => {
  // Check duplicate email
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  });
  if (existingEmail) {
    throw new AppError('Email is already registered', 409);
  }

  // Check duplicate username
  const existingUsername = await prisma.user.findUnique({
    where: { username }
  });
  if (existingUsername) {
    throw new AppError('Username is already registered', 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Store user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash
    }
  });

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }
  };
};

export const login = async (email, password) => {
  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};
