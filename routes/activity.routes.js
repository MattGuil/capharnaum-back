const router = require('express').Router();

const activityController = require('../contollers/activity.controller');

router.get('/', activityController.getAllActivities);
router.post('/filter', activityController.getFilteredActivities);
router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.get('/user/:userId', activityController.getActivitiesCreatedByUser);

module.exports = router;
