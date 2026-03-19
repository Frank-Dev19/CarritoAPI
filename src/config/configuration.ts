import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  externalApiUrl: process.env.EXTERNAL_API_URL || 'https://dummyjson.com',
}));
