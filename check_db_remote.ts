
import mongoose from 'mongoose';
import { ContentModel } from './server/models/Content';

const MONGO_URI = "mongodb+srv://yakupnuriart_db_user:JUqH9bhrJz6W9bpj@cluster0.abpbiyz.mongodb.net/?appName=Cluster0";

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const doc = await ContentModel.findOne({ key: 'home_hero' });
    console.log('--- RAW DB DOC ---');
    console.log(JSON.stringify(doc?.toObject(), null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

check();
