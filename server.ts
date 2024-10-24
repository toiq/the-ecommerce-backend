import express, { Express } from "express";
import { env } from "./config/env.js";
import rootRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app: Express = express();
const port = env.PORT;

// middlewares

app.use(express.json());

// Routes
app.use("/api", rootRouter);

// Error middleware
app.use(errorMiddleware);

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
