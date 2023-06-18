const Joi = require("joi");

const userupdate_schema = Joi.object({
  id: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userType: Joi.string().required(),
  mobileNumber: Joi.string().required(),
});

module.exports = userupdate_schema;
