import {Router} from "express";
import {getAssessmentQuestions,evaluateAssessment} from "../controllers/assesment.controller.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const router=Router();

router.post("/questions", ensureAuthenticated, getAssessmentQuestions);
router.post("/evaluate", ensureAuthenticated, evaluateAssessment);

export default router;

