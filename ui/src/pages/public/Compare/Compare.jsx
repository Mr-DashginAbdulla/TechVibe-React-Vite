import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectCompareItems, removeFromCompare, clearCompare, addToCompare } from '@/store/slices/compareSlice';
import { Trash2, ShoppingCart, Info, ArrowLeft } from 'lucide-react';
import { useAddToCartMutation, apiSlice, useGetAllProductsQuery } from '@/store/api/apiSlice';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef, useMemo } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ProductPicker from '@/pages/public/Products/components/comparison/ProductPicker';
import { useCurrency } from '@/context/CurrencyContext';

const Compare = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector(selectCompareItems);
  const { user } = useAuth();
  const [addToCart] = useAddToCartMutation();
  const [populatedItems, setPopulatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { data: allProducts = [] } = useGetAllProductsQuery();

  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPicker(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPicker && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showPicker]);

  const availableProducts = useMemo(() => {
    const existingIds = new Set(items.map((i) => i.id));
    return allProducts
      .filter((p) => !existingIds.has(p.id))
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand && typeof p.brand === 'string' && p.brand.toLowerCase().includes(q)) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(q)) ||
          (p.category && typeof p.category === 'string' && p.category.toLowerCase().includes(q)) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
        );
      });
  }, [allProducts, items, searchQuery]);

  const handleAddProduct = (productId) => {
    dispatch(addToCompare({ id: productId }));
    setShowPicker(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (items.length === 0) {
        setPopulatedItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const promises = items.map(item => 
          dispatch(apiSlice.endpoints.getProductById.initiate(item.id)).unwrap()
        );
        const results = await Promise.all(promises);
        setPopulatedItems(results);
      } catch (err) {
        console.error("Failed to fetch products for compare", err);
        setPopulatedItems(items);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [items, dispatch]);

  const handleAddToCart = async (item) => {
    if (!user) {
      toast.info(t('common.loginRequired') || 'Zəhmət olmasa daxil olun');
      return;
    }
    try {
      await addToCart({
        productId: item.id,
        quantity: 1,
      }).unwrap();
      toast.success(t('products.addedToCart') || 'Səbətə əlavə edildi');
    } catch (error) {
      toast.error(t('common.error') || 'Xəta baş verdi');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-[20px] py-[60px] text-center">
        <div className="flex flex-col items-center justify-center space-y-[20px] max-w-md mx-auto">
          <div className="w-[80px] h-[80px] bg-secondary rounded-full flex items-center justify-center">
            <Info className="w-[40px] h-[40px] text-muted-foreground" />
          </div>
          <h1 className="text-[24px] font-bold text-foreground">
            {t("compare.emptyTitle") || "Müqayisə siyahısı boşdur"}
          </h1>
          <p className="text-[16px] text-muted-foreground">
            {t("compare.emptyDesc") || "Məhsulları biri-biri ilə müqayisə etmək üçün onları siyahıya əlavə edin."}
          </p>
          <Link
            to="/shop"
            className="flex items-center gap-[10px] bg-primary text-primary-foreground px-[24px] py-[12px] rounded-[10px] font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-[20px] h-[20px]" />
            {t("compare.continueShopping") || "Alış-verişə davam et"}
          </Link>
        </div>
      </div>
    );
  }

  const allSpecs = new Set();
  populatedItems.forEach(item => {
    if (item.specs && typeof item.specs === 'object') {
      Object.keys(item.specs).forEach(key => {
        allSpecs.add(key);
      });
    }
  });
  const specKeys = Array.from(allSpecs);

  if (loading) {
    return (
      <div className="container mx-auto px-[20px] py-[100px] flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-[20px] py-[40px]">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border pb-[20px] mb-[30px] gap-[16px]">
        <div>
          <h1 className="text-[28px] font-bold text-foreground">
            {t("compare.title") || "Məhsulların Müqayisəsi"}
          </h1>
          <p className="text-muted-foreground mt-[4px]">
            {populatedItems.length} {t("compare.itemsCount") || "məhsul müqayisə edilir"}
          </p>
        </div>
        <button
          onClick={() => dispatch(clearCompare())}
          className="flex items-center gap-[8px] text-destructive hover:bg-destructive/10 px-[16px] py-[8px] rounded-[8px] transition"
        >
          <Trash2 className="w-[18px] h-[18px]" />
          <span>{t("compare.clearAll") || "Hamısını Təmizlə"}</span>
        </button>
      </div>

      <div className="overflow-x-auto pb-[20px]">
        <table className="w-full border-collapse min-w-[800px]">
          <tbody>
            {/* PRODUCT HEADER */}
            <tr>
              <th className="w-[200px] border border-border p-[16px] bg-secondary text-left align-top sticky left-0 z-10">
                <span className="text-[16px] font-semibold text-foreground">
                  {t("compare.features") || "Xüsusiyyətlər"}
                </span>
              </th>
              {populatedItems.map((item) => (
                <td key={item.id} className="border border-border p-[16px] align-top w-[300px]">
                  <div className="relative group flex flex-col items-center">
                    <button
                      onClick={() => dispatch(removeFromCompare(item.id))}
                      className="absolute top-0 right-0 p-[6px] bg-background/80 hover:bg-destructive hover:text-white rounded-full text-muted-foreground transition opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                      title={t("compare.remove") || "Çıxar"}
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                    <Link to={`/product/${item.slug || item.id}`} className="flex h-[180px] w-full mb-[16px] items-center justify-center p-[20px] bg-secondary/50 rounded-[12px]">
                      <img
                        src={item.mainImage || item.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>
                    <Link to={`/product/${item.slug || item.id}`} className="text-[16px] font-semibold text-foreground hover:text-primary transition-colors text-center line-clamp-2 min-h-[48px] mb-[8px]">
                      {item.name}
                    </Link>
                    <div className="text-[18px] font-bold text-foreground mb-[16px]">
                      {item.salePrice ? (
                        <div className="flex items-center justify-center gap-[8px]">
                          <span>{formatPrice(item.salePrice)}</span>
                          <span className="text-[14px] text-muted-foreground line-through">{formatPrice(item.price)}</span>
                        </div>
                      ) : (
                        <span>{formatPrice(item.price)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-[10px] bg-primary text-primary-foreground rounded-[8px] flex items-center justify-center gap-[8px] font-medium hover:bg-primary/90 transition"
                    >
                      <ShoppingCart className="w-[16px] h-[16px]" />
                      {t("product.addToCart", { defaultValue: "Səbətə At" })}
                    </button>
                  </div>
                </td>
              ))}
              {/* Add empty spots if less than 4 items */}
              {Array.from({ length: 4 - populatedItems.length }).map((_, i) => (
                <td key={`empty-${i}`} className="border border-border p-[16px] align-middle text-center w-[300px] bg-secondary/20 relative">
                  <div className="flex flex-col items-center justify-center h-full space-y-[12px]">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPicker(!showPicker);
                      }}
                      className="w-[60px] h-[60px] rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="text-[24px] text-muted-foreground">+</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPicker(!showPicker);
                      }} 
                      className="text-[14px] font-medium text-primary hover:underline focus:outline-none"
                    >
                      {t("compare.addMore") || "Məhsul əlavə et"}
                    </button>
                    
                    {/* Render picker only for the first empty slot to avoid duplicates overlapping */}
                    {i === 0 && showPicker && (
                      <div ref={dropdownRef} className="absolute z-50 left-1/2 -translate-x-1/2 top-[50%]">
                        <ProductPicker
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          searchInputRef={searchInputRef}
                          availableProducts={availableProducts}
                          onSelect={handleAddProduct}
                        />
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* BRAND */}
            <tr>
              <th className="border border-border p-[16px] bg-secondary text-left sticky left-0 font-medium text-muted-foreground">
                {t("product.brand", { defaultValue: "Brend" })}
              </th>
              {populatedItems.map((item) => (
                <td key={item.id} className="border border-border p-[16px] text-center font-medium">
                  {item.brand?.name || item.brand || "-"}
                </td>
              ))}
              {Array.from({ length: 4 - populatedItems.length }).map((_, i) => (
                <td key={`empty-brand-${i}`} className="border border-border p-[16px] bg-secondary/20"></td>
              ))}
            </tr>

            {/* CATEGORY */}
            <tr>
              <th className="border border-border p-[16px] bg-secondary text-left sticky left-0 font-medium text-muted-foreground">
                {t("product.category", { defaultValue: "Kateqoriya" })}
              </th>
              {populatedItems.map((item) => (
                <td key={item.id} className="border border-border p-[16px] text-center font-medium">
                  {item.category?.name || item.category || "-"}
                </td>
              ))}
              {Array.from({ length: 4 - populatedItems.length }).map((_, i) => (
                <td key={`empty-cat-${i}`} className="border border-border p-[16px] bg-secondary/20"></td>
              ))}
            </tr>

            {/* SPECIFICATIONS */}
            {specKeys.map(key => {
              // Check if values are different across products (for highlighting)
              const values = populatedItems.map(item => {
                if (!item.specs) return null;
                return item.specs[key] || null;
              });
              
              // Only highlight if at least one value exists and someone has a different value
              const hasValues = values.some(v => v !== null && v !== undefined);
              const isDifferent = hasValues && new Set(values).size > 1;

              return (
                <tr key={key} className={isDifferent ? "bg-accent/30" : ""}>
                  <th className="border border-border p-[16px] bg-secondary text-left sticky left-0 font-medium text-muted-foreground capitalize">
                    {t(`specs.${key.replace(/\s+/g, "")}`, { defaultValue: key })}
                  </th>
                  {populatedItems.map((item) => {
                    const value = item.specs?.[key];
                    return (
                      <td key={`${item.id}-${key}`} className="border border-border p-[16px] text-center text-[14px]">
                        {value ? value : "-"}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - populatedItems.length }).map((_, i) => (
                    <td key={`empty-spec-${key}-${i}`} className="border border-border p-[16px] bg-secondary/20"></td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
