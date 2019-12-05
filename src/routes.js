import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerOrderController from './app/controllers/AnswerOrderController';

const router = new Router();

router.post('/sessions', SessionController.store);

router.post('/students/:id/checkins', CheckinController.store);
router.get('/students/:id/checkins', CheckinController.index);

router.post('/students/:id/help-orders', HelpOrderController.store);
router.get('/students/:id/help-orders', HelpOrderController.index);

router.use(authMiddleware);

router.post('/students', StudentController.store);
router.put('/students/:id', StudentController.update);

router.get('/plans', PlanController.index);
router.post('/plans', PlanController.store);
router.put('/plans/:id', PlanController.update);
router.delete('/plans/:id', PlanController.delete);

router.post('/enrollments', EnrollmentController.store);
router.put('/enrollments/:id', EnrollmentController.update);
router.get('/enrollments', EnrollmentController.index);
router.get('/enrollments/:id', EnrollmentController.show);
router.delete('/enrollments/:id', EnrollmentController.delete);

router.post('/help-orders/:id/answer', AnswerOrderController.store);

export default router;
