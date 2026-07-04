'use server'

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    // Basic Validation
    if (!name || !email || !message) {
      return { success: false, error: 'Please fill out all fields.', message: '' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email as string)) {
      return { success: false, error: 'Please submit a valid email address.', message: '' }
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const CONTACT_RECIPIENT_EMAIL = process.env.CONTACT_RECIPIENT_EMAIL || 'support@nailestial.com'

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable.')
      return { success: false, error: 'Server configuration error. Please try again later.', message: '' }
    }

    const emailTemplate = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-w-xl; margin: 0 auto;">
        <h2>New Support Request</h2>
        <p><strong>Sender:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Support Engine <onboarding@resend.dev>', // Keep placeholder sender for unverified accounts
        reply_to: email, // This allows you to just hit 'Reply' seamlessly in your inbox!
        to: CONTACT_RECIPIENT_EMAIL,
        subject: `[nailestial Support] New Message from ${name}`,
        html: emailTemplate,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API Error:', errorData)
      throw new Error('Failed to dispatch email to the Resend API.')
    }

    return { 
      success: true, 
      message: 'Message sent successfully. Our concierge team will assist you shortly.',
      error: ''
    }
  } catch (error) {
    console.error('Contact Form Error:', error)
    return { 
      success: false, 
      error: 'Unable to send message. Please try again later.',
      message: ''
    }
  }
}
