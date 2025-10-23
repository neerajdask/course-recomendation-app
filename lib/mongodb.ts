import { MongoClient } from "mongodb";

let mongoClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient.db();
  }

  try {
    const uri = process.env.MONGODB_URI!;
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    return mongoClient.db();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
}
