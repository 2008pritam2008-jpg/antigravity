# API Documentation & Endpoint Reference

Base URL: `/api/v1`

All responses follow the standard `ApiResponse` envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null
}
```

Error responses return:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "ph_level", "message": "Expected number, received string" }
    ]
  }
}
```

---

## 1. System Health

### `GET /health`
Returns the operational health and connectivity status of the backend, database, and AI engine.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "timestamp": "2026-11-11T10:45:00.000Z",
    "uptime_seconds": 124.5,
    "services": {
      "database": "connected",
      "gemini_ai": "ready",
      "weather": "ready"
    }
  }
}
```

---

## 2. Farmer Profile

### `GET /profile`
Retrieves the profile of the authenticated farmer. Requires `Authorization: Bearer <token>`.

### `PATCH /profile`
Updates farmer contact, regional defaults, and preferred language.

**Request Body:**
```json
{
  "full_name": "Ramesh Patel",
  "phone": "9876543210",
  "state": "Maharashtra",
  "district": "Nashik",
  "village": "Niphad",
  "farming_experience": 12,
  "preferred_language": "mr",
  "preferred_unit": "metric"
}
```

---

## 3. Farms & Land Management

### `GET /farms`
Lists all land parcels owned by the authenticated user.

### `POST /farms`
Registers a new agricultural plot.

**Request Body:**
```json
{
  "farm_name": "Godavari Riverside Plot",
  "state": "Maharashtra",
  "district": "Nashik",
  "village": "Pimpalgaon",
  "total_area": 4.5,
  "area_unit": "hectares",
  "soil_type": "black soil",
  "irrigation_type": "drip_system",
  "water_availability": "abundant",
  "current_crop": "Grapes"
}
```

### `GET /farms/:id`
Retrieves a specific farm plot.

### `PATCH /farms/:id`
Updates farm details.

### `DELETE /farms/:id`
Removes a farm plot and cascades related advisories.

---

## 4. AI Agricultural Advisories

### `POST /advisories/crop-recommendation`
Generates ranked crop suitability options using Gemini 2.5 Flash.

**Request Body:**
```json
{
  "farm_id": "00000000-0000-0000-0000-000000000001",
  "season": "Rabi",
  "soil_type": "black soil",
  "ph_level": 7.2,
  "water_availability": "medium",
  "budget_inr": 45000,
  "land_area": 2.0,
  "area_unit": "hectares",
  "previous_crop": "Soybean"
}
```

**Response Data (`recommendations`):**
```json
{
  "recommended_crops": [
    {
      "crop_name": "Chickpea (Gram)",
      "variety": "Digvijay / Vijay",
      "suitability_score": 94,
      "expected_yield": "18-22 Quintals / Hectare",
      "estimated_cost_inr": 22000,
      "estimated_profit_inr": 55000,
      "growth_duration_days": 105,
      "rationale": "High residual moisture in black soil following Kharif soybean makes chickpea ideal with minimal irrigation.",
      "risk_factors": ["Pod borer attack during flowering", "Unseasonal winter showers"]
    }
  ],
  "advisory_summary": "Chickpea and Wheat are top contenders for your plot this Rabi season."
}
```

### `POST /advisories/soil-analysis`
Evaluates chemical and physical soil test parameters.

**Request Body:**
```json
{
  "ph": 5.8,
  "ec": 0.45,
  "organic_carbon": 0.42,
  "nitrogen_kg_ha": 180,
  "phosphorus_kg_ha": 14,
  "potassium_kg_ha": 290,
  "crop_intent": "Maize"
}
```

### `POST /advisories/disease-detection`
Multimodal disease and pest diagnosis. Accepts `multipart/form-data`.

**Form Fields:**
- `image`: Image file (`image/jpeg`, `image/png`, `image/webp`, max 8MB)
- `crop_name`: "Tomato"
- `symptoms_description`: "Black concentric rings on lower leaves with yellow halo"
- `affected_plant_part`: "leaf"

---

## 5. Cultivation Planning

### `POST /cultivation-plans`
Builds a stage-wise production calendar.

**Request Body:**
```json
{
  "crop_name": "Wheat",
  "farm_id": "00000000-0000-0000-0000-000000000001",
  "sowing_date": "2026-11-15",
  "land_area": 1.5,
  "area_unit": "hectares"
}
```

### `PATCH /cultivation-plans/tasks/:id`
Updates completion status of a stage task (`pending` | `in_progress` | `completed`).

---

## 6. Weather & Climate

### `GET /weather/current?lat=20.00&lon=73.78`
Returns current temperature, humidity, wind, and precipitation.

### `GET /weather/forecast?lat=20.00&lon=73.78`
Returns 7-day weather outlook.

### `GET /weather/agricultural-advisory?lat=20.00&lon=73.78`
Returns actionable weather rules (e.g. spray windows, irrigation pauses).

---

## 7. Chat Assistant

### `GET /chat/conversations`
Lists past chat sessions.

### `POST /chat/conversations`
Creates a new conversation session.

### `POST /chat/conversations/:id/messages`
Sends user prompt to the multilingual agronomist AI assistant.

