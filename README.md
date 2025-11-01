# MGNREGA Dashboard - Our Voice, Our Rights

A production-ready web application providing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data to rural Indian citizens through an accessible, low-literacy friendly interface.

## Project Specifications

### Purpose
Enable rural Indian citizens to access MGNREGA employment data for their districts through a simple, bilingual interface designed for users with limited technical literacy.

### Coverage
- 115 districts across 5 states
- Bihar (15 districts)
- Maharashtra (10 districts)
- Rajasthan (8 districts)
- Uttar Pradesh (74 districts)
- West Bengal (8 districts)

### Key Features
- Bilingual interface (Hindi/English)
- Automatic location detection using GPS
- District-wise MGNREGA data display
- State-based filtering
- Real-time search functionality
- Low-literacy friendly design (large fonts, icons, simple navigation)
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- Next.js 14.2.33
- React 18.2.0
- TypeScript 5.3.3
- TailwindCSS 3.4.0

### Backend
- Next.js API Routes
- Prisma ORM 5.7.1
- SQLite (development)
- PostgreSQL (production ready)

### Additional Libraries
- SWR 2.2.4 (data fetching)
- date-fns 3.0.6 (date handling)
- Jest 29.7.0 (testing)
- React Testing Library 14.1.2

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │   Mobile     │  │   Tablet     │     │
│  │  (Desktop)   │  │              │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
┌────────────────────────────┴─────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Presentation Layer                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │  District  │  │   Metric   │  │   Search   │    │   │
│  │  │  Selector  │  │    Card    │  │   Filter   │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │              API Routes Layer                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │  /districts  │  │  /detect-    │  │ /mgnrega  │  │  │
│  │  │              │  │   district   │  │           │  │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │           Business Logic Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │  │  Geolocation │  │   Caching    │  │   Rate    │  │  │
│  │  │  Calculator  │  │   Strategy   │  │  Limiting │  │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                                │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │            Data Access Layer                          │  │
│  │              Prisma ORM                               │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────┴──────────────────────────────────┐
│                    Database Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   District   │  │    Cached    │  │     User     │      │
│  │              │  │  MGNREGA     │  │   Activity   │      │
│  │              │  │     Data     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Request
    │
    ├─→ Geolocation Request
    │   └─→ /api/detect-district
    │       ├─→ Get user coordinates
    │       ├─→ Calculate nearest district (Haversine)
    │       └─→ Return district + distance
    │
    ├─→ District List Request
    │   └─→ /api/districts
    │       ├─→ Query database
    │       ├─→ Apply search filter (if any)
    │       └─→ Return districts list
    │
    └─→ MGNREGA Data Request
        └─→ /api/mgnrega
            ├─→ Check cache (24h TTL)
            │   ├─→ Cache Hit: Return cached data
            │   └─→ Cache Miss: Fetch from data.gov.in
            │       ├─→ Success: Cache + Return
            │       └─→ Fail: Return stale cache (if available)
            └─→ Log request + activity
```

### Caching Strategy

```
┌──────────────┐
│  API Request │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│  Check Cache    │
│  (24 hour TTL)  │
└────┬────────┬───┘
     │        │
   Valid    Expired
     │        │
     ▼        ▼
┌────────┐  ┌──────────────────┐
│ Return │  │ Fetch from       │
│ Cached │  │ data.gov.in API  │
│  Data  │  └────┬─────────┬───┘
└────────┘       │         │
              Success    Fail
                 │         │
                 ▼         ▼
           ┌─────────┐  ┌──────────┐
           │  Update │  │  Return  │
           │  Cache  │  │  Stale   │
           │ Return  │  │  Cache   │
           └─────────┘  └──────────┘
```

## Database Schema

```
District
├── id (String, UUID)
├── code (String, unique)
├── name (String)
├── nameHindi (String)
├── stateCode (String)
├── stateName (String)
├── latitude (Float)
├── longitude (Float)
└── population (Int)

CachedMGNREGAData
├── id (String, UUID)
├── districtId (String, FK)
├── financialYear (String)
├── month (Int)
├── jobCardsIssued (BigInt)
├── activeWorkers (BigInt)
├── personDaysGenerated (BigInt)
├── totalExpenditure (Float)
├── cachedAt (DateTime)
├── expiresAt (DateTime)
└── isStale (Boolean)

UserActivity
├── id (String, UUID)
├── action (String)
├── districtId (String, FK)
├── ipAddress (String)
├── userAgent (String)
└── createdAt (DateTime)

APIRequestLog
├── id (String, UUID)
├── endpoint (String)
├── statusCode (Int)
├── responseTime (Int)
└── createdAt (DateTime)
```

## API Endpoints

### GET /api/districts
Returns list of all districts with optional search.

**Query Parameters:**
- `search` (optional): Filter by district name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "code": "UP001",
      "name": "Agra",
      "nameHindi": "आगरा",
      "stateCode": "UP",
      "stateName": "Uttar Pradesh"
    }
  ]
}
```

### POST /api/detect-district
Detects nearest district from coordinates.

**Request Body:**
```json
{
  "latitude": 26.8467,
  "longitude": 80.9462
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "district": { /* District object */ },
    "distance": 5.2
  }
}
```

### GET /api/mgnrega
Returns MGNREGA data for a district.

**Query Parameters:**
- `districtId`: District UUID (required)
- `financialYear`: Format YYYY-YY (optional)
- `month`: 1-12 (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobCardsIssued": "50000",
    "activeWorkers": "30000",
    "personDaysGenerated": "500000",
    "totalExpenditure": 5000.00,
    "source": "cache",
    "cachedAt": "2025-11-01T10:00:00Z"
  }
}
```

## Performance

- Initial page load: < 2s
- API response time: < 200ms (cached)
- Database query time: < 50ms
- Supports 10,000+ concurrent users

## Security

- Rate limiting on all API endpoints
- Input validation using Zod
- SQL injection prevention via Prisma
- XSS protection via React
- Environment variable security
- HTTPS enforced in production

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - see LICENSE file for details

## Contact

For issues and questions, please use the GitHub issues page.
