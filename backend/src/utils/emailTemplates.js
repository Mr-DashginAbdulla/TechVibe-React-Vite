// Multilingual email template translations
const translations = {
  az: {
    orderConfirmed: "Sifarişiniz Təsdiqləndi!",
    dear: "Hörmətli",
    customer: "Müştəri",
    thankYou: "Sizə təşəkkür edirik!",
    orderRecorded: "nömrəli sifarişiniz uğurla qeydə alındı.",
    orderDetails: "Sifariş Detalları:",
    status: "Status:",
    totalAmount: "Cəmi Məbləğ:",
    trackOrder: "Sifarişinizin vəziyyətini izləmək üçün saytımıza daxil olub \"Sifarişlərim\" bölməsinə baxa bilərsiniz.",
    regards: "Hörmətlə,",
    team: "TechVibe Komandası",
    statusUpdated: "Sifariş Statusu Yeniləndi",
    orderStatusChanged: "nömrəli sifarişinizin statusu yeniləndi:",
    contactUs: "Əlavə suallarınız yarandıqda bizimlə əlaqə saxlaya bilərsiniz.",
    statusMessages: {
      processing: "Sifarişiniz hazırda icra olunur.",
      shipped: "Sifarişiniz yola düşdü! Çatdırılma üçün kuryer sizinlə əlaqə saxlayacaq.",
      delivered: "Sifarişiniz uğurla çatdırıldı. Bizi seçdiyiniz üçün təşəkkürlər!",
      cancelled: "Sifarişiniz ləğv edildi.",
    },
    defaultStatusMsg: "Sifarişinizin statusu yeniləndi.",
  },
  en: {
    orderConfirmed: "Your Order Has Been Confirmed!",
    dear: "Dear",
    customer: "Customer",
    thankYou: "Thank you!",
    orderRecorded: "your order has been successfully recorded.",
    orderDetails: "Order Details:",
    status: "Status:",
    totalAmount: "Total Amount:",
    trackOrder: "You can track the status of your order by logging into our website and visiting the \"My Orders\" section.",
    regards: "Best regards,",
    team: "TechVibe Team",
    statusUpdated: "Order Status Updated",
    orderStatusChanged: "the status of your order has been updated:",
    contactUs: "If you have any questions, feel free to contact us.",
    statusMessages: {
      processing: "Your order is currently being processed.",
      shipped: "Your order has been shipped! A courier will contact you for delivery.",
      delivered: "Your order has been successfully delivered. Thank you for choosing us!",
      cancelled: "Your order has been cancelled.",
    },
    defaultStatusMsg: "Your order status has been updated.",
  },
  ru: {
    orderConfirmed: "Ваш заказ подтверждён!",
    dear: "Уважаемый(ая)",
    customer: "Клиент",
    thankYou: "Благодарим вас!",
    orderRecorded: "ваш заказ успешно оформлен.",
    orderDetails: "Детали заказа:",
    status: "Статус:",
    totalAmount: "Итого:",
    trackOrder: "Вы можете отслеживать статус заказа, войдя на наш сайт и перейдя в раздел «Мои заказы».",
    regards: "С уважением,",
    team: "Команда TechVibe",
    statusUpdated: "Статус заказа обновлён",
    orderStatusChanged: "статус вашего заказа обновлён:",
    contactUs: "Если у вас возникнут вопросы, свяжитесь с нами.",
    statusMessages: {
      processing: "Ваш заказ в данный момент обрабатывается.",
      shipped: "Ваш заказ отправлен! Курьер свяжется с вами для доставки.",
      delivered: "Ваш заказ успешно доставлен. Спасибо, что выбрали нас!",
      cancelled: "Ваш заказ отменён.",
    },
    defaultStatusMsg: "Статус вашего заказа обновлён.",
  },
};

/**
 * Get the translation object for a given language code.
 * Supports 'az', 'en', 'ru'. Defaults to 'az'.
 */
const getTranslation = (lang) => {
  const normalizedLang = (lang || "az").toLowerCase().substring(0, 2);
  return translations[normalizedLang] || translations.az;
};

const orderConfirmationTemplate = (order, user, lang) => {
  const t = getTranslation(lang);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${t.orderConfirmed}</h2>
      <p>${t.dear} ${user.firstName || t.customer},</p>
      <p>${t.thankYou} <strong>${order.orderNumber}</strong> ${t.orderRecorded}</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${t.orderDetails}</h3>
        <p><strong>${t.status}</strong> ${order.status}</p>
        <p><strong>${t.totalAmount}</strong> ${order.totalAmount} ${order.currency || 'AZN'}</p>
      </div>
      
      <p>${t.trackOrder}</p>
      <br/>
      <p>${t.regards}<br/><strong>${t.team}</strong></p>
    </div>
  `;
};

const orderStatusUpdateTemplate = (order, user, lang) => {
  const t = getTranslation(lang);
  const statusText = t.statusMessages[order.status] || t.defaultStatusMsg;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">${t.statusUpdated}</h2>
      <p>${t.dear} ${user.firstName || t.customer},</p>
      <p><strong>${order.orderNumber}</strong> ${t.orderStatusChanged} <strong>${order.status.toUpperCase()}</strong>.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>${statusText}</p>
      </div>
      
      <p>${t.contactUs}</p>
      <br/>
      <p>${t.regards}<br/><strong>${t.team}</strong></p>
    </div>
  `;
};

module.exports = {
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
};
