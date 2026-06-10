import { Router } from "express";
import { createTaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { createTaskSchema } from "../validators/task.validator";

const router = Router();

router.post("/", authenticate, validateBody(createTaskSchema), createTaskController);

export default router;