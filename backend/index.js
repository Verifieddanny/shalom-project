const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { verifyToken, checkRole } = require("./middleware/auth");
const lecturerRoute = require("./routes/lecturer.route");
const studentRoute = require("./routes/student.route");
const adminRoute = require("./routes/admin.route");
const authRoute = require("./routes/auth.route");
const marked = require("marked");
const { Agenda } = require("@hokify/agenda");
const User = require("./models/UserModel");
const CourseRegistration = require("./models/CourseRegistrationModel");
const Score = require("./models/ScoreModel");
const { sendNotification } = require("./util/sendNotification");
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  if (!req.path.startsWith("/api/auth") && !req.path.startsWith("/ping")) {
    return await verifyToken(req, res, next);
  }
  next();
});

app.get("/ping", async (req, res) => {
  const docs = `# Shalom Project Backend API Documentation

## Base URL
[https://shalom-project-api.onrender.com/api](https://shalom-project-api.onrender.com/api)

## Authentication
Base path: \`/auth\`

### Sign In
\`\`\`
POST /auth/login
\`\`\`
Authenticates a user and returns access tokens.

**Body Parameters**:
- For Students:
  - \`registrationNumber\`: Student's registration number
  - \`password\`: User's password
- For Lecturers/Admin:
  - \`email\`: User's email address
  - \`password\`: User's password

### Sign Up
\`\`\`
POST /auth/register
\`\`\`
Registers a new user in the system.

**Body Parameters**:
- \`fullName\`: User's full name
- \`email\`: User's email address
- \`password\`: User's password
- \`role\`: User's role ('student', 'lecturer')
- \`phoneNumber\`: String (required for students, prefixed with + country code)
- \`registrationNumber\`: Required for students only
- \`lecturerCode\`: Required for lecturers only (must be generated by admin)

## Student Routes
Base path: \`/student\`

### Register Courses
\`\`\`
POST /student/register-courses
\`\`\`
Register courses for a specific session and semester.

**Body Parameters**:
- \`session\`: Academic session (format: "YYYY/YYYY")
- \`semester\`: Semester number (1 or 2)
- \`courses\`: Array of course codes
\`\`\`
{
  "session": "2023/2024",
  "semester": 1,
  "courses": ["CSC101", "MTH101", "PHY101"]
}
\`\`\`

### Get Registered Courses
\`\`\`
GET /student/registered-courses
\`\`\`
Retrieve student's registered courses.

**Query Parameters** (optional):
- \`session\`: Filter by academic session
- \`semester\`: Filter by semester

### Delete Course Registration
\`\`\`
DELETE /student/registration/:id
\`\`\`
Delete a specific course registration.

**URL Parameters**:
- \`id\`: Course registration ID

### Save subscription to push notification
\`\`\`
POST /student/save-subscription
\`\`\`
Registers a subscription to send push notifications to (we will use last logged in device).

**Body Parameters**:
- \`userId\`: User ID
- \`subscription\`: Returned subscription object from browser.

### Get Transcript
\`\`\`
GET /student/transcript
\`\`\`
Generate and return user transcript for selected semester and session based on available data.

**URL query Parameters**:
- \`semester\`: Semester number (1 or 2)
- \`session\`: Session for generated transcript (format: "YYYY/YYYY")

## Lecturer Routes
Base path: \`/lecturer\`

### Upload Scores
\`\`\`
POST /lecturer/upload-scores
\`\`\`
Upload scores for students in a course.

**Body Parameters**:
- \`courseCode\`: Course code
- \`unit\`: Course unit load
- \`session\`: Academic session (format: "YYYY/YYYY")
- \`semester\`: Semester number (1 or 2)
- \`scores\`: Array of student scores
\`\`\`
{
  "courseCode": "CSC101",
  "unit": 3,
  "session": "2023/2024",
  "semester": 1,
  "scores": [
    {
      "registrationNumber": "REG123",
      "score": 85
    },
    {
      "registrationNumber": "REG124",
      "score": 90
    }
  ]
}
\`\`\`

### Get Scores
\`\`\`
GET /lecturer/scores
\`\`\`
Retrieve scores for courses.

**Query Parameters** (optional):
- \`courseCode\`: Filter by course code
- \`session\`: Filter by academic session
- \`semester\`: Filter by semester

### Update Scores
\`\`\`
PATCH /lecturer/scores
\`\`\`
Update entire scoresheet for a course.

**Body Parameters**:
- \`courseCode\`: Course code
- \`session\`: Academic session
- \`semester\`: Semester number
- \`scores\`: Array of updated student scores
\`\`\`
{
  "courseCode": "CSC101",
  "session": "2023/2024",
  "semester": 1,
  "scores": [
    {
      "registrationNumber": "REG123",
      "score": 87
    },
    {
      "registrationNumber": "REG124",
      "score": 92
    }
  ]
}
\`\`\`

### Delete Scores
\`\`\`
DELETE /lecturer/scores/:id
\`\`\`
Delete a specific scoresheet.

**URL Parameters**:
- \`id\`: Scoresheet ID

### Update Student Score
\`\`\`
PATCH /lecturer/update-student-score
\`\`\`
Update a single student's score in a scoresheet.

**Body Parameters**:
\`\`\`
{
  "courseCode": "CSC101",
  "session": "2023/2024",
  "semester": 1,
  "registrationNumber": "REG123",
  "newScore": 88
}
\`\`\`

## Admin Routes
Base path: \`/admin\`

### Create Lecturer Code
\`\`\`
POST /admin/create-lecturer-code
\`\`\`
Creates a lecturer code for lecturer signup.

### Get Lecturers
\`\`\`
GET /admin/lecturers
\`\`\`
Retrieves all lecturers.

### Get Students
\`\`\`
GET /admin/students
\`\`\`
Retrieves all students.

### Get Scoresheets
\`\`\`
GET /admin/scores
\`\`\`
Retrieves all scoresheets.

**Return format**:
\`\`\`
{
    "_id": "676a76ccf9ac459e6f4d94c0",
    "courseCode": "COS110",
    "unit": 2,
    "session": "YYYY/YYYY",
    "semester": 1,
    "lecturer": {
        "_id": "67669244945eb520e637dcf3",
        "fullName": "Lecturer name",
        "email": "lecturer email"
    },
    "scores": [],
    "uploadedAt": "2024-12-24T08:54:36.274Z",
},
\`\`\`

## Authentication
All routes except \`/auth/*\` require authentication via JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Models

### User
- \`fullName\`: String (required)
- \`email\`: String (required, unique)
- \`password\`: String (required, hashed)
- \`role\`: String (enum: ['student', 'lecturer'])
- \`registrationNumber\`: String (required for students)
- \`phoneNumber\`: String (required for students, prefixed with + country code)
- \`lecturerCode\`: String (required for lecturers)

### CourseRegistration
- \`student\`: ObjectId (reference to User)
- \`session\`: String (YYYY/YYYY format)
- \`semester\`: Number (1 or 2)
- \`courses\`: Array of Strings
- \`registeredAt\`: Date

### Score
- \`courseCode\`: String
- \`session\`: String (YYYY/YYYY format)
- \`semester\`: Number (1 or 2)
- \`lecturer\`: ObjectId (reference to User)
- \`scores\`: Array of Objects
  - \`registrationNumber\`: String
  - \`score\`: Number (0-100)
- \`uploadedAt\`: Date
- \`lastModifiedAt\`: Date`;

  const html = await marked.marked.parse(docs);
  res.set("Content-Type", "text/html");
  res.send(html);
});

app.use("/api/auth", authRoute);
app.use("/api/lecturer", checkRole(["lecturer"]), lecturerRoute);
app.use("/api/student", checkRole(["student"]), studentRoute);
app.use("/api/admin", checkRole(["admin"]), adminRoute);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const agenda = new Agenda({ db: { address: MONGO_URI } });

agenda.define("check transcript state", async (job) => {
  const users = await User.find({ role: "student" });
  users.forEach(async (user) => {
    const registrations = await CourseRegistration.find({
      student: user._id,
    });
    registrations.forEach(async (registration) => {
      if (
        registration.is_transcript_ready &&
        !registration.is_transcript_seen
      ) {
        const payload = {
          title: "Transcript Ready",
          body: `Transcript for ${user.fullName} (${registration.session}/semester ${registration.semester}) is ready!`,
        }
        try {
          await sendNotification(payload.title, payload.body, user.phoneNumber, user.email);
          console.log("Notification sent to", user.fullName);
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      } else if (!registration.is_transcript_ready) {
        let allCoursesReadyPromise = await Promise.all(
          registration.courses.map(async (course) => {
            const scoreSheet = await Score.findOne({
              courseCode: course,
              session: registration.session,
              semester: registration.semester,
            });

            if (!scoreSheet) {
              return false;
            }

            return scoreSheet.scores && scoreSheet.scores.length > 0
              ? scoreSheet.scores.some(
                  (score) =>
                    score.registrationNumber === user.registrationNumber
                )
              : false;
          })
        );

        const allCoursesReady = allCoursesReadyPromise.every(
          (isReady) => isReady
        );
        if (allCoursesReady) {
          registration.is_transcript_ready = true;
          await registration.save();
          return;
        }
        return;
      }
    });
  });
});

(async function () {
  await agenda.start();

  await agenda.every("3 minutes", "check transcript state");
})();

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB:", err));
