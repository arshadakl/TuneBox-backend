import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRouter from './routes/userRouter.js';
import { DBConnection } from './utils/config.js';
import CustomError from './utils/CustomError.js';

import 'dotenv/config';
const app = express();
DBConnection()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', userRouter);

app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  });
  

app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});