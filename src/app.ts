import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
dotenv.config();
const app = express();

app.use(express.json());
const port = process.env.PORT;
app.use("/api/v1", routes);
app.listen(port , ()=>{
    console.log(`Server running at :${port}`);
})