const Joi = require("joi");

const signin_schema = Joi.object({
  emailAddress: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = signin_schema;
