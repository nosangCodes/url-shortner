import { Router } from "express";
import passport from "../passport.config.js";

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
  (req, res) => {
    // send token

    res.redirect("/profile");
  }
);

export default router;
