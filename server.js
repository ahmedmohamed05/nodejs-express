import express from "express";
import posts from "./routes/posts.js";
import logger from "./middleware/posts-logger.js";
import errorHandler from "./middleware/error-handler.js";
import notFoundHandler from "./middleware/not-found.js";
import path from "path";
import cors from "cors";

const PORT = process.env.PORT || 8080;
const app = express();

// Body parse middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(import.meta.dirname, "public")));

// Global middlewares
app.use(logger);

// Routes
app.use("/api/posts", posts);

app.use(notFoundHandler);

// Middlewares
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
