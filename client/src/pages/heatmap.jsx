import { useEffect, useState } from "react";
import api from "../api.js";

const BOX_WIDTH = 800;

function Heatmap() {
  const [pages, setPages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [clicks, setClicks] = useState([]);

  // load the list of pages
  useEffect(() => {
    api.get("/pages").then((res) => setPages(res.data));
  }, []);

  // load clicks when a page is selected
  useEffect(() => {
    if (!selectedUrl) {
      setClicks([]);
      return;
    }
    api
      .get("/heatmap", { params: { url: selectedUrl } })
      .then((res) => setClicks(res.data));
  }, [selectedUrl]);

  // scale click positions to fit our box
  const dots = clicks
    .filter((c) => c.viewport_w)
    .map((c) => {
      const scale = BOX_WIDTH / c.viewport_w;
      return { left: c.x * scale, top: c.y * scale };
    });

  const boxHeight = Math.max(400, ...dots.map((d) => d.top + 40));

  return (
    <div className="rounded bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-semibold">Click Heatmap</h2>

      <select
        value={selectedUrl}
        onChange={(e) => setSelectedUrl(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      >
        <option value="">Select a page URL</option>
        {pages.map((url) => (
          <option key={url} value={url}>
            {url}
          </option>
        ))}
      </select>

      {selectedUrl && (
        <>
          <p className="mb-2 text-sm text-gray-500">
            {clicks.length} click(s) on this page
          </p>

          <div className="overflow-x-auto">
            <div
              className="relative border bg-gray-50"
              style={{ width: BOX_WIDTH, height: boxHeight }}
            >
              {dots.map((d, i) => (
                <div
                  key={i}
                  className="absolute h-4 w-4 rounded-full bg-red-500 opacity-40"
                  style={{ left: d.left - 8, top: d.top - 8 }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Heatmap;