import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch admin stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-navy-500 pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
        <p className="text-sm text-navy-500 mt-1">System overview and management</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatCard label="Total Users" value={stats.totalUsers} accent="border-l-navy-600" />
            <StatCard label="Universities" value={stats.totalUniversities} accent="border-l-blue-500" />
            <Link to="/admin/users">
              <StatCard
                label="Pending Approvals"
                value={stats.pendingUniversities}
                accent="border-l-amber-500"
                valueColor={stats.pendingUniversities > 0 ? "text-amber-600" : undefined}
                clickable
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <Link to="/admin/certificates">
              <StatCard label="Total Certificates" value={stats.totalCertificates} accent="border-l-green-500" clickable />
            </Link>
            <StatCard label="Total Verifications" value={stats.totalVerifications} accent="border-l-indigo-500" />
            <StatCard label="Revoked Certificates" value={stats.revokedCertificates} accent="border-l-red-500" valueColor="text-red-600" />
          </div>
        </>
      )}

      <h2 className="text-sm font-bold text-navy-700 uppercase tracking-wide mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          to="/admin/users"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-800">Manage Users</h3>
              <p className="text-xs text-navy-500 mt-0.5">Approve universities, manage user accounts</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-800">All Certificates</h3>
              <p className="text-xs text-navy-500 mt-0.5">View and manage all issued certificates</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, accent = "border-l-navy-600", valueColor = "text-navy-800", clickable = false }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-5 border-l-4 ${accent} ${clickable ? "hover:shadow-md hover:border-navy-300" : ""}`}>
      <p className="text-xs text-navy-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
};

export default AdminDashboard;
