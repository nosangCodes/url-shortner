import { Router } from "express";
import verufyAccessToken from "../middleware/verify-access-token.js";
import { urlController } from "../controllers/index.js";
import validate from "../middleware/validate-joi.js";
import { shortenUrlValidation } from "../validations/index.js";

const router = Router();

router.post(
  "/shorten",
  validate(shortenUrlValidation.create),
  verufyAccessToken,
  urlController.createShortUrl
);

router.get(
  "/shorten/:alias",
  validate(shortenUrlValidation.redirect),
  urlController.redirectToOriginalUrl
);

export default router;
