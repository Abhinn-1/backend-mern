import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors"

const app = express();
app.use(express.json());

//app.use(cors());

app.use(
    cors({
        origin: "https://bookyard-one.vercel.app",
       methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    })
);

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('welcome')
});

app.use("/books", booksRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('app connected to db');
        app.listen(PORT, () =>{
        console.log(`app is listening to port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
