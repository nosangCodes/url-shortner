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

router.get("/alias", urlController.getAliasList);
router.get("/analytics/:alias", urlController.getAnalyticsByAlias);
router.get("/analytics/topic/:topic", urlController.getAnalyticsByTopic);

export default router;
