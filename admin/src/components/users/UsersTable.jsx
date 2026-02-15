import { useTranslation } from "react-i18next";
import { Edit, Trash2 } from "lucide-react";

const UsersTable = ({
  users,
  canEditUser,
  canDeleteUser,
  getRoleBadge,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("users.userName")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("users.email")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("users.role")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("users.joinDate")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {users.map((u) => (
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
                    <div className="w-[36px] h-[36px] bg-linear-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white text-[13px] font-semibold">
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
              <td className="px-[16px] py-[14px]">{getRoleBadge(u.role)}</td>
              <td className="px-[16px] py-[14px] text-[13px] text-[#6B7280]">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center justify-end gap-[6px]">
                  {canEditUser(u) && (
                    <button
                      onClick={() => onEdit(u)}
                      className="p-[7px] hover:bg-[#F3F4F6] rounded-[6px]"
                    >
                      <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                    </button>
                  )}
                  {canDeleteUser(u) && (
                    <button
                      onClick={() => onDelete(u)}
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
  );
};

export default UsersTable;
