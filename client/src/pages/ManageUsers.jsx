import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/university/${id}`, { status });
      toast.success(`University ${status}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "pending") return u.role === "university" && u.status === "pending";
    return u.role === filter;
  });

  const pendingCount = users.filter(u => u.role === "university" && u.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-navy-500 pt-8">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Manage Users</h1>
          <p className="text-sm text-navy-500 mt-1">{users.length} total users</p>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "pending", "university", "user"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-lg border font-medium ${
              filter === f
                ? "bg-navy-800 text-white border-navy-800"
                : "bg-white text-navy-600 border-gray-200 hover:border-navy-300 shadow-sm"
            }`}
          >
            {f === "all" && "All"}
            {f === "pending" && "Pending Approval"}
            {f === "university" && "Universities"}
            {f === "user" && "Users"}
          </button>
        ))}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <svg className="w-12 h-12 text-navy-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <p className="text-sm text-navy-500">No users found for this filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Organization</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3.5 text-navy-600 font-semibold text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-navy-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-navy-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-navy-100 text-navy-700 px-2.5 py-1 rounded-full capitalize font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-navy-600">{u.organization || "-"}</td>
                  <td className="px-5 py-3.5">
                    {u.status === "pending" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Pending</span>
                    )}
                    {u.status === "approved" && (
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Approved</span>
                    )}
                    {u.status === "rejected" && (
                      <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">Rejected</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-navy-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {u.role === "university" && u.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(u._id, "approved")}
                            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(u._id, "rejected")}
                            className="text-xs bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
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

export default ManageUsers;
