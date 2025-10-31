// backend/routes/contactRoutes.js
import express from "express";
import { contactUs } from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", contactUs);

export default router;
