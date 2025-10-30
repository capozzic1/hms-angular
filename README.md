
# hms-angular

Hospital Management System — Angular + Angular Universal (SSR) front-end.

This repository contains a server-side-rendered Angular application using Angular Universal. The app uses Angular 20, Angular Material for UI components, and standalone components + signals where possible.

## Contents
- `src/app` — application code
	- `core/` — global services, interceptors, guards
	- `shared/` — presentational components, models, utilities
	- `features/` — feature-level components and dialogs (auth, patient-dashboard, booking dialogs, etc.)
- `src/server.ts` — Express server that serves SSR and static assets
- `dist/` — build output (generated)

## Prerequisites
- Node 16+ (Node 18/20 recommended)
- npm
- Angular CLI (if running local builds): `npm i -g @angular/cli`

## Deployment 
Deployed to AWS utilizing ECS, ALB(application load balancer), and ECR. 
## Quick start (development client)
1. Install dependencies

```powershell
npm install
```

2. Run the client dev server (fast, client-only, with sourcemaps)

```powershell
npm start
# opens http://localhost:4200 by default
```

Use this for rapid client-side development. This runs `ng serve` and supports live-reload and sourcemaps.

## SSR: Build + Serve (development)
The server-side rendered app requires building both browser and server bundles.

1. Build browser + server (development config with sourcemaps):

```powershell
ng build --configuration development
ng run hms-angular:server:development
```

2. Start the SSR server (default port 4000):

```powershell
# start without pausing
node --inspect=9229 --enable-source-maps .\dist\hms-angular\server\server.mjs
# or start without inspector
node .\dist\hms-angular\server\server.mjs
```

3. Open the app in your browser:

```
http://localhost:4000
```

Set breakpoints in `src/app/core/guards/auth.guard.ts` (or other server-run code) and load the route in the browser; VS Code will map to TypeScript if source maps are present.

## Scripts
- `npm start` — `ng serve` (client dev server)
- `npm run build` — builds the browser app (production by default)
- `npm run watch` — builds in watch mode
- `npm run test` — runs unit tests (karma)
- `npm run serve:ssr:hms-angular` — runs server from `dist` (see package.json)

## Important architecture notes
- Routes are lazy-loaded with standalone components.
- Authentication uses `AuthService` and a JWT stored in localStorage (learning/POC choice).
- `AuthGuard` decodes the JWT and compares role(s) against route `data.roles` for role-based access control.
- `AuthInterceptor` attaches the Authorization header to outgoing HTTP requests.

## Backend API expectations
This app talks to a REST backend (the front-end service files reference `http://localhost:8080` by default). The codebase uses the following endpoints and patterns:

Auth / sessions
- POST /admin/login — body: { username, password } -> returns { token | accessToken }
- POST /doctor/login — body: { email, password } -> returns { token | accessToken }
- POST /patient/login — body: { email, password } -> returns { token | accessToken }

Patients
- POST /patient — create patient (signup). Example body: { name, email, password, phone?, address? }
- GET /patient — get current patient info (frontend often supplies Authorization header with token)
- GET /patient/{id} — get appointments for patient with id (Authorization header expected)
- GET /patient/filter/{type}/null/{token} — (existing code calls) list patient appointments filtered by `type` ('past' | 'future') and token included in URL

Doctors
- GET /doctor — list all doctors
- GET /doctor/filter/{name}/null/null — filter by name (or other path variants where unused params are passed as `null`)
- GET /doctor/filter/null/{time}/null — filter by available time
- GET /doctor/filter/null/null/{specialty} — filter by specialty
- POST /doctor/save/{token} — add doctor (token attached in the path in current code)
- DELETE /doctor/delete/{doctorId}/{token} — delete doctor (token attached in path in current code)
- GET /doctor/profile — get doctor profile (some code uses Authorization header)
- PUT /doctor/{token-or-id?} — update profile (some code contains a hard-coded token in the URL; adapt to your backend's preferred auth method)

Appointments
- GET /appointments/{date}/{doctorName}/{token} — get appointments for a date and doctor (code appends token in URL)
- POST /appointments/{token} — create appointment (some calls pass token in the URL)
- PUT /appointments/{token} — update appointment

Prescriptions
- GET /prescription/{appointmentId}/{token} — get prescription for an appointment
- POST /prescription/{token} — save prescription

## Contacts / Notes
- This project is a rewrite of a Spring MVC app to Angular + SSR. Some choices (localStorage for tokens) were made for simplicity.


