import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlRoutes from "./url.routes.js";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/",
    route: urlRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
