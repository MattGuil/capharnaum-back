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

exports.getFilteredActivities = async (req, res) => {
    const filters = req.body;
    const query = {};

    if (filters.disciplines?.length > 0) {
        query.discipline = { $in: filters.disciplines };
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.priceRange) {
        query.price = { $gte: filters.priceRange.min, $lte: filters.priceRange.max };
    }

    if (filters.days?.length > 0) {
        query.$or = [
			{ day: { $in: filters.days } },
			{ day: "" }
		];
    }

    if (filters.dateRange) {
        const dateQuery = {};
		if (filters.dateRange.start) {
			dateQuery.$gte = new Date(filters.dateRange.start);
		}
		if (filters.dateRange.end) {
			dateQuery.$lte = new Date(filters.dateRange.end);
		}
		if (Object.keys(dateQuery).length > 0) {
			query.date = dateQuery;
		}
    }

    if (filters.timeRange) {
        if (filters.timeRange.start) {
			query.startTime = { $gte: filters.timeRange.start };
		}
		if (filters.timeRange.end) {
			query.endTime = { $lte: filters.timeRange.end };
		}
    }

    try {
        const activities = await Activity.find(query);
        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ error: error.message });
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