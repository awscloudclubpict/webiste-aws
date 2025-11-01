import sgMail from "@sendgrid/mail";

export const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: "canteenmanagement2025@gmail.com", // Your email to receive messages
      from: "noreply@yourdomain.com", // Must be verified in SendGrid
      replyTo: email, // Reply to the user's email
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);

    console.log("SendGrid email sent successfully");
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("SendGrid error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
