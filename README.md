# AEGIS STUDIO · Enterprise AI Workspace

> **Mission-Critical AI Operations Cockpit for Google Cloud Run, Cloud Firestore & Google GenAI**

![Aegis Studio Emblem](public/emblem.svg)

---

## 1. Architectural Overview

**Aegis Studio** is an ultra-refined, high-density enterprise AI workspace engineered for infrastructure architects, security operations teams, and cloud engineering organizations. It delivers zero-trust AI telemetry, automated audit extraction, and real-time database snapshotting strictly isolated per tenant.

### Core Technology Stack
- **Container Host**: Google Cloud Run (Fully Managed Serverless, Region: `asia-east1`)
- **Backend Runtime**: Node.js 20 (Express) single-container microservice listening on `process.env.PORT` (`8080`)
- **AI Intelligence**: `@google/genai` / `@google/generative-ai` (Gemini 1.5 Pro / Flash & Gemini 2.0 Flash)
- **Database & Tenant Isolation**: Google Cloud Firestore with strict user isolation (`users/{uid}/journals/{journalId}`)
- **Security & IAM**: Firebase Admin SDK token verification + Aegis AI Constitution Guardrail Engine (`#SEC-9901` to `#SEC-9905`)
- **Design System**: Precision Engineering Monochrome (Achromatic high-density layout, Inter + JetBrains Mono, Tailwind CSS)

---

## 2. Directory Structure

```
ideathon/
├── Dockerfile                  # Multi-stage production container for Cloud Run (PORT 8080)
├── .dockerignore               # Container build ignore rules
├── .env                        # Local development environment configuration
├── .env.example                # Secret template for GCP Secret Manager
├── package.json                # Dependencies and runtime scripts
├── server.js                   # Express server, Gemini engine, Guardrails, and Firestore endpoints
├── firestore.rules             # Granular database security rules for tenant isolation
├── README.md                   # System documentation & deployment handbook
└── public/
    ├── index.html              # Responsive 65% Intelligence Panel / 35% Control Plane layout
    ├── app.js                  # Client logic: live streaming, token auth, audit stream polling
    └── emblem.svg              # Official vector brand asset
```

---

## 3. Local Development Quickstart

### Prerequisites
- Node.js `>= 20.0.0`
- NPM `>= 10.0.0`

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Verify `.env` has your active credentials:
```ini
PORT=8080
NODE_ENV=development
REGION=asia-east1
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro
FIREBASE_PROJECT_ID=rudra-584b5
```

### Step 3: Start the Server
```bash
npm start
```
The workspace will be live at `http://localhost:8080`.

---

## 4. Google Cloud Run Deployment

### Option A: Direct Source-to-Cloud Run Deployment (Recommended)
```bash
# 1. Authenticate with Google Cloud
gcloud auth login

# 2. Set active GCP project
gcloud config set project rudra-584b5

# 3. Deploy directly from source
gcloud run deploy aegis-studio \
  --source . \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars REGION=asia-east1,FIREBASE_PROJECT_ID=rudra-584b5,GEMINI_MODEL=gemini-1.5-pro \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### Option B: Cloud Build & Container Registry
```bash
# 1. Build and push container to Google Container Registry / Artifact Registry
gcloud builds submit --tag gcr.io/rudra-584b5/aegis-studio:latest

# 2. Deploy the container image to Cloud Run
gcloud run deploy aegis-studio \
  --image gcr.io/rudra-584b5/aegis-studio:latest \
  --region asia-east1 \
  --platform managed \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --allow-unauthenticated
```

---

## 5. Google Cloud Secret Manager Configuration

Store sensitive credentials securely using Google Cloud Secret Manager:

```bash
# Create secret for Gemini API Key
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy="automatic"

# Grant Cloud Run runtime service account access to the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@rudra-584b5.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 6. Cloud Firestore Security Rules Deployment

Deploy the isolated security rules using the Firebase CLI:

```bash
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy Firestore rules
firebase deploy --only firestore:rules --project rudra-584b5
```

### Security Rule Summary (`firestore.rules`):
- Path Isolation: Only authenticated requests where `request.auth.uid == userId` can access `/users/{userId}/*`.
- Root Denial: All root queries and unpartitioned collections are strictly rejected by default.

---

## 7. API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/healthz` | Container health probe for Cloud Run | No |
| `GET` | `/api/config` | Public client runtime configuration | No |
| `GET` | `/api/constitution` | Active AI Constitution & Guardrail rules | No |
| `GET` | `/api/logs` | Fetches tenant-scoped Firestore audit stream | Yes (`Bearer <token>`) |
| `POST` | `/api/chat` | Executes prompt through Gemini + Constitution | Yes (`Bearer <token>`) |
| `POST` | `/api/sync` | Triggers manual Firestore index synchronization | Yes (`Bearer <token>`) |

### Example `/api/chat` Request:
```json
{
  "prompt": "Analyze Q3 infrastructure audit log for unauthorized egress anomalies across asia-east1 VPC subnets.",
  "model": "gemini-1.5-pro",
  "jsonSchemaMode": true,
  "deterministic": true,
  "sessionId": "ses_8930a_prod"
}
```

### Example Structured Response:
```json
{
  "success": true,
  "journalId": "doc_txn_4418a992bf01",
  "durationMs": 1420,
  "model": "gemini-1.5-pro",
  "tokensPerSec": 842.0,
  "data": {
    "executiveSummary": "Zero unauthorized egress vectors detected in asia-east1...",
    "telemetryGrid": [
      {
        "metric": "VPC Connector Throughput",
        "value": "94.2 MB/s",
        "threshold": "< 300 MB/s",
        "assessment": "NORMAL"
      }
    ],
    "remediationDirectives": [
      {
        "status": "VERIFIED",
        "directive": "IAM Policy binding scoped strictly to least-privilege runtime service account."
      }
    ]
  }
}
```

---

## 8. License

Apache-2.0 · Aegis Enterprise Systems
