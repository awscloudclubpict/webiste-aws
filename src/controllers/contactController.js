import emailjs from "@emailjs/nodejs";

export const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // EmailJS Node.js SDK
    const result = await emailjs.send(
      "service_085wm7y", // Service ID
      "template_famfbdn", // Template ID
      {
        name: name, // Matches {{name}} in your template
        email: email, // Matches {{email}} in your template
        title: "New Contact Message", // For subject line
        message: message, // The contact message content
      },
      {
        publicKey: "OxlMVJyiyvcJQAjev", // Your public key
      }
    );

    console.log("EmailJS result:", result);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("EmailJS error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
