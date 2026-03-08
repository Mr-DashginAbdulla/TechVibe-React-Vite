import { Edit, Trash2, FolderTree, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const CategoryList = ({ parentCategories, getChildren, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (parentCategories.length === 0) {
    return (
      <div className="p-[60px] text-center">
        <FolderTree className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[12px]" />
        <p className="text-[16px] font-medium text-muted-foreground">
          {t("categories.noCategories")}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {parentCategories.map((parent) => {
        const children = getChildren(parent.id);
        return (
          <div key={parent.id}>
            <div className="flex items-center justify-between p-[20px] hover:bg-secondary">
              <div className="flex items-center gap-[16px]">
                <div className="w-[48px] h-[48px] bg-linear-to-br from-primary to-ring rounded-[12px] flex items-center justify-center">
                  <FolderTree className="w-[24px] h-[24px] text-white" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-foreground">
                    {parent.name}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {children.length} {t("categories.subcategories")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => onEdit(parent)}
                  className="p-[10px] hover:bg-accent rounded-[10px]"
                >
                  <Edit className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
                <button
                  onClick={() => onDelete(parent)}
                  className="p-[10px] hover:bg-red-50 rounded-[10px]"
                >
                  <Trash2 className="w-[18px] h-[18px] text-destructive" />
                </button>
              </div>
            </div>

            {children.length > 0 && (
              <div className="bg-secondary border-t border-border">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between px-[14px] py-[14px] pl-[36px] sm:px-[20px] sm:py-[16px] sm:pl-[64px] hover:bg-accent"
                  >
                    <div className="flex items-center gap-[12px]">
                      <ChevronRight className="w-[16px] h-[16px] text-muted-foreground" />
                      {child.image && (
                        <img
                          src={child.image}
                          alt=""
                          className="w-[36px] h-[36px] rounded-[8px] object-cover"
                        />
                      )}
                      <span className="text-[14px] font-medium text-foreground">
                        {child.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => onEdit(child)}
                        className="p-[8px] hover:bg-card rounded-[8px]"
                      >
                        <Edit className="w-[16px] h-[16px] text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onDelete(child)}
                        className="p-[8px] hover:bg-red-50 rounded-[8px]"
                      >
                        <Trash2 className="w-[16px] h-[16px] text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
