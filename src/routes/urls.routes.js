import { Router } from "express";
import { deleteURL, getShortURL, getURL, postURL } from "../controllers/url.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../schemas/url.schema.js";

const router = Router();

router.post("/urls/shorten", authValidation, validateSchema(urlSchema), postURL);
router.get("/urls/:id", getURL);
router.get("/urls/open/:shortUrl",getShortURL);
router.delete("/urls/:id", authValidation, deleteURL);

export default router;
