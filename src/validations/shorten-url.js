import Joi from "joi";

export const create = {
  body: Joi.object().keys({
    original_url: Joi.string().uri().required(),
    alias: Joi.string().optional(),
    topic: Joi.string().optional(),
  }),
};

export const redirect = {
  params: Joi.object().keys({
    alias: Joi.string().required(),
  }),
};
