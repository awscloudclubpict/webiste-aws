import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    collegeName: String,
    branch: String,
    yearOfStudy: Number,
    companyName: String,
    role: { type: String, enum: ["student", "professional","admin"], required: true },
    registeredEvents: [
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    eventTitle: { type: String, required: false },   
    attendanceMarked: { type: Boolean, default: false },
    codeEntered: { type: String, default: "" },
    certificateGenerated: { type: Boolean, default: false },
    certificateUrl: { type: String, default: "" }
  }
]

});

export default mongoose.model("UserSchema", userSchema);
