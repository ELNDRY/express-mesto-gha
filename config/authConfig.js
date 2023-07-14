require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const authConfig = {
  mode: NODE_ENV || 'production',
  jwtSecret: JWT_SECRET || 'super-strong-secret',
  saltLength: 10,
};

module.export = authConfig;
