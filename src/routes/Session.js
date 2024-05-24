import { Router } from "express";
import SessionController from "../controllers/Session";

const router = Router();

router.post("/", SessionController.store);
router.post("/validate", SessionController.validate);

export default router;