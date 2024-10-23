import express, { Express, Request, Response } from "express";
import { env } from "./api/v1/config/env";

const app: Express = express();
const port = env.PORT || 3000;

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
