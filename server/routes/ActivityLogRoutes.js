<<<<<<< HEAD
import { Router } from 'express';
import { getRecentActivities } from '../controllers/ActivityLogControllers.js';

const activityRoutes = Router();

activityRoutes.get('/recent', getRecentActivities);

=======
import { Router } from 'express';
import { getRecentActivities } from '../controllers/ActivityLogControllers.js';

const activityRoutes = Router();

activityRoutes.get('/recent', getRecentActivities);

>>>>>>> quanna
export default activityRoutes;