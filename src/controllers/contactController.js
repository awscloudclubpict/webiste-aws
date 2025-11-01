export const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // EmailJS REST API call
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "default_service", // You may need to configure this in EmailJS dashboard
        template_id: "template_contact", // Create a template in EmailJS dashboard
        user_id: "OxlMVJyiyvcJQAjev", // Your public key
        template_params: {
          from_name: name,
          from_email: email,
          message: message,
          to_email: "canteenmanagement2025@gmail.com", // Your email to receive messages
        },
      }),
    });

    if (response.ok) {
      res.status(200).json({ message: "Message sent successfully!" });
    } else {
      const errorText = await response.text();
      console.error("EmailJS error:", errorText);
      res.status(500).json({ error: "Failed to send message" });
    }
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
