import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const VerifyCertificate = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [universityFound, setUniversityFound] = useState(null);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showAuthenticModal, setShowAuthenticModal] = useState(false);
  const navigate = useNavigate();

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
      if (res.data.result === "not_found") {
        setShowNotFoundModal(true);
      } else if (res.data.result === "authentic") {
        setShowAuthenticModal(true);
      }
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
          bg: "bg-red-50", border: "border-red-300", text: "text-red-800",
          label: "NOT VERIFIED", labelBg: "bg-red-100",
          icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
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
          {/* University Search */}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              Search University / Institution
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
              <div className="relative">
                <div className="relative">
                  <svg className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery(val);
                      setFile(null);
                      if (!val.trim()) {
                        setUniversityFound(null);
                        setSelectedUniversity("");
                        return;
                      }
                      const match = universities.find(
                        (uni) => (uni.organization || uni.name).toLowerCase() === val.trim().toLowerCase()
                      );
                      if (match) {
                        setUniversityFound(true);
                        setSelectedUniversity(match.organization || match.name);
                      } else {
                        setUniversityFound(false);
                        setSelectedUniversity("");
                      }
                    }}
                    placeholder="Type university name to check..."
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                  />
                </div>

                {/* Suggestions dropdown */}
                {searchQuery.trim() && universityFound !== true && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {universities
                      .filter((uni) =>
                        (uni.organization || uni.name).toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((uni) => (
                        <button
                          key={uni._id}
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-navy-700 hover:bg-navy-50 transition-colors"
                          onClick={() => {
                            const name = uni.organization || uni.name;
                            setSearchQuery(name);
                            setSelectedUniversity(name);
                            setUniversityFound(true);
                          }}
                        >
                          {uni.organization || uni.name}
                        </button>
                      ))}
                    {universities.filter((uni) =>
                      (uni.organization || uni.name).toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-400">No matching institutions</div>
                    )}
                  </div>
                )}

                {/* Status indicator */}
                {universityFound === true && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Registered Institution
                    </span>
                    <span className="text-xs text-navy-500">You can proceed with verification</span>
                  </div>
                )}
                {universityFound === false && searchQuery.trim() && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Not Recognized
                    </span>
                    <span className="text-xs text-red-500">This institution is not in our registry</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Certificate File — only visible after a registered university is selected */}
          {universityFound === true && (
            <>
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
                disabled={loading || !file}
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
            </>
          )}
        </form>
      </div>

      {/* Inline result for tampered/revoked */}
      {result && result.result !== "not_found" && result.result !== "authentic" && (
        <div className={`mt-6 ${style.bg} border ${style.border} rounded-lg p-6 shadow-sm`}>
          <div className="flex items-center gap-3 mb-4">
            {style.icon}
            <span className={`text-sm font-bold ${style.text} ${style.labelBg} px-3 py-1 rounded-full`}>
              {style.label}
            </span>
          </div>
          <p className={`text-sm ${style.text} mb-5`}>{result.details?.message}</p>
        </div>
      )}

      {/* AUTHENTIC - Verified Modal */}
      {showAuthenticModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 px-6 py-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">Certificate Verified</h2>
              <p className="text-navy-300 text-sm mt-1">This certificate is authentic and valid</p>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Verified Badge */}
              <div className="flex items-center justify-center mb-5">
                <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  This certificate has been <strong>successfully verified</strong>. It is registered and issued by a <strong>recognized institution</strong>.
                </p>
              </div>

              {/* Certificate Details */}
              {result.details?.certId && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Certificate Details</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Certificate ID</span>
                      <span className="font-medium">{result.details.certId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Issuer Address</span>
                      <span className="font-mono text-xs break-all">{result.details.issuerAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timestamp</span>
                      <span className="font-medium">{new Date(result.details.blockchainTimestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification checks */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Record found and matched in the registry</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Authenticity confirmed — no tampering detected</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Issued by a recognized institution</span>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  setShowAuthenticModal(false);
                  setResult(null);
                  setFile(null);
                }}
                className="w-full bg-navy-800 hover:bg-navy-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Verify Another Certificate
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-navy-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOT VERIFIED Modal */}
      {showNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 px-6 py-5 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">Certificate Not Verified</h2>
              <p className="text-navy-300 text-sm mt-1">No records found in the registry</p>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Flag Badge */}
              <div className="flex items-center justify-center mb-5">
                <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
                  </svg>
                  Flagged
                </span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  This certificate <strong>could not be verified</strong>. It may be <strong>unregistered</strong>, <strong>invalid</strong>, or from an <strong>unrecognized institution</strong>.
                </p>
              </div>

              {/* Warning details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span>No matching record found in the system</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span>Authenticity could not be confirmed</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                    </svg>
                  </div>
                  <span>Exercise caution before accepting this certificate</span>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  setShowNotFoundModal(false);
                  setResult(null);
                  setFile(null);
                }}
                className="w-full bg-navy-800 hover:bg-navy-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Try Another Certificate
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-navy-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Go Back
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                If you believe this is an error, contact the issuing institution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
