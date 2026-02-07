import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    // Prevent double-call in React StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verify = async () => {
      try {
        // Use plain axios (no auth interceptor) for this public endpoint
        const baseURL = import.meta.env.VITE_API_URL || "/api";
        const res = await axios.get(`${baseURL}/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be expired.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">Verifying your email...</h2>
              <p className="text-sm text-navy-500">Please wait while we verify your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">Email Verified!</h2>
              <p className="text-sm text-navy-500 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-navy-800 text-white py-2.5 px-8 rounded-lg text-sm font-semibold hover:bg-navy-700 shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">Verification Failed</h2>
              <p className="text-sm text-navy-500 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-block bg-navy-800 text-white py-2.5 px-8 rounded-lg text-sm font-semibold hover:bg-navy-700 shadow-sm"
              >
                Go to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
