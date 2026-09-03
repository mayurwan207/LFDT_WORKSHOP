const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isHeadUser } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', [verifyToken, isHeadUser], eventController.createEvent);
router.put('/:id', [verifyToken, isHeadUser], eventController.updateEvent);
router.delete('/:id', [verifyToken, isHeadUser], eventController.deleteEvent);

module.exports = router;
