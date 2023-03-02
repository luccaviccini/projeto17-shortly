import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { signUpSchema } from "../schemas/user.schema.js";
import { signInSchema } from "../schemas/signIn.schema.js";
import { userSignUp, userSignIn } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { userExists } from "../middlewares/userExists.middleware.js";

const router = Router();

router.post("/signup", validateSchema(signUpSchema), userExists, userSignUp);
router.post("/signin", validateSchema(signInSchema), userSignIn);



export default router;