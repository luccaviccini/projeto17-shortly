import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import routes from "./routes/main.routes.js";

const app = express();
app.use(express.json()); // to receive req in body
app.use(cors());

app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
