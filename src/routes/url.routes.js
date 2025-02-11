import { Router } from "express";
import verifyAccessToken from "../middleware/verify-access-token.js";
import { urlController } from "../controllers/index.js";
import validate from "../middleware/validate-joi.js";
import { shortenUrlValidation } from "../validations/index.js";

const router = Router();

router.post(
  "/shorten",
  validate(shortenUrlValidation.create),
  verifyAccessToken,
  urlController.createShortUrl
);

router.get(
  "/shorten/:alias",
  validate(shortenUrlValidation.redirect),
  urlController.redirectToOriginalUrl
);

router.get("/alias", urlController.getAliasList);

router.get(
  "/analytics/overall",
  verifyAccessToken,
  urlController.geteAnalyticsByUser
);
router.get(
  "/analytics/:alias",
  verifyAccessToken,
  urlController.getAnalyticsByAlias
);

router.get(
  "/analytics/topic/:topic",
  verifyAccessToken,
  urlController.getAnalyticsByTopic
);

export default router;
