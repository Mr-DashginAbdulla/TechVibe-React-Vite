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
          <tr className="bg-secondary border-b border-border">
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("users.userName")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("users.email")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("users.role")}
            </th>
            <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("users.joinDate")}
            </th>
            <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-muted-foreground uppercase">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-secondary">
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center gap-[10px]">
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt=""
                      className="w-[36px] h-[36px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[36px] h-[36px] bg-linear-to-br from-primary to-ring rounded-full flex items-center justify-center text-white text-[13px] font-semibold">
                      {u.firstName?.charAt(0)}
                      {u.lastName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-[14px] font-medium text-foreground">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {u.phone || "—"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                {u.email}
              </td>
              <td className="px-[16px] py-[14px]">{getRoleBadge(u.role)}</td>
              <td className="px-[16px] py-[14px] text-[13px] text-muted-foreground">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="px-[16px] py-[14px]">
                <div className="flex items-center justify-end gap-[6px]">
                  {canEditUser(u) && (
                    <button
                      onClick={() => onEdit(u)}
                      className="p-[7px] hover:bg-accent rounded-[6px]"
                    >
                      <Edit className="w-[16px] h-[16px] text-muted-foreground" />
                    </button>
                  )}
                  {canDeleteUser(u) && (
                    <button
                      onClick={() => onDelete(u)}
                      className="p-[7px] hover:bg-red-50 rounded-[6px]"
                    >
                      <Trash2 className="w-[16px] h-[16px] text-destructive" />
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
