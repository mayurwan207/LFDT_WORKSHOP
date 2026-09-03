const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken, isNormalViewer, isHeadUser } = require('../middleware/auth');

router.post('/:eventId/register', [verifyToken, isNormalViewer], registrationController.registerForEvent);
router.get('/my-events', [verifyToken, isNormalViewer], registrationController.getMyRegistrations);
router.get('/:eventId/attendees', [verifyToken, isHeadUser], registrationController.getEventAttendees);

module.exports = router;
