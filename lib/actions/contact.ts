'use server'

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    // Basic Validation
    if (!name || !email || !message) {
      return { success: false, error: 'Please fill out all fields.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email as string)) {
      return { success: false, error: 'Please submit a valid email address.' }
    }

    // Simulate CRM Integration / API POST Delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { 
      success: true, 
      message: 'Message sent successfully. Our concierge team will assist you shortly.' 
    }
  } catch (error) {
    console.error('Contact Form Error:', error)
    return { 
      success: false, 
      error: 'Unable to send message. Please try again later.' 
    }
  }
}
