import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      setRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post("/auth/resend-verification", { email: formData.email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white flex-col justify-center px-16">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Join the Decentralized Verification Network
            </h2>
            <p className="text-navy-200 text-base leading-relaxed mb-8">
              Whether you're a university issuing certificates or an employer verifying them — CertifyChain ensures trust through blockchain technology.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Universities</p>
                  <p className="text-navy-300 text-xs">Issue & manage certificates on-chain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Employers / Verifiers</p>
                  <p className="text-navy-300 text-xs">Instantly verify any certificate's authenticity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-navy-800">CertifyChain</h1>
              <p className="text-sm text-navy-500 mt-1">Create your account</p>
            </div>

            {registered ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-navy-800 mb-2">Check your email</h2>
                <p className="text-sm text-navy-500 mb-2">
                  We've sent a verification link to
                </p>
                <p className="text-sm font-semibold text-navy-800 mb-4">{formData.email}</p>
                <p className="text-xs text-navy-400 mb-6">
                  Click the link in the email to verify your account. The link expires in 24 hours.
                </p>
                <button
                  onClick={handleResend}
                  className="text-sm text-navy-700 font-medium hover:underline"
                >
                  Didn't receive it? Resend email
                </button>
                <div className="mt-6">
                  <Link to="/login" className="text-sm text-navy-800 font-semibold hover:underline">
                    Go to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-navy-800 mb-1">Create Account</h2>
                <p className="text-sm text-navy-500 mb-6">Get started with CertifyChain</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1.5">I am a</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                    >
                      <option value="user">Employer / Verifier</option>
                      <option value="university">University / Institution</option>
                    </select>
                  </div>

                  {formData.role === "university" && (
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1.5">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                        placeholder="University of Delhi"
                      />
                    </div>
                  )}

                  {formData.role === "university" && (
                    <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>University accounts require admin approval before you can issue certificates.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-navy-800 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-700 disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <p className="text-sm text-center text-navy-500 mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-navy-800 font-semibold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
