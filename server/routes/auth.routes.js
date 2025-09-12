import { Router } from "express";
import {Login,SignUp} from "../controllers/auth.controller.js"
import { signupValidation ,loginValidation} from "../middleware/AuthValidation.js";
const router=Router();

router.post('/signup',signupValidation,SignUp);
router.post('/login',loginValidation,Login);

export default router;