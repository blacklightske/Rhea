import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://georgietonga:rhaemobileapp@cluster0.5nkav89.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'rhea_platform';

let db: Db;
let client: MongoClient;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

export const closeDatabaseConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('Database connection closed');
  }
};