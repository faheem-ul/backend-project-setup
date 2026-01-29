import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors({
//     origin: process.env.
//     credentials: true,
// }));

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

//Routes

import userRouter from "./routes/user.routes.js";

//Routes Declaration
app.use("/api/v1/users", userRouter);

export { app };
