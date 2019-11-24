import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

const router = new Router();

router.post('/sessions', SessionController.store);

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

export default router;
