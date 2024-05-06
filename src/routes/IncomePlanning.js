import { Router } from "express";
import IncomePlanningController from "../controllers/IncomePlanning";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, IncomePlanningController.index);
router.post("/", authMiddleware, IncomePlanningController.store);
router.put("/", authMiddleware, IncomePlanningController.update);
router.delete("/", authMiddleware, IncomePlanningController.delete);

export default router;
