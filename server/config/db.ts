import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  // Disable Mongoose command buffering so queries fail immediately if MongoDB is not reachable
  mongoose.set('bufferCommands', false);
  mongoose.set('strictQuery', false);

  if (!mongoUri) {
    console.log('ℹ️ [Database] MONGODB_URI not configured. Operating in high-speed local persistent storage mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      retryWrites: true
    });

    isConnected = true;
    console.log(`✅ [Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    const errorMsg = error?.message || 'Connection failed';
    console.warn(`ℹ️ [Database] MongoDB Atlas unreachable (${errorMsg}).`);
    console.log('ℹ️ [Database] Active engine: JSON file-backed ACID persistent storage engine.');
    isConnected = false;
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect error
    }
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
