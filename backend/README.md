# Indra Netra - Backend Setup & API Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and add:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/indra_netra?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Start the server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 📋 API Endpoints

### 1. Authentication & Registration

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "gate": "G1",
  "zone": "A",
  "timeSlot": "10:00-11:00",
  "eventId": "6756e1b2c3d4e5f6g7h8i9j0"
}

Response: 201
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "9876543210",
    "gate": "G1",
    "zone": "A",
    "qrCode": "{...json...}",
    "qrImage": "data:image/png;base64,..."
  }
}
```

#### Get User by Phone
```
GET /api/auth/user?phone=9876543210&eventId=6756e1b2c3d4e5f6g7h8i9j0
```

#### Get Registration History
```
GET /api/auth/registration-history?phone=9876543210
```

---

### 2. Event Management

#### Create Event
```
POST /api/events
Content-Type: application/json

{
  "name": "Concert 2025",
  "totalCapacity": 5000,
  "safeLimit": 4250,
  "zones": ["A", "B", "C", "D"],
  "gates": [
    { "gateId": "G1", "zoneName": "A", "capacity": 1250 },
    { "gateId": "G2", "zoneName": "B", "capacity": 1250 }
  ]
}

Response: 201
```

#### Get Event
```
GET /api/events/6756e1b2c3d4e5f6g7h8i9j0
```

#### Get All Events
```
GET /api/events
```

#### Create Gate for Event
```
POST /api/events/6756e1b2c3d4e5f6g7h8i9j0/gate
Content-Type: application/json

{
  "gateId": "G1",
  "gateName": "Main Gate",
  "zoneName": "A",
  "capacity": 1250,
  "eventId": "6756e1b2c3d4e5f6g7h8i9j0"
}
```

#### Get Gates for Event
```
GET /api/events/6756e1b2c3d4e5f6g7h8i9j0/gates
```

---

### 3. Gate Check-in System

#### Check-in User (Scan QR)
```
POST /api/gate/checkin
Content-Type: application/json

{
  "qrCode": "{...json...}",
  "eventId": "6756e1b2c3d4e5f6g7h8i9j0"
}

Response: 200
{
  "message": "Check-in successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "gate": "G1",
    "zone": "A",
    "checkedInTime": "2025-11-21T10:15:30.000Z"
  }
}
```

#### Get Gate Statistics
```
GET /api/gate/stats?eventId=6756e1b2c3d4e5f6g7h8i9j0

Response:
{
  "totalRegistered": 250,
  "totalCheckedIn": 185,
  "gates": [
    {
      "gateId": "G1",
      "gateName": "Main Gate",
      "zoneName": "A",
      "capacity": 1250,
      "currentCount": 95,
      "totalEntered": 95,
      "occupancyPercentage": "7.60"
    }
  ]
}
```

#### Get Gate Details
```
GET /api/gate/detail?gateId=G1&eventId=6756e1b2c3d4e5f6g7h8i9j0
```

---

### 4. AI Crowd Detection Integration

#### Receive AI Detection (From YOLO Model)
```
POST /api/crowd/detect
Content-Type: application/json

{
  "zone": "A",
  "detectedCount": 425,
  "eventId": "6756e1b2c3d4e5f6g7h8i9j0"
}

Response: 200
{
  "message": "Crowd detection received",
  "data": {
    "zone": "A",
    "detectedCount": 425,
    "capacity": 1250,
    "occupancyPercentage": 34,
    "riskLevel": "GREEN"
  }
}

WebSocket Events Emitted:
- heatmap_update: Real-time heatmap data
- alert_notification: Alert if risk level changed
```

#### Get Crowd Metrics
```
GET /api/crowd/metrics?eventId=6756e1b2c3d4e5f6g7h8i9j0&zone=A
```

#### Get Latest Crowd State (All Zones)
```
GET /api/crowd/latest?eventId=6756e1b2c3d4e5f6g7h8i9j0

Response:
{
  "crowdState": [
    {
      "zone": "A",
      "count": 425,
      "detectedCount": 425,
      "capacity": 1250,
      "occupancyPercentage": 34,
      "riskLevel": "GREEN"
    },
    {
      "zone": "B",
      "count": 1100,
      "detectedCount": 1100,
      "capacity": 1250,
      "occupancyPercentage": 88,
      "riskLevel": "YELLOW"
    }
  ]
}
```

---

### 5. Alert System

#### Get Alerts
```
GET /api/crowd/alerts?eventId=6756e1b2c3d4e5f6g7h8i9j0&zone=B&acknowledged=false
```

#### Acknowledge Alert
```
POST /api/crowd/alert-acknowledge
Content-Type: application/json

{
  "alertId": "alert_id"
}
```

---

## 🔄 WebSocket Events

### Server → Client (Listening)

**1. entry_count** - Gate entry count updated
```javascript
socket.on('entry_count', (data) => {
  // data = { gate, zone, currentCount, totalEntered, timestamp }
});
```

**2. heatmap_update** - Real-time crowd density update
```javascript
socket.on('heatmap_update', (data) => {
  // data = { zone, detectedCount, capacity, occupancyPercentage, riskLevel, timestamp }
  // riskLevel: "GREEN" (≤75%), "YELLOW" (75-90%), "RED" (>90%)
});
```

**3. alert_notification** - Alert triggered
```javascript
socket.on('alert_notification', (data) => {
  // data = { zone, alertType, message, riskLevel, crowdCount, timestamp }
});
```

### Client → Server (Emitting)

**1. join_crowd_monitoring** - Join real-time updates for event
```javascript
socket.emit('join_crowd_monitoring', eventId);
```

**2. leave_crowd_monitoring** - Leave real-time updates
```javascript
socket.emit('leave_crowd_monitoring', eventId);
```

---

## 📊 Risk Level Logic

The system calculates risk based on occupancy percentage:

- **GREEN**: 0-75% capacity
- **YELLOW**: 75-90% capacity (Warning)
- **RED**: 90%+ capacity (Danger)

Alerts are triggered when risk level reaches YELLOW or RED.

---

## 🗂️ Project Structure

```
backend/
├── models/              # MongoDB schemas
│   ├── Event.js
│   ├── User.js
│   ├── Gate.js
│   ├── CrowdMetrics.js
│   └── Alert.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── gateController.js
│   ├── crowdController.js
│   └── eventController.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── gateRoutes.js
│   ├── crowdRoutes.js
│   └── eventRoutes.js
├── utils/               # Utility functions
│   └── qrAndCrowd.js
├── server.js            # Main server file
├── package.json
├── .env.example
└── .gitignore
```

---

## 🔌 Integration with AI Model

Your YOLO model should send crowd detection data like this:

```bash
curl -X POST http://localhost:5000/api/crowd/detect \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "A",
    "detectedCount": 425,
    "eventId": "6756e1b2c3d4e5f6g7h8i9j0"
  }'
```

The backend will:
1. Save the detection data
2. Calculate occupancy percentage
3. Determine risk level
4. Create alert if needed
5. Broadcast WebSocket updates to all connected dashboards

---

## 🧪 Testing with Sample Data

### Create Event & Gates (Run Once)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hackathon 2025",
    "totalCapacity": 3000,
    "safeLimit": 2550,
    "zones": ["A", "B", "C"],
    "gates": [
      { "gateId": "G1", "zoneName": "A", "capacity": 1000 },
      { "gateId": "G2", "zoneName": "B", "capacity": 1000 },
      { "gateId": "G3", "zoneName": "C", "capacity": 1000 }
    ]
  }'
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9876543210",
    "email": "test@example.com",
    "gate": "G1",
    "zone": "A",
    "timeSlot": "10:00-11:00",
    "eventId": "<EVENT_ID_FROM_ABOVE>"
  }'
```

### Simulate AI Detection
```bash
curl -X POST http://localhost:5000/api/crowd/detect \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "A",
    "detectedCount": 850,
    "eventId": "<EVENT_ID>"
  }'
```

---

## ⚙️ Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Recommended MongoDB Setup
Use MongoDB Atlas (free tier):
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Get connection string
5. Add it to `.env`

---

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check MONGODB_URI in .env
- Ensure network access is enabled in MongoDB Atlas
- Verify credentials are correct

**CORS Error:**
- Check FRONTEND_URL in .env
- Ensure frontend is running on specified port

**WebSocket Not Connecting:**
- Frontend must import Socket.IO client
- Check WebSocket connection URL

---

## 📝 Next Steps

1. ✅ Start server: `npm run dev`
2. ✅ Configure MongoDB in `.env`
3. ✅ Create event via API
4. ✅ Connect frontend services to backend URLs
5. ✅ Test QR registration & check-in flow
6. ✅ Integrate AI model to send crowd detection
7. ✅ Verify WebSocket updates in dashboard

---

## 📞 Support

For issues or questions, check:
- Server logs on terminal
- MongoDB Atlas dashboard
- Frontend browser console for WebSocket errors

---

Happy Building! 🎉
