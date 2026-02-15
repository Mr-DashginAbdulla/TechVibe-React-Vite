import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Plus, Package } from "lucide-react";
import { toast } from "react-toastify";
import { productService, categoryService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Pagination from "@/components/common/Pagination";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import ProductsTable from "@/components/products/ProductsTable";
import ProductsMobileList from "@/components/products/ProductsMobileList";

const ITEMS_PER_PAGE = 10;

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const getCategoryName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.name || t("common.unknown");

  const handleDelete = async () => {
    try {
      await productService.delete(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success(t("products.deleteSuccess"));
      setProductToDelete(null);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesSearch &&
      (!categoryFilter || product.categoryId === categoryFilter)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) return <LoadingSpinner />;

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
          className="inline-flex items-center justify-center gap-[8px] px-[16px] py-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[14px] font-semibold rounded-[12px]"
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
            className="w-full pl-[40px] pr-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-[14px] py-[10px] bg-white border border-[#E5E7EB] rounded-[10px] text-[14px]"
        >
          <option value="">{t("products.filterByCategory")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        <ProductsTable
          products={currentProducts}
          getCategoryName={getCategoryName}
          onDelete={setProductToDelete}
        />
        <ProductsMobileList
          products={currentProducts}
          getCategoryName={getCategoryName}
          onDelete={setProductToDelete}
        />
        {currentProducts.length === 0 && (
          <div className="hidden md:block p-[50px] text-center">
            <Package className="w-[44px] h-[44px] text-[#D1D5DB] mx-auto mb-[10px]" />
            <p className="text-[15px] text-[#6B7280]">
              {t("products.noProducts")}
            </p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredProducts.length}
        />
      </div>

      {productToDelete && (
        <DeleteConfirmModal
          title={t("products.deleteProduct")}
          message={t("products.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
};

export default Products;
