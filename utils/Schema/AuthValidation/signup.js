const Joi = require("joi");

const signup_schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  mobileNumber: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = signup_schema;
