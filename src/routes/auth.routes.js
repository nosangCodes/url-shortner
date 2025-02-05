import { Router } from "express";
import passport from "../passport.config.js";
import { userController } from "../controllers/index.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  userController.createUser
);

export default router;
