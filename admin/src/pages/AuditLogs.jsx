import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FileText, Search, Activity, User } from "lucide-react";

import { auditLogService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import { useAuth } from "@/context/AuthContext";

const AuditLogs = () => {
  const { t } = useTranslation();
  const { isSuperAdmin } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    adminEmail: "",
    action: "",
    resource: "",
  });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.adminEmail && { adminEmail: filters.adminEmail }),
        ...(filters.action && { action: filters.action }),
        ...(filters.resource && { resource: filters.resource }),
      });

      const response = await auditLogService.getAll(queryParams.toString());
      
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs(1);
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isSuperAdmin]);

  const handlePageChange = (newPage) => {
    fetchLogs(newPage);
  };

  const getActionBadge = (action) => {
    const styles = {
      CREATE: "bg-green-100 text-green-700",
      UPDATE: "bg-blue-100 text-blue-700",
      DELETE: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-[8px] py-[2px] rounded-full text-[12px] font-medium ${styles[action] || "bg-gray-100 text-gray-700"}`}>
        {action}
      </span>
    );
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {t("common.unauthorized")}
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-bold text-foreground">
            {t("auditLogs.title")}
          </h1>
          <p className="text-[14px] text-muted-foreground mt-[4px]">
            {t("auditLogs.subtitle")}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-[14px] border border-border p-[16px] flex flex-col sm:flex-row gap-[16px]">
        <div className="flex-1 relative">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder={t("auditLogs.searchAdmin")}
            value={filters.adminEmail}
            onChange={(e) => setFilters({ ...filters, adminEmail: e.target.value })}
            className="w-full h-[40px] pl-[40px] pr-[16px] bg-background border border-border rounded-[10px] text-[14px] outline-none focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="h-[40px] px-[16px] bg-background border border-border rounded-[10px] text-[14px] outline-none focus:border-primary transition-colors"
        >
          <option value="">{t("auditLogs.allActions")}</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select
          value={filters.resource}
          onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
          className="h-[40px] px-[16px] bg-background border border-border rounded-[10px] text-[14px] outline-none focus:border-primary transition-colors"
        >
          <option value="">{t("auditLogs.allResources")}</option>
          <option value="product">Product</option>
          <option value="order">Order</option>
          <option value="user">User</option>
          <option value="category">Category</option>
          <option value="brand">Brand</option>
          <option value="promoCode">Promo Code</option>
          <option value="review">Review</option>
        </select>
      </div>

      <div className="bg-card rounded-[14px] border border-border overflow-hidden">
        {loading ? (
          <div className="p-[40px]">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t("auditLogs.noLogs")}
            description={t("auditLogs.noLogsDesc")}
          />
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-[20px] py-[16px] text-[13px] font-semibold text-muted-foreground w-[250px]">
                    {t("auditLogs.admin")}
                  </th>
                  <th className="px-[20px] py-[16px] text-[13px] font-semibold text-muted-foreground">
                    {t("auditLogs.action")}
                  </th>
                  <th className="px-[20px] py-[16px] text-[13px] font-semibold text-muted-foreground">
                    {t("auditLogs.resource")}
                  </th>
                  <th className="px-[20px] py-[16px] text-[13px] font-semibold text-muted-foreground w-[200px]">
                    {t("auditLogs.date")}
                  </th>
                  <th className="px-[20px] py-[16px] text-[13px] font-semibold text-muted-foreground">
                    {t("auditLogs.ip")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[12px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <User className="w-[18px] h-[18px]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium text-foreground truncate">
                            {log.adminEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-[20px] py-[16px]">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <div className="flex items-center gap-[6px]">
                        <Activity className="w-[14px] h-[14px] text-muted-foreground" />
                        <span className="text-[14px] text-foreground">
                          {log.resource}
                        </span>
                      </div>
                      <span className="text-[12px] text-muted-foreground block mt-[2px] truncate w-[120px]">
                         ID: {log.resourceId}
                      </span>
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-foreground block">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-[20px] py-[16px]">
                      <span className="text-[14px] text-foreground">
                        {log.ipAddress || t("common.unknown")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && logs.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            startIndex={(pagination.page - 1) * pagination.limit}
            endIndex={pagination.page * pagination.limit}
            totalItems={pagination.total}
          />
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
