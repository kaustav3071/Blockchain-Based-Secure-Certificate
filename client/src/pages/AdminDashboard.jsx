import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          <h2 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              accent="border-l-navy-600"
              onClick={() => navigate("/admin/users")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
            />
            <StatCard
              label="Universities"
              value={stats.totalUniversities}
              accent="border-l-blue-500"
              onClick={() => navigate("/admin/users")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />
            <StatCard
              label="Pending Approvals"
              value={stats.pendingUniversities}
              accent="border-l-amber-500"
              valueColor={stats.pendingUniversities > 0 ? "text-amber-600" : undefined}
              onClick={() => navigate("/admin/users")}
              badge={stats.pendingUniversities > 0 ? "Action needed" : null}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          <h2 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              label="Total Certificates"
              value={stats.totalCertificates}
              accent="border-l-green-500"
              onClick={() => navigate("/admin/certificates")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Total Verifications"
              value={stats.totalVerifications}
              accent="border-l-indigo-500"
              onClick={() => navigate("/verification-history")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
            />
            <StatCard
              label="Revoked"
              value={stats.revokedCertificates}
              accent="border-l-red-500"
              valueColor="text-red-600"
              onClick={() => navigate("/admin/certificates")}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
            />
          </div>
        </>
      )}

      <h2 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/users"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition-colors">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-navy-800">Manage Users</h3>
              <p className="text-xs text-navy-500 mt-0.5">Approve universities, manage user accounts</p>
            </div>
            <svg className="w-4 h-4 text-navy-300 group-hover:text-navy-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition-colors">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-navy-800">All Certificates</h3>
              <p className="text-xs text-navy-500 mt-0.5">View and manage all issued certificates</p>
            </div>
            <svg className="w-4 h-4 text-navy-300 group-hover:text-navy-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link
          to="/verify"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition-colors">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-navy-800">Verify Certificate</h3>
              <p className="text-xs text-navy-500 mt-0.5">Check certificate authenticity</p>
            </div>
            <svg className="w-4 h-4 text-navy-300 group-hover:text-navy-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        <Link
          to="/verification-history"
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:border-navy-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-navy-200 transition-colors">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-navy-800">Verification History</h3>
              <p className="text-xs text-navy-500 mt-0.5">View past verification records</p>
            </div>
            <svg className="w-4 h-4 text-navy-300 group-hover:text-navy-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, accent = "border-l-navy-600", valueColor = "text-navy-800", onClick, icon, badge }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-5 border-l-4 ${accent} ${onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-navy-500 uppercase tracking-wide font-semibold">{label}</p>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{badge}</span>
          )}
          <div className="text-navy-400">{icon}</div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        {onClick && (
          <svg className="w-4 h-4 text-navy-300 group-hover:text-navy-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
