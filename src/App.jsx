import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Tool from './pages/Tool';
import Documentation from './pages/Documentation';
import About from './pages/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
        
        {/* Modern Navbar */}
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AudioML</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 hover:text-blue-400 transition-colors">Home</Link>
                            <Link to="/tool" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 hover:text-blue-400 transition-colors">Tool</Link>
                            <Link to="/documentation" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 hover:text-blue-400 transition-colors">Docs</Link>
                            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 hover:text-blue-400 transition-colors">About</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow pt-16">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tool" element={<Tool />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
