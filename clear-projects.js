const { MongoClient } = require('mongodb');
const fs = require('fs');

async function clearProjects() {
  const configPath = './server/config.json';
  if (!fs.existsSync(configPath)) {
    console.log('Config file not found');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const uri = config.MONGODB_URI;

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const projectsCollection = db.collection('projects');

    const result = await projectsCollection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} projects from database`);

    await client.close();
    console.log('Database cleanup completed');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

clearProjects();
