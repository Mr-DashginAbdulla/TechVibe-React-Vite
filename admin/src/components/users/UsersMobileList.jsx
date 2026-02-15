import { useTranslation } from "react-i18next";
import { Edit, Trash2, Users as UsersIcon } from "lucide-react";

const UsersMobileList = ({
  users,
  canEditUser,
  canDeleteUser,
  getRoleBadge,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (users.length === 0) {
    return (
      <div className="p-[40px] text-center">
        <UsersIcon className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
        <p className="text-[14px] text-[#6B7280]">{t("users.noUsers")}</p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-[#E5E7EB]">
      {users.map((u) => (
        <div key={u.id} className="p-[14px]">
          <div className="flex items-start gap-[12px]">
            {u.avatar ? (
              <img
                src={u.avatar}
                alt=""
                className="w-[44px] h-[44px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[44px] h-[44px] bg-linear-to-br from-[#3B82F6] to-[#6366F1] rounded-full flex items-center justify-center text-white font-semibold">
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
              <p className="text-[13px] text-[#6B7280] truncate">{u.email}</p>
              <p className="text-[12px] text-[#9CA3AF] mt-[2px]">
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-[4px]">
              {canEditUser(u) && (
                <button
                  onClick={() => onEdit(u)}
                  className="p-[8px] bg-[#F3F4F6] rounded-[8px]"
                >
                  <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                </button>
              )}
              {canDeleteUser(u) && (
                <button
                  onClick={() => onDelete(u)}
                  className="p-[8px] bg-red-50 rounded-[8px]"
                >
                  <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersMobileList;
