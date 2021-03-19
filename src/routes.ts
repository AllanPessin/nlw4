import { Router } from 'express'
import { SurveysController } from './controllers/SurveyController'
import { UserController } from './controllers/userController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();

router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

export { router };