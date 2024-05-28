import { Router } from "express";
import ExpensePlanningController from "../controllers/ExpensePlanning";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, ExpensePlanningController.index);
router.post("/", authMiddleware, ExpensePlanningController.store);
router.put("/:id", authMiddleware, ExpensePlanningController.update);
router.delete("/:id", authMiddleware, ExpensePlanningController.delete);

export default router;
