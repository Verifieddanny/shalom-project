const express = require("express");
const router = express.Router();

const { generateLecturerCode, getLecturers, getStudents, getScores } = require("../controllers/admin.controller");

router.post("/create-lecturer-code", generateLecturerCode);
router.get("/scores", getScores);
router.get("/lecturers", getLecturers);
router.get("/students", getStudents);

module.exports = router;