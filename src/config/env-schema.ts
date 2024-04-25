import * as Joi from 'joi';

export const envSchema = Joi.object({
  // Aplication
  PORT: Joi.string().required().default(3000),
  // Token
  JWT_TOKEN: Joi.string().required(),
  // Database
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required().default(5432),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required().default('postgres'),
  POSTGRES_SSL: Joi.boolean().required().default(false),
  // Cloudinary
  CLOUD_NAME: Joi.string().required(),
  CLOUD_KEY: Joi.string().required(),
  CLOUD_SECRET: Joi.string().required(),
});
