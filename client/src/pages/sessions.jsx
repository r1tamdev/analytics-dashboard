import { useState, useEffect } from "react";
import api from "../api.js";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
    .get("/sessions")
    .then((res) => {
      console.log("Fetched sessions:", res.data);
      setSessions(res.data);
    })
    .catch(err => {
      console.log("sessions error:", err);
      setError(err.message + " | " + (err.config?.baseURL || "") + (err.config?.url || ""));
    });
  }, []);

  const openSession = (id) => {
    setSelected(id);
    api.get(`/sessions/${id}/events`).then((res) => setEvents(res.data));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Sessions list */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Sessions</h2>

        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Session ID</th>
                <th className="py-2">Events</th>
                <th className="py-2">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s._id}
                  onClick={() => openSession(s._id)}
                  className={`cursor-pointer border-b hover:bg-blue-50 ${
                    selected === s._id ? "bg-blue-100" : ""
                  }`}
                >
                  <td className="py-2">{s._id.slice(0, 8)}...</td>
                  <td className="py-2">{s.total_events}</td>
                  <td className="py-2">
                    {new Date(s.last_event).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User journey */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">User Journey</h2>

        {!selected ? (
          <p className="text-gray-500">Click a session to see its events.</p>
        ) : (
          <ol className="space-y-2">
            {events.map((e, index) => (
              <li key={e._id} className="rounded border p-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {index + 1}.{" "}
                    {e.type === "page_view" ? "Page view" : "Click"}
                  </span>
                  <span className="text-gray-500">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="break-all text-gray-600">{e.url}</div>
                {e.type === "click" && (
                  <div className="text-gray-500">
                    x: {e.x}, y: {e.y}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Sessions;