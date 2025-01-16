const express = require("express");
const router = express.Router();

const { uploadScores, getScores, deleteScores, updateScores, updateStudentScore } = require('../controllers/lecturer.controller');

router.post('/upload-scores', uploadScores);
router.get('/scores', getScores);
router.patch('/scores', updateScores);
router.delete('/scores/:id', deleteScores);
router.patch('/update-student-score', updateStudentScore);

module.exports = router;
