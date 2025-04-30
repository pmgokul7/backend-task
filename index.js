import express, { Router } from 'express';
import {connectDb, sequelize} from './db.js';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from "dotenv"
import router from './routes/index.js';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

const limiter=rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, //per windo
  message: 'Too many requests',
})

app.use(cors());
app.use(helmet());
app.use(express.json())
app.use(limiter);


//connecting database
await connectDb();



app.use("/api/v1",router)


process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('SIGINT', async () => {
   await sequelize.close();
    // process.exit(0);
});

app.listen(PORT,()=>{
  console.log("server started on port "+PORT)
})

