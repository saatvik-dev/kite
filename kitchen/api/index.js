// Single API file for Vercel without imports
// This is a catch-all handler for simplicity

// IMPORTANT: Vercel requires this exact function name 'handler'
export default async function handler(req, res) {
  // CORS headers for browser clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the specific path from the URL
  const urlPath = req.url.split('/api/')[1] || '';
  
  // Handle different endpoints
  try {
    if (req.method === 'GET' && urlPath === 'health') {
      // Health check endpoint
      return res.status(200).json({
        status: 'ok',
        environment: 'vercel',
        timestamp: new Date().toISOString(),
        message: 'M-Kite Kitchen API is running'
      });
    } 
    else if (req.method === 'POST' && urlPath === 'contact') {
      // Contact form endpoint
      const { name, email, phone, kitchenSize, message } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and phone are required fields'
        });
      }
      
      // In serverless mode we just acknowledge the submission
      return res.status(200).json({
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          name,
          email,
          phone,
          kitchenSize: kitchenSize || null,
          message: message || null,
          createdAt: new Date().toISOString()
        }
      });
    } 
    else if (req.method === 'POST' && urlPath === 'subscribe') {
      // Newsletter subscription endpoint
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      // In serverless mode we just acknowledge the subscription
      return res.status(200).json({
        success: true,
        message: 'Subscribed to newsletter successfully',
        data: {
          email,
          createdAt: new Date().toISOString()
        }
      });
    }
    else {
      // Fallback for unknown endpoints
      return res.status(200).json({
        message: 'M-Kite Kitchen API',
        endpoint: urlPath || 'root',
        method: req.method,
        info: 'Use specific endpoints like /api/health, /api/contact, or /api/subscribe'
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}