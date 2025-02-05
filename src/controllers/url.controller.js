import status from "http-status";
import { urlService, userService } from "../services/index.js";

export const createShortUrl = async (req, res) => {
  try {
    const result = await urlService.createShortUrl({
      ...req.body,
      user_id: req.user.userId,
    });

    if (!result) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        error: "Failed to shorten url",
      });
    }

    return res.status(status.CREATED).json(result);
  } catch (error) {
    console.error("Erroe creating short url", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong. Please try again.",
    });
  }
};

// /api/shorten/{alias}
export const redirectToOriginalUrl = async (req, res) => {
  try {
    const alias = req.params?.alias;
    if (!alias) {
      return res.status(status.BAD_REQUEST).json({
        error: "Missing params",
      });
    }
    const result = await urlService.getByAlias(alias);
    if (!result) {
      return res.status(status.NOT_FOUND).json({
        error: "alias not found",
      });
    }
    return res.redirect(`${result.original_url}`);
  } catch (error) {
    console.error("Erroe redurecting short url", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Something went wrong. Please try again.",
    });
  }
};
