import { Router } from "express";
import { getRoadmapById ,createRoadmap,getMyRoadmaps} from "../controllers/roadmap.controller.js";
import {ensureAuthenticated}from "../middleware/auth.js"
const router = Router();

router.post("/createRoadMap",ensureAuthenticated ,createRoadmap);
router.get("/getMyroadmaps",ensureAuthenticated,getMyRoadmaps);
router.get("/:id",ensureAuthenticated,getRoadmapById);


export default router;
