import mongoose from "mongoose";
import "dotenv/config"

/**
 * Connects to MongoDB using environment variables.
 * Uses `MONGODB_URI` based on `NODE_ENV`.
 */
export const connectToDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    const env = process.env.APP_ENV || "development";

    const uri =
      env === "production"
        ? process.env.MONGO_URI_PRODUCTION
        : env === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI_DEVELOPMENT;

    if (!uri) {
      throw new Error(`MongoDB URI not defined for environment: ${env}`);
    }

    const dbName = process.env.MONGODB_DB_NAME || "jotink";

    const connection = await mongoose.connect(uri, { dbName });

    console.log(
      `Database Connection Successfully Established`
    );

    // Optional: graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.disconnect();
      console.log("MongoDB disconnected on app termination");
      process.exit(0);
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while connecting to MongoDB.";
    console.error(`MongoDB connection failed: ${message}`);
    process.exit(1); // Exit with failure in CI/production
  }
};
