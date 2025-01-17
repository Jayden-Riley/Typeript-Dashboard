import { MongoClient, BSON } from "mongodb"; // Import MongoDB client and BSON for handling ObjectIds

// Retrieve the MongoDB connection string from environment variables
let connectionString = process.env.MONGODB_CONNECTION_STRING || "";

// Check if the connection string is provided, throw an error if not
if (!connectionString) {
  throw new Error(
    "No connection string provided. \n\nPlease create a `.env` file in the root of this project. Add a CONNECTION_STRING variable to that file with the connection string to your MongoDB cluster. \nRefer to the README.md file for more information."
  );
}

// Ensure that the connection string includes the appName parameter to track application usage
if (connectionString.indexOf("appName") === -1) {
  // If appName is missing, append it to the connection string
  connectionString +=
    connectionString.indexOf("?") > -1
      ? "&appName=devrel.template.remix|"
      : "?appName=devrel.template.remix|";
} else {
  // If appName is already present, modify it to append the appropriate value
  connectionString = connectionString.replace(
    /appName\=([a-z0-9]*)/i,
    (m, p) => `appName=devrel.template.remix|${p}`
  );
}

// Declare the MongoDB client variable
let client: MongoClient;

// Declare a global variable to persist the database connection across requests in development
declare global {
  var __db: MongoClient | undefined;
}

// Establish the MongoDB client connection
if (process.env.NODE_ENV === "production") {
  // In production, directly create a new MongoClient instance
  client = new MongoClient(connectionString);
} else {
  // In development, reuse the MongoClient connection across multiple requests
  if (!global.__db) {
    global.__db = new MongoClient(connectionString);
  }
  client = global.__db; // Reuse the existing client if already created
}

// Export the MongoDB client and the BSON ObjectId class for use in other parts of the application
let ObjectId = BSON.ObjectId;

export { client, ObjectId };
