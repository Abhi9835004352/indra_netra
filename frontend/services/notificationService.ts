// Service to send notifications via WhatsApp and SMS

export async function sendWhatsAppNotification(phone: string, message: string) {
  // Use unified alert API endpoint
  try {
    const response = await fetch("/api/send-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, phoneNumbers: [phone] }),
    })
    return await response.json();
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendSMSNotification(phone: string, message: string) {
  // Use unified alert API endpoint
  try {
    const response = await fetch("/api/send-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, phoneNumbers: [phone] }),
    })
    return await response.json();
  } catch (error) {
    return { success: false, error };
  }
}
