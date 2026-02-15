import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { orderService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import OrdersTable from "@/components/orders/OrdersTable";
import OrdersMobileList from "@/components/orders/OrdersMobileList";
import OrdersFilters from "@/components/orders/OrdersFilters";

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      pending: t("orders.pending"),
      processing: t("orders.processing"),
      shipped: t("orders.shipped"),
      delivered: t("orders.delivered"),
      cancelled: t("orders.cancelled"),
    };
    return (
      <span
        className={`px-[8px] py-[3px] rounded-full text-[11px] font-medium ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || order.id)
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (!statusFilter || order.status === statusFilter);
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[20px]">
      <div>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
          {t("orders.title")}
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-[2px]">
          {filteredOrders.length} {t("orders.totalOrders")}
        </p>
      </div>

      <OrdersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        <OrdersTable orders={currentOrders} getStatusBadge={getStatusBadge} />
        <OrdersMobileList
          orders={currentOrders}
          getStatusBadge={getStatusBadge}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredOrders.length}
        />
      </div>
    </div>
  );
};

export default Orders;
