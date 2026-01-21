require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files from current directory

// Routes
app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Portfolio Contact Form <onboarding@resend.dev>', // Use default Resend testing domain
            to: ['pixelforge926@gmail.com'], // Send to the user's email
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h1>New Message</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
