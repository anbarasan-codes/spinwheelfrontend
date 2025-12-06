import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SpinPage from './pages/SpinPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Prizes from './pages/Prizes';
import Users from './pages/Users';

import AdminLayout from './components/admin/AdminLayout';

function App() {
  // Simple protected route check
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return <Navigate to="/admin/login" replace />;
    }
    return <AdminLayout>{children}</AdminLayout>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpinPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prizes"
          element={
            <ProtectedRoute>
              <Prizes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
