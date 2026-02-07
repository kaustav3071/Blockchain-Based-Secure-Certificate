import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      if (user.role === "university" || user.role === "admin") {
        const endpoint = user.role === "admin" ? "/admin/stats" : "/certificates/stats";
        const res = await api.get(endpoint);
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-sm text-navy-500 mt-1">
          Welcome back, <span className="font-medium text-navy-700">{user?.name}</span>
          {user?.role === "university" && user?.status === "pending" && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
              Pending Approval
            </span>
          )}
        </p>
      </div>

      {/* University Dashboard */}
      {user?.role === "university" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Certificates"
            value={stats.total}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            accent="border-l-navy-600"
            onClick={() => navigate("/my-certificates")}
          />
          <StatCard
            label="Issued Today"
            value={stats.today}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            accent="border-l-green-500"
            onClick={() => navigate("/my-certificates")}
          />
          <StatCard
            label="Revoked"
            value={stats.revoked}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            }
            accent="border-l-red-500"
            valueColor="text-red-600"
            onClick={() => navigate("/my-certificates")}
          />
        </div>
      )}

      {/* Admin Dashboard Summary */}
      {user?.role === "admin" && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers} accent="border-l-navy-600" onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>} />
          <StatCard label="Universities" value={stats.totalUniversities} accent="border-l-blue-500" onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
          <StatCard label="Pending Approvals" value={stats.pendingUniversities} accent="border-l-amber-500" valueColor={stats.pendingUniversities > 0 ? "text-amber-600" : undefined} onClick={() => navigate("/admin/users")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard label="Total Certificates" value={stats.totalCertificates} accent="border-l-green-500" onClick={() => navigate("/admin/certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <StatCard label="Total Verifications" value={stats.totalVerifications} accent="border-l-indigo-500" onClick={() => navigate("/verification-history")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
          <StatCard label="Revoked" value={stats.revokedCertificates} accent="border-l-red-500" valueColor="text-red-600" onClick={() => navigate("/admin/certificates")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
        </div>
      )}

      {/* User/Employer Dashboard */}
      {user?.role === "user" && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-800 mb-2">How Verification Works</h2>
              <p className="text-sm text-navy-500 mb-4">
                Upload any certificate file and our system will compute its hash and verify it directly against the Ethereum blockchain.
              </p>
              <div className="space-y-2.5">
                <Step number="1" text='Go to "Verify Certificate" in the sidebar' />
                <Step number="2" text="Upload the certificate file (PDF or Image)" />
                <Step number="3" text="The system hashes the file and queries the blockchain" />
                <Step number="4" text="System confirms: Authentic, Unauthorized, or Revoked" />
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === "university" && user?.status === "pending" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 max-w-2xl">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="font-medium">Account Pending Approval</p>
            <p className="text-amber-700 mt-0.5">Your university account is awaiting admin approval. You'll be able to issue certificates once approved.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Step = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <span className="w-6 h-6 bg-navy-800 text-white rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
      {number}
    </span>
    <span className="text-sm text-navy-600">{text}</span>
  </div>
);

const StatCard = ({ label, value, icon, accent = "border-l-navy-600", valueColor = "text-navy-800", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-5 border-l-4 ${accent} ${onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-navy-500 uppercase tracking-wide font-semibold">{label}</p>
        <div className="text-navy-400">{icon}</div>
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

export default Dashboard;
