const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [
      /^\+\d{11,15}$/,
      "Phone number must be prefixed with + and between 11 to 15 characters",
    ],
  },
  role: {
    type: String,
    enum: ["student", "lecturer", "admin"],
    required: true,
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows null values and maintains uniqueness for non-null values
    validate: {
      validator: function (v) {
        // Only required if role is student
        return this.role !== "student" || (this.role === "student" && v);
      },
      message: "Registration number is required for students",
    },
  },
  pushSubscription: {
    type: Object,
    default: null,
    validate: {
      validator: function (v) {
        if (this.role !== "student") {
          return v === null || v === undefined;
        }
        return true;
      },
      message: "Push subscription is only available for students",
    },
  },
  lecturerCode: {
    type: String,
    sparse: true,
    validate: {
      validator: function (v) {
        // Only required if role is lecturer
        return this.role !== "lecturer" || (this.role === "lecturer" && v);
      },
      message: "Lecturer code is required for lecturers",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
