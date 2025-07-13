import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
// will server static files through uploads folder.

// routes
app.use('/api/users', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
