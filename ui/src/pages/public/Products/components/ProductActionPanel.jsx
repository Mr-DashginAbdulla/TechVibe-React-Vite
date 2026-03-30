import ProductInfo from "./ProductInfo";
import PriceBlock from "./PriceBlock";
import VariantSelector from "./VariantSelector";
import QuantitySelector from "./QuantitySelector";
import ActionButtons from "./ActionButtons";
import TrustBadges from "./TrustBadges";

const ProductActionPanel = ({
  product,
  calculatedPrice,
  reviews,
  selectedOptions,
  transformedProductOptions,
  quantity,
  setQuantity,
  isInWishlist,
  onOptionSelect,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
}) => {
  return (
    <div className="flex flex-col">
      <ProductInfo
        brand={product.brand}
        name={product.name}
        rating={
          reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : null
        }
        reviewsCount={reviews.length}
        isNew={product.isNew}
      />

      <PriceBlock
        price={calculatedPrice}
        oldPrice={product.oldPrice}
        stock={product.stock}
      />

      <VariantSelector
        options={transformedProductOptions}
        selectedOptions={selectedOptions}
        onOptionSelect={onOptionSelect}
      />

      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        stock={product.stock}
      />

      <ActionButtons
        productId={product._id || product.id}
        stock={product.stock}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
        onToggleWishlist={onToggleWishlist}
        isInWishlist={isInWishlist}
      />

      <TrustBadges />
    </div>
  );
};

export default ProductActionPanel;
