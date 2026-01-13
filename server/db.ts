import mongoose from 'mongoose';
import { ENV } from './env';

let connected = false;

export async function connectMongo(): Promise<boolean> {
  if (!ENV.MONGODB_URI) return false;
  if (connected) return true;
  try {
    await mongoose.connect(ENV.MONGODB_URI);
    connected = true;
    return true;
  } catch {
    connected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return connected;
}
