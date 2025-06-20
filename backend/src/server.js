import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import graphicsRoutes from "./routes/graphicsRoutes.js";

const app = express();
const PORT = 5021;

app.use(cors());

app.use("/api/metricas", graphicsRoutes);

// app.use((req, res, next) => {
//   res.removeHeader("Content-Security-Policy");
//   next();
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
  });
});
