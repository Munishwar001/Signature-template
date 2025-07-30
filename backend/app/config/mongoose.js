import mongoose from "mongoose";
console.log("Connecting to MongoDB...", process.env.MONGO_CONNECTION_STRING);

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
export default mongoose;