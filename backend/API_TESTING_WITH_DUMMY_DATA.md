# 🧪 Backend API Testing Guide with Dummy Data

## 📋 Complete API List with Test Data

---

## 1️⃣ HEALTH CHECK

### Endpoint: `GET /health`
```
URL: http://localhost:5000/health
Method: GET
Headers: None
Body: Empty
```

**Response (200):**
```json
{
  "status": "✅ Backend is running"
}
```

---

## 2️⃣ EVENT MANAGEMENT

### 2.1 Create Event
**Endpoint:** `POST /api/events`
```
URL: http://localhost:5000/api/events
Method: POST
Headers: Content-Type: application/json
```

**Request Body (Dummy Data):**
```json
{
  "name": "Hackathon 2025 - Tech Summit",
  "totalCapacity": 3000,
  "safeLimit": 2550,
  "zones": ["A", "B", "C"],
  "gates": [
    {
      "gateId": "G1",
      "zoneName": "A",
      "capacity": 1000
    },
    {
      "gateId": "G2",
      "zoneName": "B",
      "capacity": 1000
    },
    {
      "gateId": "G3",
      "zoneName": "C",
      "capacity": 1000
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Hackathon 2025 - Tech Summit",
    "totalCapacity": 3000,
    "safeLimit": 2550,
    "zones": ["A", "B", "C"],
    "gates": [
      { "gateId": "G1", "zoneName": "A", "capacity": 1000 },
      { "gateId": "G2", "zoneName": "B", "capacity": 1000 },
      { "gateId": "G3", "zoneName": "C", "capacity": 1000 }
    ],
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
}
```

**⚠️ Save the `_id` value as `EVENT_ID` for other requests**

---

### 2.2 Get All Events
**Endpoint:** `GET /api/events`
```
URL: http://localhost:5000/api/events
Method: GET
Headers: None
Body: Empty
```

**Response (200):**
```json
{
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Hackathon 2025 - Tech Summit",
      "totalCapacity": 3000,
      "safeLimit": 2550,
      "zones": ["A", "B", "C"],
      "createdAt": "2025-11-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2.3 Get Event by ID
**Endpoint:** `GET /api/events/:eventId`
```
URL: http://localhost:5000/api/events/507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Response (200):**
```json
{
  "event": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Hackathon 2025 - Tech Summit",
    "totalCapacity": 3000,
    "safeLimit": 2550,
    "zones": ["A", "B", "C"],
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
}
```

---

### 2.4 Create Gate for Event
**Endpoint:** `POST /api/events/:eventId/gate`
```
URL: http://localhost:5000/api/events/507f1f77bcf86cd799439011/gate
Method: POST
Headers: Content-Type: application/json
```

**Request Body (Dummy Data):**
```json
{
  "gateId": "G4",
  "gateName": "VIP Gate - Premium Entrance",
  "zoneName": "VIP",
  "capacity": 500,
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "message": "Gate created successfully",
  "gate": {
    "_id": "507f1f77bcf86cd799439012",
    "gateId": "G4",
    "gateName": "VIP Gate - Premium Entrance",
    "zoneName": "VIP",
    "capacity": 500,
    "currentCount": 0,
    "totalEntered": 0,
    "eventId": "507f1f77bcf86cd799439011"
  }
}
```

---

### 2.5 Get All Gates for Event
**Endpoint:** `GET /api/events/:eventId/gates`
```
URL: http://localhost:5000/api/events/507f1f77bcf86cd799439011/gates
Method: GET
Headers: None
Body: Empty
```

**Response (200):**
```json
{
  "gates": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "gateId": "G1",
      "gateName": "Main Gate - North",
      "zoneName": "A",
      "capacity": 1000,
      "currentCount": 0,
      "totalEntered": 0,
      "eventId": "507f1f77bcf86cd799439011"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "gateId": "G2",
      "gateName": "Secondary Gate - East",
      "zoneName": "B",
      "capacity": 1000,
      "currentCount": 0,
      "totalEntered": 0,
      "eventId": "507f1f77bcf86cd799439011"
    }
  ]
}
```

---

## 3️⃣ USER REGISTRATION & QR

### 3.1 Register User
**Endpoint:** `POST /api/auth/register`
```
URL: http://localhost:5000/api/auth/register
Method: POST
Headers: Content-Type: application/json
```

**Request Body (Dummy Data):**
```json
{
  "name": "Abhishek Singh",
  "phone": "9876543210",
  "email": "abhishek@example.com",
  "gate": "G1",
  "zone": "A",
  "timeSlot": "10:00-11:00",
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439020",
    "name": "Abhishek Singh",
    "phone": "9876543210",
    "gate": "G1",
    "zone": "A",
    "qrCode": "{\"userId\":\"9876543210\",\"eventId\":\"507f1f77bcf86cd799439011\",\"timestamp\":1700580000000,\"unique\":\"abc-123-def\"}",
    "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYzAAAA..."
  }
}
```

**⚠️ Save the `qrCode` value for check-in testing**

---

### 3.2 Register Another User (for second check-in)
**Request Body:**
```json
{
  "name": "Priya Sharma",
  "phone": "9876543211",
  "email": "priya@example.com",
  "gate": "G2",
  "zone": "B",
  "timeSlot": "10:30-11:30",
  "eventId": "507f1f77bcf86cd799439011"
}
```

---

### 3.3 Register Third User
**Request Body:**
```json
{
  "name": "Raj Kumar",
  "phone": "9876543212",
  "email": "raj@example.com",
  "gate": "G3",
  "zone": "C",
  "timeSlot": "11:00-12:00",
  "eventId": "507f1f77bcf86cd799439011"
}
```

---

### 3.4 Get User by Phone
**Endpoint:** `GET /api/auth/user`
```
URL: http://localhost:5000/api/auth/user?phone=9876543210&eventId=507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
phone: 9876543210
eventId: 507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Abhishek Singh",
    "phone": "9876543210",
    "email": "abhishek@example.com",
    "gate": "G1",
    "zone": "A",
    "checkedIn": false,
    "eventId": "507f1f77bcf86cd799439011"
  }
}
```

---

### 3.5 Get Registration History
**Endpoint:** `GET /api/auth/registration-history`
```
URL: http://localhost:5000/api/auth/registration-history?phone=9876543210
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
phone: 9876543210
```

**Response (200):**
```json
{
  "registrations": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Abhishek Singh",
      "phone": "9876543210",
      "gate": "G1",
      "zone": "A",
      "checkedIn": false,
      "eventId": "507f1f77bcf86cd799439011",
      "createdAt": "2025-11-21T10:05:00.000Z"
    }
  ]
}
```

---

## 4️⃣ GATE CHECK-IN & ENTRY

### 4.1 Check-in User (Scan QR)
**Endpoint:** `POST /api/gate/checkin`
```
URL: http://localhost:5000/api/gate/checkin
Method: POST
Headers: Content-Type: application/json
```

**Request Body (Use QR from registration):**
```json
{
  "qrCode": "{\"userId\":\"9876543210\",\"eventId\":\"507f1f77bcf86cd799439011\",\"timestamp\":1700580000000,\"unique\":\"abc-123-def\"}",
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "message": "Check-in successful",
  "user": {
    "id": "507f1f77bcf86cd799439020",
    "name": "Abhishek Singh",
    "gate": "G1",
    "zone": "A",
    "checkedInTime": "2025-11-21T10:15:30.000Z"
  }
}
```

---

### 4.2 Get Gate Statistics
**Endpoint:** `GET /api/gate/stats`
```
URL: http://localhost:5000/api/gate/stats?eventId=507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
eventId: 507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "totalRegistered": 3,
  "totalCheckedIn": 1,
  "gates": [
    {
      "gateId": "G1",
      "gateName": "Main Gate - North",
      "zoneName": "A",
      "capacity": 1000,
      "currentCount": 1,
      "totalEntered": 1,
      "occupancyPercentage": "0.10"
    },
    {
      "gateId": "G2",
      "gateName": "Secondary Gate - East",
      "zoneName": "B",
      "capacity": 1000,
      "currentCount": 0,
      "totalEntered": 0,
      "occupancyPercentage": "0.00"
    },
    {
      "gateId": "G3",
      "gateName": "Tertiary Gate - South",
      "zoneName": "C",
      "capacity": 1000,
      "currentCount": 0,
      "totalEntered": 0,
      "occupancyPercentage": "0.00"
    }
  ]
}
```

---

### 4.3 Get Gate Details
**Endpoint:** `GET /api/gate/detail`
```
URL: http://localhost:5000/api/gate/detail?gateId=G1&eventId=507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
gateId: G1
eventId: 507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "gate": {
    "gateId": "G1",
    "gateName": "Main Gate - North",
    "zoneName": "A",
    "capacity": 1000,
    "currentCount": 1,
    "totalEntered": 1
  },
  "users": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Abhishek Singh",
      "phone": "9876543210",
      "gate": "G1",
      "checkedIn": true,
      "checkedInTime": "2025-11-21T10:15:30.000Z"
    }
  ]
}
```

---

## 5️⃣ CROWD DETECTION & AI INTEGRATION

### 5.1 Send AI Detection (Zone A - Green)
**Endpoint:** `POST /api/crowd/detect`
```
URL: http://localhost:5000/api/crowd/detect
Method: POST
Headers: Content-Type: application/json
```

**Request Body (Zone A - Safe):**
```json
{
  "zone": "A",
  "detectedCount": 500,
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Calculation:**
- Zone Capacity = 3000 / 3 = 1000
- Occupancy = (500 / 1000) × 100 = 50%
- Risk Level = 🟢 GREEN

**Response (200):**
```json
{
  "message": "Crowd detection received",
  "data": {
    "zone": "A",
    "detectedCount": 500,
    "capacity": 1000,
    "occupancyPercentage": 50,
    "riskLevel": "GREEN"
  }
}
```

---

### 5.2 Send AI Detection (Zone B - Yellow)
**Request Body (Zone B - Warning):**
```json
{
  "zone": "B",
  "detectedCount": 850,
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Calculation:**
- Occupancy = (850 / 1000) × 100 = 85%
- Risk Level = 🟡 YELLOW (Alert triggers!)

**Response (200):**
```json
{
  "message": "Crowd detection received",
  "data": {
    "zone": "B",
    "detectedCount": 850,
    "capacity": 1000,
    "occupancyPercentage": 85,
    "riskLevel": "YELLOW"
  }
}
```

---

### 5.3 Send AI Detection (Zone C - Red)
**Request Body (Zone C - Danger):**
```json
{
  "zone": "C",
  "detectedCount": 1150,
  "eventId": "507f1f77bcf86cd799439011"
}
```

**Calculation:**
- Occupancy = (1150 / 1000) × 100 = 115%
- Risk Level = 🔴 RED (Alert triggers!)

**Response (200):**
```json
{
  "message": "Crowd detection received",
  "data": {
    "zone": "C",
    "detectedCount": 1150,
    "capacity": 1000,
    "occupancyPercentage": 115,
    "riskLevel": "RED"
  }
}
```

---

### 5.4 Get Crowd Metrics
**Endpoint:** `GET /api/crowd/metrics`
```
URL: http://localhost:5000/api/crowd/metrics?eventId=507f1f77bcf86cd799439011&zone=A
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
eventId: 507f1f77bcf86cd799439011
zone: A (optional)
```

**Response (200):**
```json
{
  "metrics": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "zone": "A",
      "count": 500,
      "detectedCount": 500,
      "capacity": 1000,
      "occupancyPercentage": 50,
      "riskLevel": "GREEN",
      "eventId": "507f1f77bcf86cd799439011",
      "timestamp": "2025-11-21T10:20:00.000Z"
    }
  ]
}
```

---

### 5.5 Get Latest Crowd State (All Zones)
**Endpoint:** `GET /api/crowd/latest`
```
URL: http://localhost:5000/api/crowd/latest?eventId=507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
eventId: 507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "crowdState": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "zone": "A",
      "detectedCount": 500,
      "capacity": 1000,
      "occupancyPercentage": 50,
      "riskLevel": "GREEN"
    },
    {
      "_id": "507f1f77bcf86cd799439031",
      "zone": "B",
      "detectedCount": 850,
      "capacity": 1000,
      "occupancyPercentage": 85,
      "riskLevel": "YELLOW"
    },
    {
      "_id": "507f1f77bcf86cd799439032",
      "zone": "C",
      "detectedCount": 1150,
      "capacity": 1000,
      "occupancyPercentage": 115,
      "riskLevel": "RED"
    }
  ]
}
```

---

### 5.6 Get All Alerts
**Endpoint:** `GET /api/crowd/alerts`
```
URL: http://localhost:5000/api/crowd/alerts?eventId=507f1f77bcf86cd799439011
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
eventId: 507f1f77bcf86cd799439011
```

**Response (200):**
```json
{
  "alerts": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "zone": "B",
      "alertType": "WARNING",
      "message": "Zone B: 850 people detected. Occupancy: 85.00%",
      "riskLevel": "YELLOW",
      "crowdCount": 850,
      "threshold": 1000,
      "eventId": "507f1f77bcf86cd799439011",
      "acknowledged": false,
      "createdAt": "2025-11-21T10:21:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439041",
      "zone": "C",
      "alertType": "DANGER",
      "message": "Zone C: 1150 people detected. Occupancy: 115.00%",
      "riskLevel": "RED",
      "crowdCount": 1150,
      "threshold": 1000,
      "eventId": "507f1f77bcf86cd799439011",
      "acknowledged": false,
      "createdAt": "2025-11-21T10:22:00.000Z"
    }
  ]
}
```

---

### 5.7 Get Unacknowledged Alerts Only
**Endpoint:** `GET /api/crowd/alerts`
```
URL: http://localhost:5000/api/crowd/alerts?eventId=507f1f77bcf86cd799439011&acknowledged=false
Method: GET
Headers: None
Body: Empty
```

**Query Parameters:**
```
eventId: 507f1f77bcf86cd799439011
acknowledged: false
```

---

### 5.8 Acknowledge Alert
**Endpoint:** `POST /api/crowd/alert-acknowledge`
```
URL: http://localhost:5000/api/crowd/alert-acknowledge
Method: POST
Headers: Content-Type: application/json
```

**Request Body:**
```json
{
  "alertId": "507f1f77bcf86cd799439040"
}
```

**Response (200):**
```json
{
  "message": "Alert acknowledged",
  "alert": {
    "_id": "507f1f77bcf86cd799439040",
    "zone": "B",
    "alertType": "WARNING",
    "message": "Zone B: 850 people detected. Occupancy: 85.00%",
    "riskLevel": "YELLOW",
    "acknowledged": true,
    "createdAt": "2025-11-21T10:21:00.000Z"
  }
}
```

---

## 📊 Testing Sequence (Step-by-Step)

### **Step 1: Start Server**
```bash
cd backend
npm run dev
```
✅ Should show: `✅ MongoDB connected` and `🚀 Server running on port 5000`

---

### **Step 2: Test Health Check**
```
GET http://localhost:5000/health
```
✅ Should return: `{"status": "✅ Backend is running"}`

---

### **Step 3: Create Event**
```
POST http://localhost:5000/api/events
```
✅ Save the returned `_id` as `EVENT_ID`

---

### **Step 4: Register 3 Users**
```
POST http://localhost:5000/api/auth/register (3 times)
```
✅ Save the `qrCode` from each response

---

### **Step 5: Check-in Users**
```
POST http://localhost:5000/api/gate/checkin
```
✅ Use the saved QR codes from registration

---

### **Step 6: Send Crowd Detection** (3 times)
```
POST http://localhost:5000/api/crowd/detect
```
- Zone A (500) - GREEN
- Zone B (850) - YELLOW
- Zone C (1150) - RED

✅ Should create alerts for YELLOW and RED

---

### **Step 7: View Results**
```
GET http://localhost:5000/api/crowd/latest
GET http://localhost:5000/api/crowd/alerts
GET http://localhost:5000/api/gate/stats
```
✅ Should show all updated data

---

## 🎨 Risk Level Color Coding

| Occupancy | Color | Risk Level | Alert |
|-----------|-------|-----------|-------|
| 0-75% | 🟢 GREEN | Safe | No |
| 75-90% | 🟡 YELLOW | Warning | Yes |
| 90%+ | 🔴 RED | Danger | Yes |

---

## ✅ Checklist for Complete Testing

- [ ] Health check endpoint works
- [ ] Create event successfully
- [ ] Register multiple users
- [ ] QR codes generated
- [ ] Check-in updates gate count
- [ ] AI detection received
- [ ] Risk levels calculated correctly
- [ ] Alerts created for YELLOW/RED
- [ ] View all alerts and crowd data
- [ ] Acknowledge alerts

All endpoints tested! 🎉
