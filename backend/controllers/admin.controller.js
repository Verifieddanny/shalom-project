const LecturerCode = require('../models/LecturerCodeModel');
const User = require('../models/UserModel');
const createError = require('http-errors');
const generateRandomCode = require('../util/codeGenerator');
const Score = require('../models/ScoreModel');

exports.generateLecturerCode = async (req, res, next) => {
  try {
    const code = generateRandomCode();
    const newCode = new LecturerCode({ code });
    await newCode.save();

    res.status(201).json({
      success: true,
      data: { code: newCode.code }
    });
  } catch (error) {
    next(error);
  }
};

exports.getScores = async (req, res, next) => {
  try {
    const scores = await Score.find().populate('lecturer', 'fullName email').exec();
    res.status(200).json(scores);
  } catch (error) {
    next(error);
  }
}

exports.getLecturers = async (req, res, next) => {
  try {
    const lecturers = await User.find({ role: 'lecturer' });
    res.status(200).json(lecturers);
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};