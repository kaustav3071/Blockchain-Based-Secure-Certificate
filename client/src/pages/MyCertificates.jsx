import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates");
      setCertificates(res.data);
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (certId) => {
    if (!window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      return;
    }

    try {
      await api.put(`/certificates/revoke/${certId}`);
      toast.success("Certificate revoked");
      fetchCertificates();
    } catch (error) {
      toast.error("Failed to revoke certificate");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-navy-500 pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading certificates...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Certificates</h1>
          <p className="text-sm text-navy-500 mt-1">
            Certificates issued by your institution
          </p>
        </div>
        <span className="text-sm bg-navy-100 text-navy-700 px-3 py-1.5 rounded-full font-medium">
          {certificates.length} total
        </span>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <svg className="w-12 h-12 text-navy-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-navy-500">No certificates issued yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Cert ID</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">SHA-256 Hash</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-mono text-xs text-navy-600">{cert.certId}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-navy-500 max-w-[180px] truncate" title={cert.sha256Hash}>{cert.sha256Hash?.slice(0, 16)}...</td>
                  <td className="px-5 py-3.5 text-navy-500">
                    {new Date(cert.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    {cert.revoked ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">Revoked</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {!cert.revoked && (
                      <button onClick={() => handleRevoke(cert.certId)} className="text-xs text-red-600 hover:text-red-800 font-medium">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
