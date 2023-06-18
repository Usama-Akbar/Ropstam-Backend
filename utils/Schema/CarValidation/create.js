const Joi = require("joi");

const car_schema = Joi.object({
  title: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.string().required(),
  color: Joi.string().required(),
  mileage: Joi.string().required(),
  price: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().required(),
  meta_title: Joi.string().required(),
  meta_description: Joi.string().required(),
  featured: Joi.boolean().required(),
  owner: Joi.string().required(),
  status: Joi.string(),
  thumbnail: Joi.string().required(),
});

module.exports = car_schema;
