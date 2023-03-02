import {Router} from 'express';
import userRoutes from "./users.routes.js";
import urlRoutes from "./urls.routes.js";

const router = Router();

router.use([userRoutes, urlRoutes]);

export default router;