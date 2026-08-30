import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let isConnected = false;

const connectToMongo = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn("MONGO_URI is not defined");
      return;
    }
    const uri = mongoURI.includes(DB_NAME) ? mongoURI : `${mongoURI}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(uri);
    isConnected = true;
    console.log(`Connected to mongo !! HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting with database", error);
  }
};

export default connectToMongo;
