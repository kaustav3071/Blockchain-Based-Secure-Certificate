import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const VerifyCertificate = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [loadingUniversities, setLoadingUniversities] = useState(true);

  // Fetch universities on mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/verify/universities");
        setUniversities(res.data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      } finally {
        setLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload the certificate file");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = new FormData();
      data.append("certificate", file);

      const res = await api.post("/verify", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = () => {
    if (!result) return {};
    switch (result.result) {
      case "authentic":
        return {
          bg: "bg-green-50", border: "border-green-200", text: "text-green-800",
          label: "AUTHENTIC", labelBg: "bg-green-100",
          icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        };
      case "tampered":
        return {
          bg: "bg-red-50", border: "border-red-200", text: "text-red-800",
          label: "TAMPERED", labelBg: "bg-red-100",
          icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        };
      case "revoked":
        return {
          bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800",
          label: "REVOKED", labelBg: "bg-amber-100",
          icon: <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
        };
      case "not_found":
        return {
          bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-700",
          label: "NOT FOUND", labelBg: "bg-gray-200",
          icon: <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", label: "UNKNOWN", labelBg: "bg-gray-100", icon: null };
    }
  };

  const style = getResultStyle();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Verify Certificate</h1>
        <p className="text-sm text-navy-500 mt-1">
          Upload a certificate file. Its hash will be computed and checked directly against the Ethereum blockchain.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* University Dropdown */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              Select University / Institution
            </label>
            {loadingUniversities ? (
              <div className="flex items-center gap-2 text-sm text-navy-500">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Loading universities...
              </div>
            ) : (
              <>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                >
                  <option value="">-- Select a university --</option>
                  {universities.map((uni) => (
                    <option key={uni._id} value={uni.organization || uni.name}>
                      {uni.organization || uni.name}
                    </option>
                  ))}
                </select>
                {selectedUniversity && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Registered Institution
                    </span>
                    <span className="text-xs text-navy-500">This university is registered in our system</span>
                  </div>
                )}
                {universities.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No registered universities found in the system</p>
                )}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Certificate File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-navy-400 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="verify-file"
              />
              <label htmlFor="verify-file" className="cursor-pointer">
                <svg className="w-10 h-10 text-navy-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {file ? (
                  <p className="text-sm font-medium text-navy-700">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-navy-600">Click to upload certificate for verification</p>
                    <p className="text-xs text-navy-400 mt-1">The system will hash the file and query the blockchain</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-700 disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Querying blockchain...
              </span>
            ) : (
              "Verify on Blockchain"
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className={`mt-6 ${style.bg} border ${style.border} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            {style.icon}
            <span className={`text-sm font-bold ${style.text} ${style.labelBg} px-3 py-1 rounded-full`}>
              {style.label}
            </span>
          </div>
          <p className={`text-sm ${style.text} mb-5`}>{result.details?.message}</p>

          {result.details?.studentName && (
            <div className="bg-white/60 rounded-lg p-4 border border-white">
              <p className="text-xs font-bold text-navy-500 uppercase tracking-wide mb-3">Certificate Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-navy-700">
                <div><span className="text-navy-400">Certificate ID:</span> <span className="font-medium">{result.details.certId}</span></div>
                <div><span className="text-navy-400">Student:</span> <span className="font-medium">{result.details.studentName}</span></div>
                <div><span className="text-navy-400">Course:</span> <span className="font-medium">{result.details.course}</span></div>
                <div><span className="text-navy-400">Year:</span> <span className="font-medium">{result.details.year}</span></div>
                <div><span className="text-navy-400">University:</span> <span className="font-medium">{result.details.universityName}</span></div>
                <div><span className="text-navy-400">Issued:</span> <span className="font-medium">{new Date(result.details.issuedAt).toLocaleDateString()}</span></div>
              </div>
              {result.details.issuerAddress && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-navy-400">Blockchain Issuer Address</p>
                  <p className="font-mono text-xs text-navy-600 mt-0.5 break-all">{result.details.issuerAddress}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
