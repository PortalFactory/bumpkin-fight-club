import mongoose from "mongoose";

export const connect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
};

export const disconnect = async () => await mongoose.disconnect();

export const isConnected = () => mongoose.connection.readyState === 1;

export const getDatabase = () => mongoose.connection.db;
