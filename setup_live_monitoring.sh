#!/bin/bash
# Live Camera Monitoring Setup Script

echo "🚀 Setting up Live Camera Monitoring with LSTM Panic Detection..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install multer
npm install

# Python dependencies
echo "🐍 Checking Python dependencies..."
pip install tensorflow opencv-python numpy

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start MongoDB:"
echo "   mongod"
echo ""
echo "2. Start the backend (in backend directory):"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (in frontend directory):"
echo "   npm run dev"
echo ""
echo "4. Navigate to: http://localhost:3000/admin/monitoring"
echo ""
echo "📚 Documentation: See LIVE_MONITORING_README.md"
