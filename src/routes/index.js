import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
