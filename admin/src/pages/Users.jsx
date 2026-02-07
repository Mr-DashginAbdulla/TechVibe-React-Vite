import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { isSuperAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error("İstifadəçiləri yükləmək mümkün olmadı");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.update(editingUser.id, updateData);
        toast.success("İstifadəçi yeniləndi");
      } else {
        await userService.create({
          ...formData,
          id: `user-${Date.now()}`,
          isVerified: false,
          avatar: "",
          createdAt: new Date().toISOString(),
        });
        toast.success("İstifadəçi yaradıldı");
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      toast.error("Xəta baş verdi");
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(userToDelete.id);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success("İstifadəçi silindi");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Silmək mümkün olmadı");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
    });
  };

  const canEditUser = (t) => {
    if (t.role === "super-admin") return false;
    if (currentUser.id === t.id) return true;
    if (isSuperAdmin) return true;
    return t.role === "user";
  };
  const canDeleteUser = (t) => {
    if (t.role === "super-admin") return false;
    if (t.id === currentUser.id) return false;
    return isSuperAdmin;
  };

  const getRoleBadge = (role) => {
    const styles = {
      "super-admin": "bg-amber-100 text-amber-700",
      admin: "bg-blue-100 text-blue-700",
      user: "bg-gray-100 text-gray-700",
    };
    const labels = {
      "super-admin": "Super Admin",
      admin: "Admin",
      user: "İstifadəçi",
    };
    return (
      <span
        className={`px-[8px] py-[3px] rounded-full text-[11px] font-medium ${styles[role]}`}
      >
        {labels[role] || role}
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (!roleFilter || u.role === roleFilter);
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };
  const getPageNumbers = () => {
    const pages = [],
      max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
            İstifadəçilər
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-[2px]">
            {filteredUsers.length} istifadəçi
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-[8px] px-[16px] py-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-semibold rounded-[12px]"
          >
            <Plus className="w-[18px] h-[18px]" />
            Yeni
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
        >
          <option value="">Hamısı</option>
          <option value="super-admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="user">İstifadəçi</option>
        </select>
      </div>

      {/* Users */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  İstifadəçi
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Email
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Rol
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Qeydiyyat
                </th>
                <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Əməliyyat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center gap-[10px]">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-[36px] h-[36px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-[36px] h-[36px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white text-[13px] font-semibold">
                          {u.firstName?.charAt(0)}
                          {u.lastName?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-[14px] font-medium text-[#111827]">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {u.phone || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#374151]">
                    {u.email}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    {getRoleBadge(u.role)}
                  </td>
                  <td className="px-[16px] py-[14px] text-[13px] text-[#6B7280]">
                    {new Date(u.createdAt).toLocaleDateString("az-AZ")}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center justify-end gap-[6px]">
                      {canEditUser(u) && (
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-[7px] hover:bg-[#F3F4F6] rounded-[6px]"
                        >
                          <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                        </button>
                      )}
                      {canDeleteUser(u) && (
                        <button
                          onClick={() => {
                            setUserToDelete(u);
                            setShowDeleteModal(true);
                          }}
                          className="p-[7px] hover:bg-red-50 rounded-[6px]"
                        >
                          <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {currentUsers.length > 0 ? (
            currentUsers.map((u) => (
              <div key={u.id} className="p-[14px]">
                <div className="flex items-start gap-[12px]">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt=""
                      className="w-[44px] h-[44px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[44px] h-[44px] bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white font-semibold">
                      {u.firstName?.charAt(0)}
                      {u.lastName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[8px]">
                      <p className="text-[14px] font-semibold text-[#111827]">
                        {u.firstName} {u.lastName}
                      </p>
                      {getRoleBadge(u.role)}
                    </div>
                    <p className="text-[13px] text-[#6B7280] truncate">
                      {u.email}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF] mt-[2px]">
                      {new Date(u.createdAt).toLocaleDateString("az-AZ")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    {canEditUser(u) && (
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-[8px] bg-[#F3F4F6] rounded-[8px]"
                      >
                        <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                      </button>
                    )}
                    {canDeleteUser(u) && (
                      <button
                        onClick={() => {
                          setUserToDelete(u);
                          setShowDeleteModal(true);
                        }}
                        className="p-[8px] bg-red-50 rounded-[8px]"
                      >
                        <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-[40px] text-center">
              <UsersIcon className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
              <p className="text-[14px] text-[#6B7280]">İstifadəçi tapılmadı</p>
            </div>
          )}
        </div>

        {currentUsers.length === 0 && (
          <div className="hidden md:block p-[50px] text-center">
            <UsersIcon className="w-[44px] h-[44px] text-[#D1D5DB] mx-auto mb-[10px]" />
            <p className="text-[15px] text-[#6B7280]">İstifadəçi tapılmadı</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[12px] px-[14px] py-[12px] border-t border-[#E5E7EB] bg-[#FAFAFA]">
            <p className="text-[12px] text-[#6B7280]">
              {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} /{" "}
              {filteredUsers.length}
            </p>
            <div className="flex items-center gap-[3px]">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
              >
                <ChevronsLeft className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
              >
                <ChevronLeft className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <div className="flex gap-[3px] mx-[6px]">
                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-[32px] h-[32px] rounded-[6px] text-[13px] font-medium ${currentPage === p ? "bg-[#3B82F6] text-white" : "text-[#374151] hover:bg-[#E5E7EB]"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
              >
                <ChevronRight className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40"
              >
                <ChevronsRight className="w-[16px] h-[16px] text-[#374151]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-[17px] font-bold text-[#111827] mb-[16px]">
              {editingUser ? "Redaktə Et" : "Yeni İstifadəçi"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-[12px]">
              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Şifrə {editingUser && "(boş = dəyişdirmə)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingUser}
                  className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                />
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="block text-[13px] font-medium text-[#374151] mb-[6px]">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-[12px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
                  >
                    <option value="user">İstifadəçi</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <div className="flex gap-[10px] pt-[6px]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-[14px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px]"
                >
                  Ləğv
                </button>
                <button
                  type="submit"
                  className="flex-1 px-[14px] py-[10px] bg-[#3B82F6] text-white font-medium rounded-[10px]"
                >
                  {editingUser ? "Yenilə" : "Yarat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[360px]">
            <h3 className="text-[17px] font-bold text-[#111827] mb-[10px]">
              Sil
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-[20px]">
              "{userToDelete?.firstName} {userToDelete?.lastName}" silsinmi?
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-[14px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px]"
              >
                Ləğv
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-[14px] py-[10px] bg-[#EF4444] text-white font-medium rounded-[10px]"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
