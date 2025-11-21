// API route to send WhatsApp and SMS alerts using Twilio
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_NUMBER
const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER
const client = twilio(accountSid, authToken)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { message, phoneNumbers } = req.body
  try {
    // Send SMS
    for (const number of phoneNumbers) {
      await client.messages.create({
        body: message,
        from: twilioPhone,
        to: number,
      })
    }
    // Send WhatsApp
    for (const number of phoneNumbers) {
      await client.messages.create({
        body: message,
        from: `whatsapp:${twilioWhatsApp}`,
        to: `whatsapp:${number}`,
      })
    }
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
