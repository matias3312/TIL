import express from "express";
import cors from "cors";
import {router as AuthRoutes} from './routes/auth.routes'


const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use("/api",AuthRoutes)


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
