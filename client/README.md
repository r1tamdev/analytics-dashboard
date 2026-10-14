# Analytics Dashboard: Client

React dashboard for the User Analytics app. It shows sessions, each session's user journey, and a click heatmap.

For full project setup, API details and trade-offs, see the [main README](../README.md).

## Tech Stack

- React (Vite)
- React Router
- Axios
- Tailwind CSS

## Setup

```bash
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The server must be running at the URL in `VITE_API_URL`.

## Pages

| Route | Page | What it shows |
|---|---|---|
| `/` | Sessions | All sessions with event counts. Click one to see its events in order. |
| `/heatmap` | Heatmap | Pick a page URL to see click positions as dots. |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

## Notes

- `src/api.js` holds the Axios instance. It reads the server address from `VITE_API_URL` and adds the `/api` prefix.
- `index.html` includes the tracking script, so the dashboard tracks its own pages. Change the script URL there when you deploy the server.
