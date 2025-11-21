// Proxy API route for LSTM panic detection
// This proxies requests to the backend to avoid CORS issues

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('http://localhost:5001/api/inference/lstm-panic-detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: req.body,
    })

    if (!response.ok) {
      console.error(`Backend returned ${response.status}`)
      return res.status(response.status).json({ error: 'Backend inference failed' })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Inference proxy error:', error.message)
    return res.status(500).json({ error: 'Inference request failed', message: error.message })
  }
}
