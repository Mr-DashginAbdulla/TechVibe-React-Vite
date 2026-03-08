import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";
import { userService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import UsersTable from "@/components/users/UsersTable";
import UsersMobileList from "@/components/users/UsersMobileList";
import UserFormModal from "@/components/users/UserFormModal";

const ITEMS_PER_PAGE = 10;

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "user",
};

const Users = () => {
  const { t } = useTranslation();
  const { user: currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
      } else {
        await userService.create({
          ...formData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
      }
      const data = await userService.getAll();
      setUsers(data);
      toast.success(t("users.saveSuccess"));
      closeModal();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(userToDelete.id);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success(t("users.deleteSuccess"));
      setUserToDelete(null);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      phone: user.phone || "",
      role: user.role,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(emptyForm);
  };

  const canEditUser = (user) => isSuperAdmin || user.id === currentUser?.id;
  const canDeleteUser = (user) => isSuperAdmin && user.id !== currentUser?.id;

  const getRoleBadge = (role) => {
    const styles = {
      superAdmin: "bg-purple-100 text-purple-700",
      admin: "bg-blue-100 text-blue-700",
      user: "bg-gray-100 text-gray-700",
    };
    const labels = {
      superAdmin: t("users.superAdmin"),
      admin: t("users.admin"),
      user: t("users.customer"),
    };
    return (
      <span
        className={`px-[8px] py-[3px] rounded-full text-[11px] font-medium ${styles[role] || styles.user}`}
      >
        {labels[role] || role}
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    const search =
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return search && (!roleFilter || u.role === roleFilter);
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[20px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground">
            {t("users.title")}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-muted-foreground mt-[2px]">
            {filteredUsers.length} {t("users.totalUsers")}
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-[8px] px-[16px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] font-semibold rounded-[12px]"
          >
            <Plus className="w-[18px] h-[18px]" />
            {t("users.addUser")}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder={t("users.searchUsers")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-[14px] py-[10px] bg-card border border-border rounded-[10px] text-[14px] text-foreground"
        >
          <option value="">{t("users.allRoles")}</option>
          <option value="admin">{t("users.admin")}</option>
          <option value="user">{t("users.customer")}</option>
        </select>
      </div>

      <div className="bg-card rounded-[16px] border border-border overflow-hidden">
        <UsersTable
          users={currentUsers}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
          getRoleBadge={getRoleBadge}
          onEdit={openEditModal}
          onDelete={setUserToDelete}
        />
        <UsersMobileList
          users={currentUsers}
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
          getRoleBadge={getRoleBadge}
          onEdit={openEditModal}
          onDelete={setUserToDelete}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredUsers.length}
        />
      </div>

      {showModal && (
        <UserFormModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={closeModal}
          isEditing={!!editingUser}
          isSuperAdmin={isSuperAdmin}
        />
      )}

      {userToDelete && (
        <DeleteConfirmModal
          title={t("users.deleteUser")}
          message={t("users.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default Users;
