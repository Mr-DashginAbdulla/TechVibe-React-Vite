import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import { productService, categoryService, brandService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import BasicInfoSection from "@/components/products/BasicInfoSection";
import ImagesSection from "@/components/products/ImagesSection";
import SpecsSection from "@/components/products/SpecsSection";
import ColorOptionsSection from "@/components/products/ColorOptionsSection";
import MemoryOptionsSection from "@/components/products/MemoryOptionsSection";

const emptyForm = {
  name: "",
  brand: "",
  categoryId: "",
  description: "",
  price: 0,
  stock: 0,
  discount: 0,
  image: "",
  images: [],
  specs: {},
  colors: [],
  memoryOptions: [],
  rating: 0,
  reviewCount: 0,
};

const ProductForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState({});
  const [colors, setColors] = useState([]);
  const [memoryOptions, setMemoryOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          categoryService.getAll(),
          brandService.getAll(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);

        if (isEditing) {
          const product = await productService.getById(id);
          if (product) {
            setFormData({
              ...emptyForm,
              ...product,
            });
            setImages(product.images || (product.image ? [product.image] : []));
            setSpecs(product.specs || {});
            setColors(product.colors || []);
            setMemoryOptions(product.memoryOptions || []);
          }
        }
      } catch {
        toast.error(t("messages.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const productData = {
        ...formData,
        image: images[0] || "",
        images,
        specs,
        colors,
        memoryOptions,
      };

      if (isEditing) {
        await productService.update(id, productData);
      } else {
        await productService.create({
          ...productData,
          id: `prod-${Date.now()}`,
        });
      }
      toast.success(t("products.saveSuccess"));
      navigate("/products");
    } catch {
      toast.error(t("products.saveError"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[20px]">
      <div className="flex items-center gap-[16px]">
        <Link
          to="/products"
          className="p-[10px] hover:bg-[#F3F4F6] rounded-[10px]"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#374151]" />
        </Link>
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#111827]">
            {isEditing ? t("products.editProduct") : t("products.addProduct")}
          </h1>
          <p className="text-[13px] text-[#6B7280] mt-[2px]">
            {isEditing ? t("products.editSubtitle") : t("products.addSubtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[16px]">
        <BasicInfoSection
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          brands={brands}
        />
        <ImagesSection images={images} setImages={setImages} />
        <SpecsSection specs={specs} setSpecs={setSpecs} />
        <ColorOptionsSection colors={colors} setColors={setColors} />
        <MemoryOptionsSection
          memoryOptions={memoryOptions}
          setMemoryOptions={setMemoryOptions}
        />

        <div className="flex justify-end gap-[12px] pt-[8px]">
          <Link
            to="/products"
            className="px-[20px] py-[10px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[10px] hover:bg-[#F3F4F6]"
          >
            {t("common.cancel")}
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-[8px] px-[24px] py-[10px] bg-[#3B82F6] text-white font-semibold rounded-[10px] hover:bg-[#2563EB] disabled:opacity-50"
          >
            <Save className="w-[18px] h-[18px]" />
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
