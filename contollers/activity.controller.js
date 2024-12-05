const Activity = require('../models/activity.model');

exports.createActivity = async (req, res) => {
	try {
		const activity = new Activity(req.body);
		await activity.save();
		res.status(201).json({
			message: 'Activity created successfully',
			activity
		});
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.getAllActivities = async (req, res) => {
	try {
		const activities = await Activity.find();

		res.status(200).json(activities);
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.getActivityById = async (req, res) => {
	try {
		const activity = await Activity.findById(req.params.id);
		if (!activity) {
			return res.status(404).json({
				message: 'Activity not found'
			});
		}
		res.status(200).json(activity);
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.updateActivity = async (req, res) => {
	try {
		const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!activity) {
			return res.status(404).json({
				message: 'Activity not found'
			});
		}
		res.status(200).json(activity);
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.deleteActivity = async (req, res) => {
	try {
		const activity = await Activity.findByIdAndDelete(req.params.id);
		if (!activity) {
			return res.status(404).json({
				message: 'Activity not found'
			});
		}
		res.status(200).json({
			message: 'Activity deleted successfully'
		});
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.getActivitiesCreatedByUser = async (req, res) => {
	try {
		const activities = await Activity.find({ owner: req.params.userId });

		res.status(200).json(activities);
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};

exports.countActivitiesCreatedByUser = async (req, res) => {
	try {
		const activityCount = await Activity.countDocuments({ owner: req.params.userId });

		res.status(200).json({
			activityCount
		});
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};