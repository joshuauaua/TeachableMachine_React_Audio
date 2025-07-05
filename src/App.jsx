import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <nav className="bg-white shadow-md p-4 flex gap-4">
          <Link to="/" className="font-bold text-blue-600">Home</Link>
          <Link to="/documentation" className="text-blue-600">Documentation</Link>
          <Link to="/about" className="text-blue-600">About</Link>


        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
