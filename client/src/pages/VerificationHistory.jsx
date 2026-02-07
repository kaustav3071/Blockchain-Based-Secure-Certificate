import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const VerificationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/verify/history");
      setHistory(res.data);
    } catch (error) {
      toast.error("Failed to fetch verification history");
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result) => {
    const badges = {
      authentic: <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Authentic</span>,
      tampered: <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">Tampered</span>,
      revoked: <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Revoked</span>,
      not_found: <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">Unauthorized</span>,
    };
    return badges[result] || <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{result}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-navy-500 pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading history...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Verification History</h1>
          <p className="text-sm text-navy-500 mt-1">Your past certificate verification attempts</p>
        </div>
        <span className="text-sm bg-navy-100 text-navy-700 px-3 py-1.5 rounded-full font-medium">
          {history.length} total
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <svg className="w-12 h-12 text-navy-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-navy-500">No verifications performed yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">File Hash</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Result</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-mono text-xs text-navy-600 max-w-[220px] truncate" title={item.fileHash}>{item.fileHash?.slice(0, 20)}...</td>
                  <td className="px-5 py-3.5">{getResultBadge(item.result)}</td>
                  <td className="px-5 py-3.5 text-navy-500">
                    {new Date(item.createdAt).toLocaleDateString()}{" "}
                    <span className="text-navy-400">{new Date(item.createdAt).toLocaleTimeString()}</span>
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

export default VerificationHistory;
