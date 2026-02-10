import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Mail,
  ArrowRight,
  Home,
  Building2,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { orderService } from "@/services/orderService";

const OrderSuccess = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-[48px] h-[48px] text-primary animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("checkout.orderConfirmed")} - TechVibe</title>
      </Helmet>

      <div className="max-w-[1000px] mx-auto px-[16px] py-[48px]">
        <div className="text-center mb-[48px]">
          <div className="w-[80px] h-[80px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-[24px]">
            <CheckCircle className="w-[48px] h-[48px] text-emerald-500" />
          </div>
          <h1 className="text-[32px] font-bold text-foreground mb-[12px]">
            {t("checkout.orderConfirmed")}
          </h1>
          <p className="text-[16px] text-muted-foreground max-w-[500px] mx-auto">
            {t("checkout.thankYou")}
          </p>
        </div>

        <div className="bg-card rounded-[24px] shadow-sm border border-border p-[32px] mb-[24px]">
          <div className="flex flex-wrap items-center justify-center gap-[32px] mb-[32px]">
            <div className="text-center">
              <p className="text-[13px] text-muted-foreground mb-[4px]">
                {t("order.orderNumber")}
              </p>
              <p className="text-[20px] font-bold text-foreground">
                {order.orderNumber || order.id}
              </p>
            </div>
            <div className="w-px h-[40px] bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-[13px] text-muted-foreground mb-[4px]">
                {t("order.orderDate")}
              </p>
              <p className="text-[16px] font-semibold text-foreground">
                {new Date(order.createdAt).toLocaleDateString("az-AZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="w-px h-[40px] bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-[13px] text-muted-foreground mb-[4px]">
                {t("checkout.estimatedDelivery")}
              </p>
              <p className="text-[16px] font-semibold text-emerald-600 dark:text-emerald-400">
                {estimatedDelivery.toLocaleDateString("az-AZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[12px] p-[16px] bg-blue-50 dark:bg-blue-900/20 rounded-[12px] border border-blue-100 dark:border-blue-800">
            <Mail className="w-[20px] h-[20px] text-blue-600 dark:text-blue-400" />
            <p className="text-[14px] text-blue-600 dark:text-blue-400">
              {t("checkout.emailSent")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          <div className="lg:col-span-2 space-y-[24px]">
            <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
              <h2 className="text-[18px] font-bold text-foreground mb-[20px] flex items-center gap-[10px]">
                <Package className="w-[20px] h-[20px] text-primary" />
                {t("order.items")}
              </h2>
              <div className="space-y-[16px]">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-[16px] p-[16px] bg-muted/30 rounded-[14px]"
                  >
                    <div className="w-[64px] h-[64px] bg-background rounded-[10px] overflow-hidden border border-border shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[14px] text-muted-foreground">
                        {t("product.quantity")}: {item.quantity}
                      </p>
                    </div>
                    <p className="text-[16px] font-bold text-foreground">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
              <h2 className="text-[18px] font-bold text-foreground mb-[16px] flex items-center gap-[10px]">
                <MapPin className="w-[20px] h-[20px] text-primary" />
                {t("order.shippingAddress")}
              </h2>
              {order.shippingAddress && (
                <div className="flex items-start gap-[16px] p-[16px] bg-muted/30 rounded-[14px]">
                  <div className="w-[44px] h-[44px] bg-background rounded-[10px] flex items-center justify-center border border-border shrink-0">
                    {order.shippingAddress.label === "Home" ? (
                      <Home className="w-[20px] h-[20px] text-muted-foreground" />
                    ) : (
                      <Building2 className="w-[20px] h-[20px] text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p className="text-[14px] text-muted-foreground mt-[4px]">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-[14px] text-muted-foreground">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-[14px] text-muted-foreground">
                      {order.shippingAddress.country}
                    </p>
                    <p className="text-[14px] text-muted-foreground mt-[4px]">
                      📞 {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px]">
              <h2 className="text-[18px] font-bold text-foreground mb-[20px] flex items-center gap-[10px]">
                <Truck className="w-[20px] h-[20px] text-primary" />
                {t("checkout.orderStatus")}
              </h2>
              <div className="space-y-0">
                {[
                  {
                    status: "confirmed",
                    label: t("checkout.status.confirmed"),
                    done: true,
                  },
                  {
                    status: "processing",
                    label: t("checkout.status.processing"),
                    done: false,
                  },
                  {
                    status: "shipped",
                    label: t("checkout.status.shipped"),
                    done: false,
                  },
                  {
                    status: "delivered",
                    label: t("checkout.status.delivered"),
                    done: false,
                  },
                ].map((step, index, arr) => (
                  <div key={step.status} className="flex gap-[16px]">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                          step.done ? "bg-emerald-500" : "bg-muted"
                        }`}
                      >
                        {step.done && (
                          <CheckCircle className="w-[14px] h-[14px] text-white" />
                        )}
                      </div>
                      {index < arr.length - 1 && (
                        <div
                          className={`w-[2px] h-[40px] ${
                            step.done ? "bg-emerald-300/50" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-[16px]">
                      <p
                        className={`text-[15px] font-medium ${
                          step.done
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.done && (
                        <p className="text-[13px] text-muted-foreground">
                          {new Date().toLocaleDateString("az-AZ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-[24px] shadow-sm border border-border p-[24px] sticky top-[24px]">
              <h2 className="text-[18px] font-bold text-foreground mb-[20px]">
                {t("basket.orderSummary")}
              </h2>

              <div className="space-y-[12px] mb-[20px]">
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">
                    {t("basket.subtotal")}
                  </span>
                  <span className="text-foreground font-medium">
                    ${(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">
                    {t("basket.shipping")}
                  </span>
                  <span className="text-foreground font-medium">
                    ${(order.shippingCost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">
                    {t("checkout.tax")}
                  </span>
                  <span className="text-foreground font-medium">
                    ${(order.tax || 0).toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {t("checkout.discount")}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      -${(order.discount || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-[18px] font-bold">
                  <span className="text-foreground">{t("basket.total")}</span>
                  <span className="text-primary">
                    ${(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-[16px] bg-muted/30 rounded-[12px] mb-[20px]">
                <div className="flex items-center gap-[12px]">
                  <CreditCard className="w-[20px] h-[20px] text-muted-foreground" />
                  <div>
                    <p className="text-[13px] text-muted-foreground">
                      {t("order.paymentMethod")}
                    </p>
                    <p className="text-[14px] font-semibold text-foreground">
                      {t(`checkout.payment.${order.paymentMethod || "card"}`)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-[12px]">
                <Link
                  to={`/profile/orders/${order.id}`}
                  className="w-full py-[14px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
                >
                  {t("order.viewDetails")}
                  <ArrowRight className="w-[18px] h-[18px]" />
                </Link>
                <Link
                  to="/"
                  className="w-full py-[14px] bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-[8px]"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  {t("basket.continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
