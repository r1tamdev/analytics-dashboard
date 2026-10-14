<h1 align="center">User Analytics Dashboard</h1>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,react,vite,tailwind,js" alt="Node.js, Express, MongoDB, React, Vite, Tailwind CSS, JavaScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

A small full-stack app that tracks user interactions on a webpage and shows them in a dashboard.

- A JavaScript **tracking script** records `page_view` and `click` events.
- A **Node.js + Express** API stores them in **MongoDB**.
- A **React** dashboard shows sessions, each session's user journey, and a click heatmap.

## Features

- Tracking script that can be added to any page with one `<script>` tag
- Events: `page_view` and `click` (with x/y coordinates)
- Every event has `session_id`, event type, page URL and timestamp
- Sessions view: all sessions with total event counts; click a session to see its ordered events (user journey)
- Heatmap view: pick a page URL and see click positions as dots

## Tech Stack

| Part | Technology |
|---|---|
| Backend | Node.js, Express, Mongoose (ES Modules) |
| Database | MongoDB (Atlas) |
| Frontend | React (Vite), React Router, Axios |
| Styling | Tailwind CSS |
| Tracker | Plain browser JavaScript |

## Project Structure

```
analytics-dashboard/
├── server/
│   ├── index.js            # Express app, MongoDB connection, serves tracker.js
│   ├── tracker.js          # Tracking script (runs in the browser)
│   ├── models/Event.js     # Mongoose schema for events
│   ├── routes/events.js    # API routes
│   ├── .env.example
│   └── package.json
└── client/
    ├── index.html          # Includes the tracker script tag
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js          # Axios instance
        └── pages/
            ├── Sessions.jsx
            └── Heatmap.jsx
```

## Setup Steps

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works)

### 1. Clone the repository

```bash
git clone https://github.com/r1tamdev/analytics-dashboard.git
cd analytics-dashboard
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `server/.env` file (see `server/.env.example`):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

For Atlas, create a database user, allow your IP under Network Access, and use a connection string that includes the database name, for example:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/analytics?retryWrites=true&w=majority
```

Start the server:

```bash
npm run dev
```

You should see `Connected to MongoDB` and `Server running on port 5000`.

### 3. Set up the client

Open a second terminal:

```bash
cd client
npm install
```

Create a `client/.env` file (see `client/.env.example`):

```
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Open `http://localhost:5173`.

### 4. Generate some data

The tracker script is already included in `client/index.html`, so the dashboard tracks itself:

```html
<script src="http://localhost:5000/tracker.js"></script>
```

Click around on the dashboard, then check the **Sessions** and **Heatmap** pages.

### Using the tracker on another page

Add this to any webpage (replace the URL with your server's address):

```html
<script src="http://localhost:5000/tracker.js"></script>
```

The script finds the API address from the URL it was loaded from, so no extra configuration is needed.

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/events` | Store an event |
| GET | `/sessions` | List sessions with event counts |
| GET | `/sessions/:id/events` | All events for a session, oldest first |
| GET | `/heatmap?url=<page url>` | Click positions for a page |
| GET | `/pages` | Distinct page URLs (for the heatmap dropdown) |

### Event format

```json
{
  "session_id": "674e270b-4679-4ef0-afa8-9c7fd607a4b2",
  "type": "click",
  "url": "http://localhost:5173/",
  "timestamp": "2026-10-13T20:21:17.918Z",
  "x": 340,
  "y": 120,
  "viewport_w": 1440,
  "viewport_h": 800
}
```

`x` and `y` are only set for click events.

## How It Works

1. `tracker.js` creates a `session_id` (UUID) and stores it in `localStorage`.
2. It sends a `page_view` on load and a `click` event on every click (using `pageX` / `pageY`), along with the current URL, time and viewport size.
3. The API saves each event as one document in the `events` collection (indexed on `session_id + timestamp` and on `url + type`).
4. Sessions are not stored separately. They are built on request by grouping events by `session_id`.
5. The heatmap scales each click by `800 / viewport_w`, so clicks from different screen sizes line up in the same box.

## Assumptions and Trade-offs

- **Sessions are derived, not stored.** Grouping events with an aggregation keeps the data model simple. For very large datasets, a separate sessions collection would be faster.
- **Session lifetime.** A session is just a UUID in `localStorage`. It never expires, and a different browser or cleared storage creates a new session.
- **Single-page app limitation.** `page_view` is sent once when the script loads, so client-side route changes in a React app do not create a new `page_view`. Clicks still record the correct URL because it is read at click time.
- **Heatmap is a simplified view.** Dots are drawn on a plain box (not on a screenshot of the page) and scaled by viewport width. Very different layouts at different screen sizes can reduce accuracy.
- **No authentication.** The ingest endpoint and dashboard are open, and CORS allows all origins. This is fine for the assignment but should be locked down in production (API key per site, restricted origins, rate limiting).
- **Basic validation only.** The server relies on the Mongoose schema (required fields and allowed event types).
- **The dashboard tracks itself.** The tracker is included in the dashboard's `index.html` so the app can be tested without a separate demo page, which means dashboard clicks also appear in the data.
- **Hardcoded tracker URL.** The script tag in `client/index.html` points to `http://localhost:5000`. Change it to your server URL when deploying.

## Possible Improvements

- Deploy the server and client, and store the live URLs here
- Use a heatmap color gradient instead of translucent dots
- Add filters (date range, page) and totals on the Sessions page
- Track scroll depth and time on page
- Batch events to reduce the number of requests

## Author

Ritam Chowdhury
