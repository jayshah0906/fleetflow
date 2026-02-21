// Environment variable validation
require('dotenv').config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  console.log('Environment variables validated successfully');
}

module.exports = {
  validateEnv,
  config: {
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    server: {
      port: process.env.PORT || 3000,
      nodeEnv: process.env.NODE_ENV || 'development',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
  },
};
