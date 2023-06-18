const Joi = require("joi");

const media_schema = Joi.object({
  file: Joi.object({
    size: Joi.number().max(5000000).required(), // Maximum file size of 5MB
    name: Joi.string()
      .regex(/\.jpg|\.jpeg|\.png$/)
      .required(), // Only allow .jpg, .jpeg, .png file extensions
  }).required(),
});

module.exports = media_schema;
