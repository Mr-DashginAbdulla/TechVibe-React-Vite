import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";

function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("http://localhost:3000/categories"),
          fetch("http://localhost:3000/products"),
        ]);

        if (!categoriesRes.ok || !productsRes.ok)
          throw new Error("Server error");

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("messages.errorOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const getCategoryProductCount = (categoryId) => {
    return products.filter((p) => p.category === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("categoriesPage.title")} - TechVibe</title>
      </Helmet>

      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="bg-linear-to-br from-[#3B82F6] to-[#6366F1] text-white">
          <div className="max-w-[1280px] mx-auto px-[16px] py-[48px] text-center">
            <h1 className="text-[36px] md:text-[48px] font-bold mb-[16px]">
              {t("categoriesPage.title")}
            </h1>
            <p className="text-[18px] text-white/80 max-w-[600px] mx-auto">
              {t("categoriesPage.subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-[16px] py-[48px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E5E7EB]"
              >
                <div className="relative h-[200px] bg-linear-to-br from-[#F9FAFB] to-[#F3F4F6] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute top-[16px] right-[16px] px-[12px] py-[6px] bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-[13px] font-semibold text-[#111827]">
                      {getCategoryProductCount(category.id)}{" "}
                      {t("categoriesPage.products").replace("{{count}}", "")}
                    </span>
                  </div>
                </div>

                <div className="p-[20px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-semibold text-[#111827] group-hover:text-[#3B82F6] transition-colors">
                      {category.name}
                    </h3>
                    <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-full flex items-center justify-center group-hover:bg-[#3B82F6] transition-colors">
                      <ArrowRight className="w-[20px] h-[20px] text-[#374151] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
