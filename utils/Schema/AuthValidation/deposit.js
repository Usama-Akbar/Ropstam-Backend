const Joi = require("joi");

const deposit_schema = Joi.object({
  emailAddress: Joi.string().email().required(),
  balance: Joi.required(),
});

module.exports = deposit_schema;
