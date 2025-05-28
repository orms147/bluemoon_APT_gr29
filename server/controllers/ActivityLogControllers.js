<<<<<<< HEAD
import ActivityLog from "../models/ActivityLogModel.js";

export const getRecentActivities = async (req, res, next) => {
    try {
        const activities = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(5);
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
    } 
=======
import ActivityLog from "../models/ActivityLogModel.js";

export const getRecentActivities = async (req, res, next) => {
    try {
        const activities = await ActivityLog.find({}).sort({ timestamp: -1 }).limit(5);
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
    } 
>>>>>>> quanna
}