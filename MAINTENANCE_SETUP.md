# Maintenance Screen Setup Guide

## Overview
This maintenance system provides a scheduled maintenance page with countdown timer, admin dashboard to control maintenance mode, and automatic redirect during maintenance windows.

## Components

### 1. Database
- **Table**: `maintenance_status`
- Stores active maintenance status, timings, and messaging
- Uses Supabase with Row Level Security (RLS)

### 2. Public Maintenance Page (`/maintenance`)
- Displays when maintenance is active
- Shows countdown timer to estimated end time
- Professional UI with status messaging
- Auto-refreshes to check status

### 3. Admin Dashboard (`/admin/maintenance`)
- Toggle maintenance mode on/off
- Set start and end times
- Configure custom messaging
- View current status

### 4. API Endpoints (`/api/maintenance`)
- `GET` - Fetch current maintenance status
- `PUT` - Update maintenance status (admin only)

### 5. Middleware
- Automatically redirects to maintenance page when active
- Excludes maintenance page and API routes from redirect
- Caches status check for performance

## Setup Instructions

### Step 1: Set Environment Variables
Add to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Step 2: Run Database Migration
Execute `scripts/create-maintenance-table.sql` in Supabase:
1. Go to Supabase Dashboard > SQL Editor
2. Create new query
3. Paste the SQL migration script
4. Execute

### Step 3: GitHub Secrets Configuration
Add to GitHub Actions secrets:
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your project ID
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase key

### Step 4: Access Admin Dashboard
- Navigate to `/admin/maintenance`
- Toggle maintenance mode
- Set maintenance window
- Add custom messages

## CI/CD Pipeline

### GitHub Actions Workflow
**File**: `.github/workflows/ci-cd.yml`

**Stages**:
1. **Build & Test**
   - Checkout code
   - Install dependencies
   - Run linting
   - Build application
   - Runs on every push and PR

2. **Deploy**
   - Only runs on push to `main` branch
   - Uses Vercel CLI for deployment
   - Automatically handles environment variables

### Deployment Flow
```
Push to main → Run tests & build → Deploy to Vercel (if successful)
```

## Usage

### Activate Maintenance Mode
1. Go to `/admin/maintenance`
2. Check "Activate Maintenance Mode"
3. Set start and end times
4. Add custom title and message
5. Click "Save Changes"

### Users see:
- Redirect to `/maintenance` page
- Countdown timer to estimated completion
- Custom maintenance message
- Professional branded page

### Deactivate
- Uncheck "Activate Maintenance Mode"
- Click "Save Changes"
- Users are immediately redirected to normal site

## Architecture

```
Request Flow:
├── User visits /any-page
├── Middleware checks maintenance status
├── If active → Redirect to /maintenance
└── If inactive → Continue to requested page

Maintenance Page:
├── Fetches status from /api/maintenance
├── Displays countdown timer
├── Auto-refreshes every 5 seconds
└── Shows custom messaging

Admin Dashboard:
├── Displays current maintenance settings
├── Form to update settings
├── Sends PUT request to /api/maintenance
└── Real-time status updates
```

## Security

- Admin endpoint should be protected with authentication (add Supabase auth middleware)
- RLS policies enforce data access controls
- Sensitive keys stored in GitHub Secrets
- Environment variables never exposed to client

## Notes

- Countdown timer uses client-side JavaScript to update
- Maintenance status cached briefly for performance
- Middleware skips external APIs to prevent blocking
- Background color uses gradient for visual appeal
