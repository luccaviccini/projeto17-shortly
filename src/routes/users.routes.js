import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signUpSchema } from "../schemas/user.schema.js";
import { signUp } from "../controllers/users.controller.js";

const router = Router();

router.post("/signup",validateSchema(signUpSchema), signUp);

export default router;