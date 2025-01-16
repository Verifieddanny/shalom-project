const mongoose = require('mongoose');

const lecturerCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LecturerCode = mongoose.model('LecturerCode', lecturerCodeSchema);

module.exports = LecturerCode; 