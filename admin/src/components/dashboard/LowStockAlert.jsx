import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Package } from "lucide-react";

const LowStockAlert = ({ products }) => {
  const { t } = useTranslation();

  const lowStockItems = products
    .filter((p) => (p.stock || 0) < 10)
    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
    .slice(0, 6);

  if (lowStockItems.length === 0) {
    return (
      <div className="bg-card rounded-[16px] border border-border p-[20px]">
        <h2 className="text-[16px] font-semibold text-foreground mb-[16px]">
          {t("dashboard.lowStockAlerts")}
        </h2>
        <div className="flex flex-col items-center justify-center py-[32px] text-center">
          <Package className="w-[32px] h-[32px] text-green-500 mb-[8px]" />
          <p className="text-[14px] text-muted-foreground">
            {t("dashboard.allStocked")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-foreground">
              {t("dashboard.lowStockAlerts")}
            </h2>
            <p className="text-[12px] text-muted-foreground">
              {lowStockItems.length} {t("dashboard.itemsLowStock")}
            </p>
          </div>
        </div>
        <Link
          to="/products"
          className="text-[13px] font-medium text-primary hover:text-primary/80"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      <div className="space-y-[8px]">
        {lowStockItems.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-[12px] p-[10px] rounded-[10px] hover:bg-secondary transition-colors"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-[40px] h-[40px] rounded-[8px] object-cover bg-secondary"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground truncate">
                {product.name}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {product.brand}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-[8px] py-[3px] rounded-full text-[12px] font-semibold ${
                  (product.stock || 0) === 0
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {(product.stock || 0) === 0
                  ? t("products.outOfStock")
                  : `${product.stock} ${t("dashboard.left")}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
