import Joi from "joi";
import status from "http-status";
import pick from "../utils/pick.js";

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, [
    "params",
    "query",
    "body",
  ]);

  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorDetails = error.details.map((detail) => ({
      field: detail.context.key,
      message: detail.message.replace(/"/g, ""),
    }));

    return res.status(status.BAD_REQUEST).json({
      error: "Validation Error",
      message: errorDetails,
    });
  }
  Object.assign(req, value);
  return next();
};

export default validate;
