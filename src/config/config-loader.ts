export const configLoader = () => {
  return {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_TOKEN,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: process.env.DB_SSL,
    },
    cloudinary: {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    },
  };
};
