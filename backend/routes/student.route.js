const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');


router.post('/register-courses', studentController.registerCourses);
router.get('/registered-courses', studentController.getRegisteredCourses);
router.post("/save-subscription", studentController.saveSubscription)
router.get("/transcript", studentController.getTranscript)
router.patch("/transcript", studentController.markTranscriptAsSeen)
router.delete('/registration/:id', studentController.deleteRegistration);

// mark transcript as seen when student views a complete transcript


module.exports = router; 