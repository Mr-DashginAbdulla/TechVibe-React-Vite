import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { orderService } from "@/services/api";

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (error) {
      toast.error("Sifarişləri yükləmək mümkün olmadı");
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { value: "", label: "Hamısı" },
    { value: "pending", label: "Gözləyir" },
    { value: "processing", label: "İşlənir" },
    { value: "shipped", label: "Göndərildi" },
    { value: "delivered", label: "Çatdırıldı" },
    { value: "cancelled", label: "Ləğv" },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const labels = {
      pending: "Gözləyir",
      processing: "İşlənir",
      shipped: "Göndərildi",
      delivered: "Çatdırıldı",
      cancelled: "Ləğv",
    };
    return (
      <span
        className={`px-[10px] py-[4px] rounded-full text-[11px] font-medium ${styles[status] || styles.pending}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toString().includes(searchQuery);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      {/* Header */}
      <div>
        <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
          Sifarişlər
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-[2px]">
          {filteredOrders.length} sifariş tapıldı
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-[10px]">
        <div className="relative">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Sifariş nömrəsi ilə axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
          />
        </div>
        <div className="flex gap-[6px] overflow-x-auto pb-[4px] -mx-[16px] px-[16px] sm:mx-0 sm:px-0">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-[12px] py-[8px] rounded-[8px] text-[13px] font-medium whitespace-nowrap transition-colors ${statusFilter === s.value ? "bg-[#3B82F6] text-white" : "bg-white border border-[#E5E7EB] text-[#374151]"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Sifariş
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Tarix
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Müştəri
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Məhsullar
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Cəm
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Status
                </th>
                <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  Əməliyyat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-[16px] py-[14px] text-[14px] font-semibold text-[#3B82F6]">
                    #{order.orderNumber || order.id}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <p className="text-[14px] text-[#374151]">
                      {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {new Date(order.createdAt).toLocaleTimeString("az-AZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <p className="text-[14px] text-[#111827]">
                      {order.shippingAddress?.firstName}{" "}
                      {order.shippingAddress?.lastName}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {order.shippingAddress?.city}
                    </p>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center gap-[6px]">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt=""
                            className="w-[28px] h-[28px] rounded-[5px] border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                      {order.items?.length > 3 && (
                        <span className="text-[11px] text-[#6B7280]">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] font-semibold text-[#111827]">
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-[16px] py-[14px] text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-[5px] px-[12px] py-[7px] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-[12px] font-medium rounded-[7px]"
                    >
                      <Eye className="w-[14px] h-[14px]" />
                      Bax
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.id} className="p-[14px]">
                <div className="flex items-start justify-between mb-[10px]">
                  <div>
                    <p className="text-[14px] font-semibold text-[#3B82F6]">
                      #{order.orderNumber || order.id}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {new Date(order.createdAt).toLocaleDateString("az-AZ")}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#374151]">
                      {order.shippingAddress?.firstName}{" "}
                      {order.shippingAddress?.lastName}
                    </p>
                    <p className="text-[15px] font-bold text-[#111827] mt-[4px]">
                      ${order.total?.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-[5px] px-[14px] py-[8px] bg-[#3B82F6] text-white text-[13px] font-medium rounded-[8px]"
                  >
                    <Eye className="w-[15px] h-[15px]" />
                    Bax
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-[40px] text-center">
              <ShoppingCart className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
              <p className="text-[14px] text-[#6B7280]">Sifariş tapılmadı</p>
            </div>
          )}
        </div>

        {/* Empty desktop */}
        {currentOrders.length === 0 && (
          <div className="hidden md:block p-[50px] text-center">
            <ShoppingCart className="w-[44px] h-[44px] text-[#D1D5DB] mx-auto mb-[10px]" />
            <p className="text-[15px] text-[#6B7280]">Sifariş tapılmadı</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[12px] px-[14px] py-[12px] border-t border-[#E5E7EB] bg-[#FAFAFA]">
            <p className="text-[12px] text-[#6B7280]">
              {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} /{" "}
              {filteredOrders.length}
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
              <div className="flex items-center gap-[3px] mx-[6px]">
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
    </div>
  );
};

export default Orders;
