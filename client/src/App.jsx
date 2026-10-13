import { Routes, Route, NavLink } from 'react-router-dom';
import Sessions from './pages/sessions.jsx';
import Heatmap from './pages/heatmap.jsx';


function App() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded bg-blue-100 px-3 py-2 text-blue-700"
      : "rounded px-3 py-2 text-gray-700 hover:bg-gray-100";

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <h1 className="text-xl font-bold">User Analytics</h1>
        <NavLink to="/" className={linkClass}>
          Sessions
        </NavLink>
        <NavLink to="/heatmap" className={linkClass}>
          Heatmap
        </NavLink>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Sessions />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
