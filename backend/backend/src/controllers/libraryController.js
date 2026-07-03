import * as libraryService from '../services/libraryService.js';
import { formatSuccess } from '../utils/formatResponse.js';

export const getLibrary = async (req, res, next) => {
  try {
    const result = await libraryService.getLibrary(req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const getEntryDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await libraryService.getEntryDetails(id, req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const addGame = async (req, res, next) => {
  try {
    const { rawgId, status } = req.body;
    const result = await libraryService.addGame(req.user.id, rawgId, status);
    res.status(201).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await libraryService.updateEntry(id, req.user.id, req.body);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await libraryService.deleteEntry(id, req.user.id);
    res.status(200).json(formatSuccess(result));
  } catch (err) {
    next(err);
  }
};
