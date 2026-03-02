import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

const EmptyWishlist = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[20px] shadow-sm border border-border p-[60px] text-center">
      <Heart className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[16px]" />
      <p className="text-[16px] font-medium text-muted-foreground">
        {t("wishlist.empty")}
      </p>
      <p className="text-[14px] text-muted-foreground mt-[4px]">
        {t("wishlist.browseProducts")}
      </p>
      <Link
        to="/shop"
        className="inline-block mt-[16px] px-[24px] py-[12px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
      >
        {t("basket.startShopping")}
      </Link>
    </div>
  );
};

export default EmptyWishlist;
