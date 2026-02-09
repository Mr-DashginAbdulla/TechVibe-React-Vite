import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Upload, X, Plus, Trash2, Image, Link } from "lucide-react";
import { toast } from "react-toastify";
import { productService, categoryService } from "@/services/api";

const ProductForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState("url");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
    images: [],
    isFeatured: false,
    isNew: false,
    specs: {},
    colorOptions: [],
    memoryOptions: [],
  });

  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newMemory, setNewMemory] = useState({ size: "", adj: 0 });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error(t("messages.error"));
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getById(id);
      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        price: data.price || "",
        stock: data.stock || "",
        category: data.category || "",
        description: data.description || "",
        image: data.image || "",
        images: data.images || [],
        isFeatured: data.isFeatured || false,
        isNew: data.isNew || false,
        specs: data.specs || {},
        colorOptions: data.colorOptions || [],
        memoryOptions: data.memoryOptions || [],
      });
    } catch (error) {
      toast.error(t("products.notFound"));
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.images[0] || formData.image,
        images:
          formData.images.length > 0
            ? formData.images
            : [formData.image].filter(Boolean),
        rating: isEditing ? undefined : 0,
        reviewsCount: isEditing ? undefined : 0,
      };

      if (isEditing) {
        await productService.update(id, productData);
        toast.success(t("products.saveSuccess"));
      } else {
        await productService.create(productData);
        toast.success(t("messages.created"));
      }
      navigate("/products");
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setSaving(false);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, event.target.result],
          }));
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = "";
  };

  const setMainImage = (index) => {
    const newImages = [...formData.images];
    const [mainImg] = newImages.splice(index, 1);
    newImages.unshift(mainImg);
    setFormData({ ...formData, images: newImages });
  };

  const addSpec = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specs: { ...formData.specs, [newSpec.key]: newSpec.value },
      });
      setNewSpec({ key: "", value: "" });
    }
  };

  const removeSpec = (key) => {
    const { [key]: removed, ...rest } = formData.specs;
    setFormData({ ...formData, specs: rest });
  };

  const addColor = () => {
    if (newColor.name) {
      setFormData({
        ...formData,
        colorOptions: [...formData.colorOptions, newColor],
      });
      setNewColor({ name: "", hex: "#000000" });
    }
  };

  const removeColor = (index) => {
    setFormData({
      ...formData,
      colorOptions: formData.colorOptions.filter((_, i) => i !== index),
    });
  };

  const addMemory = () => {
    if (newMemory.size) {
      setFormData({
        ...formData,
        memoryOptions: [
          ...formData.memoryOptions,
          { ...newMemory, adj: parseInt(newMemory.adj) || 0 },
        ],
      });
      setNewMemory({ size: "", adj: 0 });
    }
  };

  const removeMemory = (index) => {
    setFormData({
      ...formData,
      memoryOptions: formData.memoryOptions.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <div className="flex items-center gap-[16px]">
        <button
          onClick={() => navigate("/products")}
          className="p-[10px] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#374151]" />
        </button>
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">
            {isEditing ? t("products.editProduct") : t("products.addProduct")}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-[4px]">
            {isEditing ? t("products.editSubtitle") : t("products.addSubtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-[24px]">
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
            {t("products.basicInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.productName")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.brand")} *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.price")} ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.stock")} *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.category")} *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              >
                <option value="">{t("common.select")}...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-[24px] items-end">
              <label className="flex items-center gap-[10px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-[18px] h-[18px] rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span className="text-[14px] text-[#374151]">
                  {t("products.featured")}
                </span>
              </label>
              <label className="flex items-center gap-[10px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) =>
                    setFormData({ ...formData, isNew: e.target.checked })
                  }
                  className="w-[18px] h-[18px] rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span className="text-[14px] text-[#374151]">
                  {t("products.newProduct")}
                </span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
                {t("products.description")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              {t("products.productImages")}
            </h2>
            <div className="flex gap-[8px]">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[13px] font-medium transition-colors ${
                  imageMode === "url"
                    ? "bg-[#3B82F6] text-white"
                    : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                }`}
              >
                <Link className="w-[16px] h-[16px]" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] text-[13px] font-medium transition-colors ${
                  imageMode === "upload"
                    ? "bg-[#3B82F6] text-white"
                    : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                }`}
              >
                <Upload className="w-[16px] h-[16px]" />
                {t("products.upload")}
              </button>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[12px] mb-[20px]">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-[12px] overflow-hidden border-2 border-[#E5E7EB] hover:border-[#3B82F6] transition-colors"
                >
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute top-[6px] left-[6px] px-[8px] py-[3px] bg-[#3B82F6] text-white text-[11px] font-medium rounded-[6px]">
                      {t("products.mainImage")}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-[8px]">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setMainImage(idx)}
                        className="p-[8px] bg-white rounded-[8px] text-[#3B82F6] hover:bg-[#F3F4F6]"
                        title={t("products.setMainImage")}
                      >
                        <Image className="w-[16px] h-[16px]" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-[8px] bg-white rounded-[8px] text-[#EF4444] hover:bg-red-50"
                      title={t("common.delete")}
                    >
                      <Trash2 className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {imageMode === "url" ? (
            <div className="flex gap-[12px]">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-[20px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-[12px] transition-colors flex items-center gap-[8px]"
              >
                <Plus className="w-[18px] h-[18px]" />
                {t("common.add")}
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D1D5DB] rounded-[12px] p-[32px] text-center cursor-pointer hover:border-[#3B82F6] hover:bg-[#F9FAFB] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-[40px] h-[40px] text-[#9CA3AF] mx-auto mb-[12px]" />
              <p className="text-[14px] text-[#6B7280]">
                {t("products.clickToUpload")}{" "}
                <span className="text-[#3B82F6] font-medium">
                  {t("products.click")}
                </span>
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-[4px]">
                PNG, JPG, WEBP (max 5MB)
              </p>
            </div>
          )}

          {formData.images.length === 0 && (
            <p className="text-[13px] text-[#9CA3AF] mt-[12px]">
              {t("products.noImages")}
            </p>
          )}
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
            {t("products.specifications")}
          </h2>
          <div className="space-y-[12px]">
            {Object.entries(formData.specs).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-[12px] p-[12px] bg-[#F9FAFB] rounded-[10px]"
              >
                <span className="font-medium text-[14px] text-[#374151] min-w-[120px]">
                  {key}:
                </span>
                <span className="text-[14px] text-[#6B7280] flex-1">
                  {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpec(key)}
                  className="p-[6px] hover:bg-red-50 rounded-[6px]"
                >
                  <X className="w-[16px] h-[16px] text-[#EF4444]" />
                </button>
              </div>
            ))}
            <div className="flex gap-[12px]">
              <input
                type="text"
                placeholder={t("products.specName")}
                value={newSpec.key}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, key: e.target.value })
                }
                className="flex-1 px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <input
                type="text"
                placeholder={t("products.specValue")}
                value={newSpec.value}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, value: e.target.value })
                }
                className="flex-1 px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                type="button"
                onClick={addSpec}
                className="px-[16px] py-[10px] bg-[#3B82F6] text-white rounded-[10px] hover:bg-[#2563EB]"
              >
                <Plus className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
            {t("products.colorOptions")}
          </h2>
          <div className="flex flex-wrap gap-[12px] mb-[16px]">
            {formData.colorOptions.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-[8px] px-[12px] py-[8px] bg-[#F9FAFB] rounded-[10px]"
              >
                <div
                  className="w-[20px] h-[20px] rounded-full border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[14px] text-[#374151]">{color.name}</span>
                <button
                  type="button"
                  onClick={() => removeColor(idx)}
                  className="p-[4px] hover:bg-red-50 rounded"
                >
                  <X className="w-[14px] h-[14px] text-[#EF4444]" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-[12px]">
            <input
              type="text"
              placeholder={t("products.colorName")}
              value={newColor.name}
              onChange={(e) =>
                setNewColor({ ...newColor, name: e.target.value })
              }
              className="flex-1 px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
            <input
              type="color"
              value={newColor.hex}
              onChange={(e) =>
                setNewColor({ ...newColor, hex: e.target.value })
              }
              className="w-[50px] h-[42px] rounded-[10px] border border-[#E5E7EB] cursor-pointer"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-[16px] py-[10px] bg-[#3B82F6] text-white rounded-[10px] hover:bg-[#2563EB]"
            >
              <Plus className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-[24px]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-[20px]">
            {t("products.memoryOptions")}
          </h2>
          <div className="flex flex-wrap gap-[12px] mb-[16px]">
            {formData.memoryOptions.map((mem, idx) => (
              <div
                key={idx}
                className="flex items-center gap-[8px] px-[12px] py-[8px] bg-[#F9FAFB] rounded-[10px]"
              >
                <span className="text-[14px] text-[#374151]">{mem.size}</span>
                <span className="text-[12px] text-[#6B7280]">+${mem.adj}</span>
                <button
                  type="button"
                  onClick={() => removeMemory(idx)}
                  className="p-[4px] hover:bg-red-50 rounded"
                >
                  <X className="w-[14px] h-[14px] text-[#EF4444]" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-[12px]">
            <input
              type="text"
              placeholder={t("products.memorySize")}
              value={newMemory.size}
              onChange={(e) =>
                setNewMemory({ ...newMemory, size: e.target.value })
              }
              className="flex-1 px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
            <input
              type="number"
              placeholder={t("products.priceDiff")}
              value={newMemory.adj}
              onChange={(e) =>
                setNewMemory({ ...newMemory, adj: e.target.value })
              }
              className="w-[120px] px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px]"
            />
            <button
              type="button"
              onClick={addMemory}
              className="px-[16px] py-[10px] bg-[#3B82F6] text-white rounded-[10px] hover:bg-[#2563EB]"
            >
              <Plus className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        <div className="flex gap-[12px] justify-end">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-[24px] py-[12px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[12px] hover:bg-[#F3F4F6]"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-[24px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] disabled:opacity-50"
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
