import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRouter from './routes/userRouter.js';
import { DBConnection } from './utils/config.js';
import CustomError from './utils/CustomError.js';
import cors from "cors"
import 'dotenv/config';
const app = express();
DBConnection()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);
app.use('/', userRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
      message: err.message,
      statusCode
  });
});

app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});