import dotenv from 'dotenv';
import { loadConfig } from './configStore';

dotenv.config();

type RuntimeEnv = {
  PORT: number;
  MONGODB_URI: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  APP_SECRET: string;
  COOKIE_DOMAIN?: string;
  PIXABAY_API_KEY?: string;
};

const cfg = loadConfig();

export let ENV: RuntimeEnv = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  MONGODB_URI: process.env.MONGODB_URI || cfg.MONGODB_URI || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || cfg.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || cfg.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || cfg.CLOUDINARY_API_SECRET || '',
  APP_SECRET: process.env.JWT_SECRET || (cfg as any).JWT_SECRET || 'dev-secret',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
  PIXABAY_API_KEY: process.env.PIXABAY_API_KEY || (cfg as any).PIXABAY_API_KEY || undefined
};

export function setRuntimeEnv(next: Partial<RuntimeEnv>) {
  ENV = { ...ENV, ...next };
}
