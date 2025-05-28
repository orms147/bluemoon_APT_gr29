import { Router } from 'express';
import { getRecentActivities } from '../controllers/ActivityLogControllers.js';

const activityRoutes = Router();

activityRoutes.get('/recent', getRecentActivities);

export default activityRoutes;