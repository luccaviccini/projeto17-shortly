import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signUpSchema } from "../schemas/user.schema.js";
import { signInSchema } from "../schemas/signIn.schema.js";
import { signUp, signIn } from "../controllers/users.controller.js";

const router = Router();

router.post("/signup",validateSchema(signUpSchema), signUp);
router.post("/signin", validateSchema(signInSchema), signIn);

export default router;