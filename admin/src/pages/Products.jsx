import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { productService, categoryService } from "@/services/api";

const ITEMS_PER_PAGE = 10;

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.delete(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success(t("products.deleteSuccess"));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(t("products.deleteError"));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages)
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
            {t("products.title")}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6B7280] mt-[2px]">
            {filteredProducts.length} {t("products.totalProducts")}
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-[8px] px-[16px] sm:px-[20px] py-[10px] sm:py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-semibold rounded-[12px] transition-colors"
        >
          <Plus className="w-[18px] h-[18px]" />
          {t("products.addProduct")}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder={t("products.searchProducts")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
        >
          <option value="">{t("common.all")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("products.productName")}
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("products.category")}
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("products.price")}
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("products.stock")}
                </th>
                <th className="text-left px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("products.rating")}
                </th>
                <th className="text-right px-[16px] py-[12px] text-[12px] font-semibold text-[#6B7280] uppercase">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <img
                        src={product.image}
                        alt=""
                        className="w-[40px] h-[40px] rounded-[8px] object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[#111827] truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="text-[12px] text-[#6B7280]">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span className="px-[8px] py-[3px] bg-[#F3F4F6] rounded-full text-[12px] text-[#374151]">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] font-semibold text-[#111827]">
                    ${product.price}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <span
                      className={`text-[14px] font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center gap-[3px]">
                      <Star className="w-[14px] h-[14px] text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-[13px] text-[#374151]">
                        {product.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <div className="flex items-center justify-end gap-[6px]">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="p-[7px] hover:bg-[#F3F4F6] rounded-[6px]"
                      >
                        <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                      </Link>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-[7px] hover:bg-red-50 rounded-[6px]"
                      >
                        <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="p-[14px]">
                <div className="flex gap-[12px]">
                  <img
                    src={product.image}
                    alt=""
                    className="w-[60px] h-[60px] rounded-[10px] object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#111827] line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-[12px] text-[#6B7280]">
                      {product.brand}
                    </p>
                    <div className="flex items-center gap-[12px] mt-[6px]">
                      <span className="text-[14px] font-bold text-[#111827]">
                        ${product.price}
                      </span>
                      <span
                        className={`text-[12px] ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {t("products.stock")}: {product.stock}
                      </span>
                      <div className="flex items-center gap-[2px]">
                        <Star className="w-[12px] h-[12px] text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-[12px] text-[#374151]">
                          {product.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="p-[8px] bg-[#F3F4F6] rounded-[8px]"
                    >
                      <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                    </Link>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setShowDeleteModal(true);
                      }}
                      className="p-[8px] bg-red-50 rounded-[8px]"
                    >
                      <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-[40px] text-center">
              <Package className="w-[40px] h-[40px] text-[#D1D5DB] mx-auto mb-[10px]" />
              <p className="text-[14px] text-[#6B7280]">
                {t("products.noProducts")}
              </p>
            </div>
          )}
        </div>

        {currentProducts.length === 0 && (
          <div className="hidden md:block p-[50px] text-center">
            <Package className="w-[44px] h-[44px] text-[#D1D5DB] mx-auto mb-[10px]" />
            <p className="text-[15px] text-[#6B7280]">
              {t("products.noProducts")}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-[12px] px-[14px] sm:px-[16px] py-[12px] border-t border-[#E5E7EB] bg-[#FAFAFA]">
            <p className="text-[12px] text-[#6B7280]">
              {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} /{" "}
              {filteredProducts.length}
            </p>
            <div className="flex items-center gap-[3px]">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <div className="flex items-center gap-[3px] mx-[6px]">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-[32px] h-[32px] rounded-[6px] text-[13px] font-medium ${currentPage === page ? "bg-[#3B82F6] text-white" : "text-[#374151] hover:bg-[#E5E7EB]"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-[16px] h-[16px] text-[#374151]" />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-[6px] rounded-[6px] hover:bg-[#E5E7EB] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-[16px] h-[16px] text-[#374151]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[16px] p-[20px] w-full max-w-[360px]">
            <h3 className="text-[17px] font-bold text-[#111827] mb-[10px]">
              {t("products.deleteProduct")}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-[20px]">
              {t("products.deleteConfirm")}
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-[16px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px] hover:bg-[#F3F4F6]"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-[16px] py-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium rounded-[10px]"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
