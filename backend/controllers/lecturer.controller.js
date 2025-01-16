const Score = require("../models/ScoreModel");
const User = require("../models/UserModel");
const createError = require("http-errors");

exports.uploadScores = async (req, res, next) => {
  try {
    const { courseCode, session, semester, scores, unit } = req.body;
    const lecturerId = req.user._id;

    if (!Array.isArray(scores) || scores.length === 0) {
      throw createError(400, "Scores must be a non-empty array");
    }

    if (!unit) {
      throw createError(400, "Unit is required");
    }

    const isValidScores = scores.every(
      (entry) =>
        entry.registrationNumber &&
        typeof entry.score === "number" &&
        entry.score >= 0 &&
        entry.score <= 100
    );

    if (!isValidScores) {
      throw createError(400, "Invalid score format");
    }

    // Check if scores already exist for this course-session-semester
    const existingScores = await Score.findOne({
      courseCode,
      session,
      semester,
    });

    if (existingScores) {
      throw createError(
        409,
        "Scores already exist for this course, session, and semester"
      );
    }

    const newScores = new Score({
      courseCode,
      session,
      semester,
      unit,
      lecturer: lecturerId,
      scores,
    });

    await newScores.save();

    res.status(201).json({
      success: true,
      data: newScores,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateScores = async (req, res, next) => {
  try {
    const { courseCode, session, semester, scores } = req.body;
    const lecturerId = req.user._id;

    if (!Array.isArray(scores) || scores.length === 0) {
      throw createError(400, "Scores must be a non-empty array");
    }

    const isValidScores = scores.every(
      (entry) =>
        entry.registrationNumber &&
        typeof entry.score === "number" &&
        entry.score >= 0 &&
        entry.score <= 100
    );

    if (!isValidScores) {
      throw createError(400, "Invalid score format");
    }

    const existingScores = await Score.findOne({
      lecturer: lecturerId,
      courseCode,
      session,
      semester,
    });

    if (!existingScores) {
      throw createError(404, "Scores not found");
    }

    existingScores.scores = scores;
    existingScores.lastModifiedAt = Date.now();
    await existingScores.save();

    res.status(200).json({
      success: true,
      data: existingScores,
    });
  } catch (error) {
    next(error);
  }
};

exports.getScores = async (req, res, next) => {
  try {
    const { courseCode, session, semester } = req.query;
    const lecturerId = req.user._id;

    const query = { lecturer: lecturerId };
    if (courseCode) query.courseCode = courseCode.toUpperCase();
    if (session) query.session = session;
    if (semester) query.semester = parseInt(semester);

    const scores = await Score.find(query).sort({
      session: -1,
      semester: 1,
      courseCode: 1,
    });

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteScores = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Score.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.updateStudentScore = async (req, res, next) => {
  try {
    const { courseCode, session, semester, registrationNumber, newScore } = req.body;
    const lecturerId = req.user._id;

    if (typeof newScore !== 'number' || newScore < 0 || newScore > 100) {
      throw createError(400, 'Invalid score. Score must be a number between 0 and 100');
    }

    const scoresheet = await Score.findOne({
      courseCode,
      session,
      semester,
      lecturer: lecturerId
    });

    if (!scoresheet) {
      throw createError(404, 'Scoresheet not found');
    }

    const studentScore = scoresheet.scores.find(
      (entry) => entry.registrationNumber === registrationNumber
    );

    if (!studentScore) {
      throw createError(404, 'Student score not found');
    }

    // Update the student's score
    studentScore.score = newScore;
    scoresheet.lastModifiedAt = Date.now();
    await scoresheet.save();

    res.status(200).json({
      success: true,
      data: scoresheet
    });

  } catch (error) {
    next(error);
  }
};

