import express from "express";
import {
  calcularMetricas,
  importarCSV,
  downloadJson,
} from "../controllers/graphicController.js";

const router = express.Router();

router.post("/import", importarCSV);
router.get("/", calcularMetricas);
router.get("/download/json", downloadJson);

export default router;
