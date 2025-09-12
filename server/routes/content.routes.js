import { Router } from "express";
import { createLevelContent } from "../controllers/content.controller.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const router=Router();
router.post("/createLevelContent", ensureAuthenticated, createLevelContent)

export default router;