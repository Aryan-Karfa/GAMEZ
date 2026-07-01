const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'RAWG_API_KEY',
  'FRONTEND_URL',
  'PORT'
];

const missing = requiredEnvVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error('================================================================');
  console.error('FATAL SYSTEM STARTUP FAILURE: MISSING REQUIRED ENV VARIABLES');
  console.error('----------------------------------------------------------------');
  missing.forEach((v) => {
    console.error(`- MISSING: ${v}`);
  });
  console.error('================================================================');
  process.exit(1);
}

export const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  rawgApiKey: process.env.RAWG_API_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  port: parseInt(process.env.PORT, 10) || 5050,
  nodeEnv: process.env.NODE_ENV || 'development'
};
