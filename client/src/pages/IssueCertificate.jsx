import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const IssueCertificate = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a certificate file");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = new FormData();
      data.append("certificate", file);

      const res = await api.post("/certificates/issue", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.certificate);
      toast.success("Certificate issued successfully!");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Issue Certificate</h1>
        <p className="text-sm text-navy-500 mt-1">
          Upload the certificate file. Its SHA-256 hash will be computed and stored on the Ethereum blockchain.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Certificate File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-navy-400 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="cert-file"
              />
              <label htmlFor="cert-file" className="cursor-pointer">
                <svg className="w-8 h-8 text-navy-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {file ? (
                  <p className="text-sm font-medium text-navy-700">{file.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-navy-600">Click to upload certificate</p>
                    <p className="text-xs text-navy-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
            <p className="text-xs text-navy-600 leading-relaxed">
              <span className="font-semibold">How it works:</span> The file is hashed in memory using SHA-256. Only the hash is stored on the blockchain — the file itself is never uploaded or stored anywhere.
            </p>
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
                Storing hash on blockchain...
              </span>
            ) : (
              "Issue Certificate"
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-green-800">Certificate Issued & Stored on Blockchain</h3>
          </div>
          <div className="text-sm text-green-700 space-y-1.5">
            <p><span className="font-medium">Certificate ID:</span> {result.certId}</p>
            <p><span className="font-medium">Tx Hash:</span> <span className="font-mono text-xs break-all">{result.txHash}</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCertificate;
