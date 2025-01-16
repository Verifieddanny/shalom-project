const mongoose = require('mongoose');

const courseRegistrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}\/\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid session format! Use YYYY/YYYY`
    }
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  courses: [{
    type: String,
    uppercase: true,
    trim: true
  }],
  is_transcript_ready: {
    type: Boolean,
    default: false
  },
  is_transcript_seen: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a student can only register once per session and semester
courseRegistrationSchema.index({ student: 1, session: 1, semester: 1 }, { unique: true });

const CourseRegistration = mongoose.model('CourseRegistration', courseRegistrationSchema);

module.exports = CourseRegistration; 