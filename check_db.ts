
import mongoose from 'mongoose';
import { ContentModel } from './server/models/Content';
import { ENV } from './server/env';

async function check() {
  await mongoose.connect(ENV.MONGO_URI || 'mongodb://localhost:27017/portfolio_db');
  
  const doc = await ContentModel.findOne({ key: 'home_hero' });
  console.log('--- RAW DB DOC ---');
  console.log(JSON.stringify(doc?.toObject(), null, 2));
  
  await mongoose.disconnect();
}

check();
