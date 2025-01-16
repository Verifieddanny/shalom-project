const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const LecturerCode = require('../models/LecturerCodeModel');

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { accessToken };
};

exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role, registrationNumber, lecturerCode, phoneNumber } = req.body;

    if (role === 'student' && (!registrationNumber || !fullName || !email || !password || !phoneNumber)) {
      throw createError(400, 'All fields are required');
    }

    if (!role) {
      throw createError(400, 'Role is required');
    }

    if (!['student', 'lecturer'].includes(role)) {
      throw createError(400, 'Invalid role');
    }

    const existingUser = role === 'student' 
      ? await User.findOne({ registrationNumber })
      : await User.findOne({ email });


    if (existingUser) {
      throw createError(409, 'User already exists');
    }

    if (role === 'lecturer') {
      if (!lecturerCode) {
        throw createError(400, 'Lecturer code is required');
      }
      const isValidCode = await verifyLecturerCode(lecturerCode);
      if (!isValidCode) {
        throw createError(401, 'Invalid lecturer code');
      }
    }

    const user = new User({
      fullName,
      email,
      password,
      role,
      ...(role === 'student' && { registrationNumber }),
      ...(role === 'student' && { phoneNumber }),
      ...(role === 'lecturer' && { lecturerCode })
    });

    await user.save();

    if (role === 'lecturer') {
        const foundLecturerCode = await LecturerCode.findOne({ code: lecturerCode });
        if (!foundLecturerCode) {
          throw createError(500, "Failed to invalidate lecturer code");
        }
        foundLecturerCode.isValid = false;
        await foundLecturerCode.save();
    }

    const { accessToken } = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          ...(user.registrationNumber && { registrationNumber: user.registrationNumber }),
          ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
        },
        accessToken
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, registrationNumber, password } = req.body;

    let user;
    if (registrationNumber) {
      user = await User.findOne({ registrationNumber });
      if (user && !["student"].includes(user.role)) {
        throw createError(401, "Invalid credentials");
      }
    } else if (email) {
      user = await User.findOne({ email });
      if (user && !["lecturer", "admin"].includes(user.role)) {
        throw createError(401, "Invalid credentials");
      }
    }

    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError(401, 'Invalid credentials');
    }

    const { accessToken } = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          ...(user.registrationNumber && { registrationNumber: user.registrationNumber })
        },
        accessToken
      }
    });

  } catch (error) {
    next(error);
  }
};

async function verifyLecturerCode(code) {
  const validCode = await LecturerCode.findOne({ code, isValid: true });
  return !!validCode;
}
