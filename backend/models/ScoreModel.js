const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  unit: {
    type: Number,
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
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: [{
    registrationNumber: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
});
    
scoreSchema.index({ courseCode: 1, session: 1, semester: 1 }, { unique: true });

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score; 