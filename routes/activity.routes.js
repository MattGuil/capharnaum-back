const router = require('express').Router();

const activityController = require('../contollers/activity.controller');

router.get('/', activityController.getAllActivities);
router.post('/filter/:userId', activityController.getFilteredActivities);
router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.patch('/:id/increment-participants', activityController.incrementParticipants);
router.patch('/:id/decrement-participants', activityController.decrementParticipants);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.get('/user/:userId', activityController.getActivitiesCreatedByUser);

module.exports = router;
