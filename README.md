# PlacementHub — Placement Drive Management System

DriveFlow is a full-stack web application built to manage campus placement drives end-to-end. It handles everything from registering companies and posting drives, to students applying, companies scoring candidates round by round, and admins overseeing the whole process. The idea is to replace the usual mess of spreadsheets and WhatsApp forwards with something that actually works.

---

## What it does

There are four types of users — Super Admin, Admin, Company, and Student. Each sees a completely different interface and can only do what they're supposed to.

**Super Admin** registers and removes admins, and gets a bird's-eye view of the entire placement cell — total students, active drives, registered companies, and how many admins are currently active.

**Admin** does most of the heavy lifting. They register companies, create placement drives, set eligibility criteria (CGPA, branch, passing year, backlog history), and then publish drives to only the students who qualify. They can close or extend drives, view all applications per drive, and browse student profiles and resumes directly from the dashboard.

**Company** logs in and sees only their own drives. They publish interview rounds, enter scores for each candidate, leave feedback, and then shortlist students either by picking a top-K cutoff or a minimum score threshold. They can preview student resumes inline without downloading anything.

**Student** sees only the drives they're eligible for. They apply with one click, then track their status per drive — whether they're in process, cleared a round, or got selected. They can upload their resume and view it from the same dashboard.

---

## Tech stack

The frontend is React 18 with Vite, styled entirely with Tailwind CSS. Routing is handled by React Router v6. All HTTP calls go through a single Axios instance that automatically attaches the access token to every request and handles token refresh silently when a 401 comes back — the user never gets logged out mid-session because of an expired token.

The backend is Spring Boot (Java). Authentication is JWT-based with access tokens and rotating refresh tokens. Role-based access is enforced at the controller level using Spring Security's `@PreAuthorize`.

---

## Project structure

```
src/
├── api/
│   ├── axiosInstance.js      # Axios setup, auth interceptors, token refresh logic
│   └── services.js           # All API calls grouped by role (authApi, adminApi, companyApi, studentApi, superAdminApi)
├── components/
│   └── ui/
│       └── Pagination.jsx    # Shared pagination component used across all list views
├── context/
│   └── AuthContext.jsx       # Auth state, login/logout, role-based routing
├── hooks/
│   ├── useFetch.js           # Simple one-shot data fetching hook (used for counts, non-paginated data)
│   ├── usePagination.js      # Page-based fetching hook that maps to Spring's PageResponse<T>
│   └── useInfiniteScroll.js  # Legacy — kept but no longer used in main views
├── layouts/
│   └── DashboardLayout.jsx   # Sidebar + header shell shared by all dashboard pages
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminStudents.jsx       # Student list with profile viewer + resume preview
│   │   ├── AdminDrives.jsx         # Drive management — create, publish, close, set eligibility
│   │   └── AdminCompanies.jsx      # Drill-down: companies → drives → rounds → applicants
│   ├── super-admin/
│   │   ├── SuperAdminDashboard.jsx
│   │   └── SuperAdminAdmins.jsx
│   ├── company/
│   │   ├── CompanyDashboard.jsx
│   │   └── CompanyDrives.jsx       # Drive list → round management → scoring → shortlisting
│   └── student/
│       ├── StudentDashboard.jsx
│       ├── StudentDrives.jsx       # Eligible drives feed
│       ├── StudentApplications.jsx # Application tracker with round-by-round results
│       └── StudentProfile.jsx      # Profile editor + resume upload
└── utils/
    ├── constants.js   # API base URL
    └── storage.js     # Token read/write helpers (localStorage)
```

---

## Getting started

You need Node 18+ and the Spring Boot backend running locally (or pointed at your server).

```bash
# Clone and install
git clone <your-repo-url>
cd DriveFlow-main
npm install

# Point it at your backend
# Open src/utils/constants.js and set:
# export const API_BASE_URL = 'http://localhost:8080/api'

# Start the dev server
npm run dev
```

That's it. The app runs on `http://localhost:5173` by default.

For production:
```bash
npm run build
# Serve the dist/ folder from any static host or your backend's static resources
```

---

## How authentication works

Login returns two tokens — an access token (short-lived) and a refresh token (longer-lived). The access token goes in every request header. When it expires and the server returns a 401, the Axios interceptor automatically calls the refresh endpoint, swaps in the new access token, and retries the original request. The user never sees a login screen mid-session unless the refresh token itself has expired (i.e., they've been idle too long), in which case they get redirected to login and both tokens are cleared from storage.

Logout sends the refresh token to the backend to invalidate it, then clears everything locally.

---

## Pagination

Every list view that talks to a paginated backend endpoint (anything returning `PageResponse<T>`) uses the `usePagination` hook. The hook maps directly to the backend DTO:

```java
// PageResponse<T>
content, page, size, totalElements, totalPages, hasNext, hasPrevious
```

The `Pagination` component is shared across all views and shows a sliding window of 5 page buttons with prev/next arrows. Pages are 0-indexed internally (matching Spring's convention) but shown as 1-indexed to users.

---

## The admin flow for a placement drive

This is the order things need to happen for a drive to actually work:

1. Admin registers a company (`/api/auth/register/company`)
2. Admin creates a drive under that company (`/api/admin/company/addDrive`)
3. Admin sets eligibility criteria for the drive (`/api/admin/company/addDriveEligibility`) — minimum CGPA, allowed branches, passing year, backlog rules
4. Admin publishes the drive (`/api/admin/publishDrives/{driveId}`) — this is when eligible students can see it in their feed
5. Students apply from their dashboard
6. Company logs in, sees applications, and publishes round 1
7. Company enters scores for each candidate, optionally leaves feedback
8. Company shortlists by top-K or by cutoff score — this marks students as CLEARED or FAILED for that round
9. Repeat steps 6–8 for subsequent rounds
10. Admin can close the drive once hiring is done

If you try to publish a drive without setting eligibility first, it won't reach any students — so step 3 always has to come before step 4.

---

## Resume handling

Resumes are uploaded to Cloudinary as raw files. The backend proxies them through a `/viewResume` endpoint with `Content-Disposition: inline`, so the browser renders them inside an `<iframe>` instead of forcing a download. The frontend fetches the PDF as a blob via the backend proxy and creates a local blob URL for the iframe — this is necessary because Cloudinary serves raw files with attachment headers by default.

Both admins and companies can preview student resumes inline. Students can view and update their own resume from their profile page.

---

## Backend repo

The frontend expects a Spring Boot backend running at the configured base URL. The backend handles JWT issuance and validation, role enforcement, Cloudinary integration for resume storage, and all business logic. The API base path is `/api` and all routes are prefixed accordingly (`/api/admin/...`, `/api/company/...`, etc.).
https://github.com/MUGADA-ASHOK/Placement_Management_System

---

## Notes

- The `useInfiniteScroll` hook is still in the codebase but is no longer used. Everything was migrated to page-based pagination to match the `PageResponse<T>` the backend returns.
- The `useFetch` hook is still used for non-paginated calls — dashboard counts, single-record fetches, and anything that returns a flat response rather than a page.
- All modals, toasts, and drill-down navigation are handled with local component state — no external state library is needed.
