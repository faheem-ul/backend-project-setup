import express from "express";
import cors from "cors";

const app = express();

// app.use(cors({
//     origin: process.env.
//     credentials: true,
// }));

//Routes

import userRouter from "./routes/user.routes.js";

//Routes Declaration
app.use("/api/v1/users", userRouter);

export { app };
