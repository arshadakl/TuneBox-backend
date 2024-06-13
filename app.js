import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});
