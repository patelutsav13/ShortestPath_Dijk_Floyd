import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import MapVisualizer from './pages/MapVisualizer';
import Learn from './pages/Learn';
import Compare from './pages/Compare';
import Solution from './pages/Solution';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SavedGraphs from './pages/SavedGraphs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes with Navbar/Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/visualizer" element={<Visualizer />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/solution" element={<Solution />} />
                  <Route path="/map" element={<MapVisualizer />} />
                </Routes>
                <Footer />
              </>
            }
          />

          {/* Protected Routes (No Navbar/Footer - has UserSidebar) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-graphs"
            element={
              <ProtectedRoute>
                <SavedGraphs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
