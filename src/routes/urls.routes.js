import { Router } from "express";
import { getURL, postURL } from "../controllers/url.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../schemas/url.schema.js";

const router = Router();

router.post("/urls/shorten", authValidation, validateSchema(urlSchema), postURL);
router.get("/urls/:id", getURL);

export default router;
