const CourseRegistration = require('../models/CourseRegistrationModel');
const createError = require('http-errors');
const Score = require('../models/ScoreModel');
const User = require('../models/UserModel');

exports.registerCourses = async (req, res, next) => {
  try {
    const { session, semester, courses } = req.body;
    const studentId = req.user._id; // From auth middleware

    // Validate session format
    if (!/^\d{4}\/\d{4}$/.test(session)) {
      throw createError(400, 'Invalid session format. Use YYYY/YYYY');
    }

    // Validate semester
    if (![1, 2].includes(semester)) {
      throw createError(400, 'Semester must be either 1 or 2');
    }

    // Validate courses array
    if (!Array.isArray(courses) || courses.length === 0) {
      throw createError(400, 'Courses must be a non-empty array');
    }

    // Check if registration already exists
    const existingRegistration = await CourseRegistration.findOne({
      student: studentId,
      session,
      semester
    });

    if (existingRegistration) {
      throw createError(409, 'Course registration already exists for this session and semester');
    }

    // Create new registration
    const registration = new CourseRegistration({
      student: studentId,
      session,
      semester,
      courses: courses.map(course => course.toUpperCase())
    });

    await registration.save();

    res.status(201).json({
      success: true,
      data: registration
    });

  } catch (error) {
    next(error);
  }
};

exports.getRegisteredCourses = async (req, res, next) => {
  try {
    const { session, semester } = req.query;
    const studentId = req.user._id;

    const query = { student: studentId };

    // Add optional filters
    if (session) query.session = session;
    if (semester) query.semester = parseInt(semester);

    const registrations = await CourseRegistration.find(query)
      .sort({ session: -1, semester: 1 });

    res.status(200).json({
      success: true,
      data: registrations
    });

  } catch (error) {
    next(error);
  }
};

exports.deleteRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const registration = await CourseRegistration.findOneAndDelete({
      _id: id,
      student: studentId
    });

    if (!registration) {
      throw createError(404, 'Course registration not found');
    }

    res.status(200).json({
      success: true,
      message: 'Course registration deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

exports.saveSubscription = async (req, res, next) => {
  try {
    const { userId, subscription } = req.body;

    await User.updateOne({ _id: userId }, { $set: { pushSubscription: subscription } });
  
    res.status(200).json({ message: 'Subscription saved successfully.' });
  } catch (error) {
    next(error);
  }
}

exports.getTranscript = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { session, semester } = req.query;

    const registration = await CourseRegistration.findOne({
      student: studentId,
      session,
      semester
    });

    if (!registration) {
      throw createError(404, 'Course registration not found for specified session or semester');
    }

    const transcript = {
      session: registration.session,
      semester: registration.semester,
      isComplete: true,
      totalCreditEarned: 0,
      totalCreditUnit: 0,
      courses: []
    };

    await Promise.all(registration.courses.map(async (course) => {
      const scoreSheet = await Score.findOne({
        courseCode: course,
        session: registration.session,
        semester: registration.semester
      });

      if (!scoreSheet) {
        transcript.courses.push({
          courseCode: course,
          score: "N/A"
        });
        transcript.isComplete = false;
        return;
      }

      const studentScore = scoreSheet.scores.find(
        score => score.registrationNumber === req.user.registrationNumber
      );

      if (!studentScore) {
        transcript.courses.push({
          courseCode: course,
          score: "N/A"
        });
        transcript.isComplete = false;
        return;
      }

      const grade = studentScore.score >= 70 ? 'A' :
        studentScore.score >= 60 ? 'B' :
        studentScore.score >= 50 ? 'C' :
        studentScore.score >= 45 ? 'D' :
        studentScore.score >= 40 ? "E" : 'F';

      const gradeToPointMapping = {
        A: 5,
        B: 4,
        C: 3,
        D: 2,
        E: 1,
        F: 0
      };

      transcript.totalCreditEarned += gradeToPointMapping[grade] * scoreSheet.unit;
      transcript.totalCreditUnit += scoreSheet.unit;
      transcript.courses.push({
        courseCode: course,
        unit: scoreSheet.unit,
        grade,
        score: studentScore.score
      });
    }));

    transcript.gpa = transcript.totalCreditUnit > 0 
      ? (transcript.totalCreditEarned / transcript.totalCreditUnit).toFixed(2)
      : "0.00";

    registration.is_transcript_ready = transcript.isComplete;
    await registration.save();
    res.status(200).json({
      success: true,
      data: transcript
    });

  } catch (error) {
    next(error);
  }
};

exports.markTranscriptAsSeen = async (req, res, next) => {
  try {
    const {courseRegId} = req.body

    const registration = await CourseRegistration.findOne({
      student: studentId,
      session,
      semester
    });

    if (!registration) {
      throw createError(404, 'Course registration not found for specified session or semester');
    }

    registration.is_transcript_seen = true;
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Transcript marked as seen'
    });

  } catch (error) {
    next(error);
  }
}


