import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IssueCertificate from "./pages/IssueCertificate";
import MyCertificates from "./pages/MyCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import VerificationHistory from "./pages/VerificationHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import AllCertificates from "./pages/AllCertificates";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-navy-700 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-navy-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* University routes */}
          <Route path="issue" element={<ProtectedRoute roles={["university"]}><IssueCertificate /></ProtectedRoute>} />
          <Route path="my-certificates" element={<ProtectedRoute roles={["university"]}><MyCertificates /></ProtectedRoute>} />

          {/* User/Employer routes */}
          <Route path="verify" element={<ProtectedRoute roles={["user", "admin"]}><VerifyCertificate /></ProtectedRoute>} />
          <Route path="verification-history" element={<ProtectedRoute roles={["user", "admin"]}><VerificationHistory /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
          <Route path="admin/certificates" element={<ProtectedRoute roles={["admin"]}><AllCertificates /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
