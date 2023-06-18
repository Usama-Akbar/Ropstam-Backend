const Joi = require("joi");

const category_schema = Joi.object({
  category: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string(),
});

module.exports = category_schema;
