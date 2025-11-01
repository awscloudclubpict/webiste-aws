import User from "../models/User.js";
import Event from "../models/Event.js";
// import { generateCertificate } from "../utils/generateCertificate.js"; // Uncomment when ready

// ✅ Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    console.log(`[REGISTER EVENT] Request received at ${new Date().toISOString()}`);
    console.log(`[REGISTER EVENT] Payload:`, req.body);

    // Validate input
    if (!userId || !eventId) {
      console.warn(`[REGISTER EVENT] Missing userId or eventId`);
      return res.status(400).json({
        message: "userId and eventId are required"
      });
    }

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      console.warn(`[REGISTER EVENT] Event not found: ${eventId}`);
      return res.status(404).json({ message: "Event not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[REGISTER EVENT] User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already registered
    const alreadyRegistered = user.registeredEvents.some(
      e => e.event.toString() === eventId
    );

    if (alreadyRegistered) {
      console.warn(`[REGISTER EVENT] User ${userId} already registered for event ${eventId}`);
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // ✅ Register user and store event title too
    user.registeredEvents.push({
      event: eventId,
      eventTitle: event.title,
      attendanceMarked: false,
      codeEntered: "",
      certificateGenerated: false,
      certificateUrl: ""
    });

    await user.save();

    console.log(`[REGISTER EVENT] Success: User ${userId} registered for event ${eventId}`);

    return res.json({
      message: "Event registration successful ✅",
      registeredEvent: {
        eventId,
        eventTitle: event.title
      }
    });

  } catch (err) {
    console.error(`[REGISTER EVENT ERROR] ${new Date().toISOString()}`);
    console.error(`[REGISTER EVENT ERROR] Payload:`, req.body);
    console.error(`[REGISTER EVENT ERROR] Stack Trace:`, err.stack);

    res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
};



// ✅ Mark attendance using event code
export const markAttendance = async (req, res) => {
  try {
    const { userId, eventId, eventCode } = req.body;

    // Validate request payload
    if (!userId || !eventId || !eventCode) {
      console.warn(`[ATTENDANCE WARNING] Missing fields - Payload:`, req.body);
      return res.status(400).json({ message: "userId, eventId & eventCode required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.warn(`[ATTENDANCE WARNING] Event not found - eventId: ${eventId}`);
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`[ATTENDANCE WARNING] User not found - userId: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    const regEvent = user.registeredEvents.find(
      (e) => e.event.toString() === eventId
    );

    if (!regEvent) {
      console.warn(`[ATTENDANCE WARNING] User not registered for event - userId: ${userId}, eventId: ${eventId}`);
      return res.status(400).json({ message: "You are not registered for this event" });
    }

    if (regEvent.attendanceMarked) {
      console.warn(`[ATTENDANCE WARNING] Attendance already marked - userId: ${userId}, eventId: ${eventId}`);
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Validate event code
    if (event.event_id !== eventCode) {
      console.warn(`[ATTENDANCE WARNING] Invalid event code - Entered: ${eventCode}, Expected: ${event.event_id}`);
      return res.status(400).json({ message: "Invalid event code ❌" });
    }

    // ✅ Mark attendance
    regEvent.attendanceMarked = true;
    regEvent.codeEntered = eventCode;

    await user.save();

    return res.json({
      message: "Attendance marked successfully ✅",
      event: event.title
    });

  } catch (err) {
    console.error("\n[ATTENDANCE ERROR]", new Date().toISOString());
    console.error("[ERROR MESSAGE]:", err.message);
    console.error("[REQUEST PAYLOAD]:", req.body);
    console.error("[STACK TRACE]:", err.stack);

    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
};


// ✅ Claim certificate - generate and store URL
export const claimCertificate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const user = await User.findById(userId).populate("registeredEvents.event");
    const regEvent = user.registeredEvents.find(
      (e) => e.event._id.toString() === eventId
    );

    if (!regEvent)
      return res.status(400).json({ message: "You are not registered for this event" });

    if (!regEvent.attendanceMarked)
      return res.status(400).json({ message: "Mark attendance first" });

    if (regEvent.certificateGenerated)
      return res.status(400).json({ message: "Certificate already generated" });

    // ✅ Generate certificate (implement later)
    // const certificateUrl = await generateCertificate(user, regEvent.event);

    // Temporary test placeholder
    const certificateUrl = `https://your-cdn.com/certificates/${userId}-${eventId}.pdf`;

    regEvent.certificateGenerated = true;
    regEvent.certificateUrl = certificateUrl;

    await user.save();

    res.json({
      message: "Certificate generated ✅",
      certificateUrl
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user's registered events
export const getMyEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("registeredEvents.event");

    res.json(user.registeredEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
