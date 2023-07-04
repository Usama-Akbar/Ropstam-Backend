const Joi = require("joi");

const bet_schema = Joi.object({
  emailAddress: Joi.string().email().required(),
  betType: Joi.string().required(),
  Deductedbalance: Joi.required(),
});

module.exports = bet_schema;
