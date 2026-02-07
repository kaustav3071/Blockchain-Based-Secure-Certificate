import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const roleLabel = {
    admin: "Administrator",
    university: "University / Institution",
    user: "Employer / Verifier",
  };

  const statusBadge = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put("/auth/profile", profileData);
      setUser(res.data.user);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setPasswordLoading(true);
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(res.data.message);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">My Profile</h1>
        <p className="text-sm text-navy-500 mt-1">View and manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-navy-700">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-navy-800">{user?.name}</h2>
            <p className="text-sm text-navy-500 mt-0.5">{user?.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs bg-navy-100 text-navy-700 px-2.5 py-1 rounded-full font-medium">
                {roleLabel[user?.role] || user?.role}
              </span>
              {user?.role === "university" && user?.status && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[user.status]}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              )}
            </div>
            {user?.organization && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-navy-400 uppercase tracking-wide font-semibold">Organization</p>
                <p className="text-sm text-navy-700 font-medium mt-1">{user.organization}</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-navy-400 uppercase tracking-wide font-semibold">Member Since</p>
              <p className="text-sm text-navy-700 font-medium mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-navy-800 mb-1">Update Profile</h3>
            <p className="text-xs text-navy-400 mb-5">Change your display name and organization details</p>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-navy-400 cursor-not-allowed"
                />
                <p className="text-xs text-navy-400 mt-1">Email cannot be changed</p>
              </div>

              {user?.role === "university" && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Organization Name</label>
                  <input
                    type="text"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Role</label>
                <input
                  type="text"
                  value={roleLabel[user?.role] || user?.role}
                  disabled
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-navy-400 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="bg-navy-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-700 disabled:opacity-50 shadow-sm"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-navy-800 mb-1">Change Password</h3>
            <p className="text-xs text-navy-400 mb-5">Ensure your account stays secure by updating your password</p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 shadow-sm"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
