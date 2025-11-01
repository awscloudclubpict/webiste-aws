import express from "express";
import {
  registerForEvent,
  markAttendance,
  claimCertificate,
  getMyEvents
} from "../controllers/userEventController.js";

const router = express.Router();

// user event routes
router.post("/register", registerForEvent);
router.post("/attendance", markAttendance);
router.get("/my-events", getMyEvents);
router.post("/certificate/:eventId", claimCertificate);

export default router;
