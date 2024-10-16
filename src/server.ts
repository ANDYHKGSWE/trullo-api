import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middleware/error.middleware";

// Import all models to ensure they are registered with Mongoose
import "./models/user.model";
import "./models/task.model";
import "./models/project.model";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.get("/", (req: Request, res: Response) => {
    res.send("Trullo API");
});

// Catch-all route for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
