const orderConfirmationTemplate = (order, user) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Sifarişiniz Təsdiqləndi!</h2>
      <p>Hörmətli ${user.firstName || 'Müştəri'},</p>
      <p>Sizə təşəkkür edirik! <strong>${order.orderNumber}</strong> nömrəli sifarişiniz uğurla qeydə alındı.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Sifariş Detalları:</h3>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Cəmi Məbləğ:</strong> ${order.totalAmount} ${order.currency || 'AZN'}</p>
      </div>
      
      <p>Sifarişinizin vəziyyətini izləmək üçün saytımıza daxil olub "Sifarişlərim" bölməsinə baxa bilərsiniz.</p>
      <br/>
      <p>Hörmətlə,<br/><strong>TechVibe Komandası</strong></p>
    </div>
  `;
};

const orderStatusUpdateTemplate = (order, user) => {
  const statusMessages = {
    processing: "Sifarişiniz hazırda icra olunur.",
    shipped: "Sifarişiniz yola düşdü! Çatdırılma üçün kuryer sizinlə əlaqə saxlayacaq.",
    delivered: "Sifarişiniz uğurla çatdırıldı. Bizi seçdiyiniz üçün təşəkkürlər!",
    cancelled: "Sifarişiniz ləğv edildi."
  };

  const statusText = statusMessages[order.status] || "Sifarişinizin statusu yeniləndi.";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Sifariş Statusu Yeniləndi</h2>
      <p>Hörmətli ${user.firstName || 'Müştəri'},</p>
      <p><strong>${order.orderNumber}</strong> nömrəli sifarişinizin statusu yeniləndi: <strong>${order.status.toUpperCase()}</strong>.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>${statusText}</p>
      </div>
      
      <p>Əlavə suallarınız yarandıqda bizimlə əlaqə saxlaya bilərsiniz.</p>
      <br/>
      <p>Hörmətlə,<br/><strong>TechVibe Komandası</strong></p>
    </div>
  `;
};

module.exports = {
  orderConfirmationTemplate,
  orderStatusUpdateTemplate
};
