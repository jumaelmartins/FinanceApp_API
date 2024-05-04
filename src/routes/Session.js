import { Router } from "express";
import SessionController from "../controllers/Session";

const router = Router();

router.post("/", SessionController.store);

export default router;