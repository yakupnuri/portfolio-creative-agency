import fs from 'fs';
import path from 'path';
const baseDir = process.cwd();

export type AppConfig = {
  MONGODB_URI?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  HERO_PUBLIC_ID?: string;
  HERO_URL?: string;
  PIXABAY_API_KEY?: string;
  JWT_SECRET?: string;
};

const configPath = path.join(baseDir, 'config.json');

export function loadConfig(): AppConfig {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as AppConfig;
  } catch {
    return {};
  }
}

export function saveConfig(cfg: AppConfig) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2), 'utf-8');
}

export function isConfigured(): boolean {
  const c = loadConfig();
  return !!(c.MONGODB_URI && c.CLOUDINARY_CLOUD_NAME && c.CLOUDINARY_API_KEY && c.CLOUDINARY_API_SECRET);
}
