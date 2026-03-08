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
        <UsersIcon className="w-[40px] h-[40px] text-muted-foreground mx-auto mb-[10px]" />
        <p className="text-[14px] text-muted-foreground">
          {t("users.noUsers")}
        </p>
      </div>
    );
  }

  return (
    <div className="md:hidden divide-y divide-border">
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
              <div className="w-[44px] h-[44px] bg-linear-to-br from-primary to-ring rounded-full flex items-center justify-center text-white font-semibold">
                {u.firstName?.charAt(0)}
                {u.lastName?.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[8px]">
                <p className="text-[14px] font-semibold text-foreground">
                  {u.firstName} {u.lastName}
                </p>
                {getRoleBadge(u.role)}
              </div>
              <p className="text-[13px] text-muted-foreground truncate">
                {u.email}
              </p>
              <p className="text-[12px] text-muted-foreground mt-[2px]">
                {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-[4px]">
              {canEditUser(u) && (
                <button
                  onClick={() => onEdit(u)}
                  className="p-[8px] bg-accent rounded-[8px]"
                >
                  <Edit className="w-[16px] h-[16px] text-muted-foreground" />
                </button>
              )}
              {canDeleteUser(u) && (
                <button
                  onClick={() => onDelete(u)}
                  className="p-[8px] bg-red-50 rounded-[8px]"
                >
                  <Trash2 className="w-[16px] h-[16px] text-destructive" />
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
