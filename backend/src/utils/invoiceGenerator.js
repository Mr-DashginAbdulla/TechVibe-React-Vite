const PDFDocument = require("pdfkit");

/**
 * Generate a PDF invoice for an order and pipe it to a writable stream.
 * @param {Object} order - The order document
 * @param {Object} user - The user document (owner of the order)
 * @param {import('stream').Writable} stream - Writable stream (e.g., res)
 */
function generateInvoice(order, user, stream) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(stream);

  // ──── Header / Company info ────
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("TechVibe", 50, 50)
    .fontSize(10)
    .font("Helvetica")
    .text("E-Commerce Platform", 50, 80)
    .text("support@techvibe.com", 50, 95);

  // Invoice title
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("INVOICE", 400, 50, { align: "right" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Invoice #: ${order.orderNumber}`, 400, 80, { align: "right" })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, {
      align: "right",
    });

  // Divider
  doc.moveTo(50, 120).lineTo(545, 120).stroke("#e0e0e0");

  // ──── Bill To ────
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Bill To:", 50, 140);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`${user.firstName || ""} ${user.lastName || ""}`.trim(), 50, 160)
    .text(user.email || "", 50, 175);

  if (order.shippingAddress) {
    const addr = order.shippingAddress;
    const addressParts = [
      addr.address || addr.street,
      addr.city,
      addr.state,
      addr.zip || addr.postalCode,
      addr.country,
    ].filter(Boolean);

    if (addressParts.length > 0) {
      doc.text(addressParts.join(", "), 50, 190, { width: 250 });
    }
  }

  // ──── Items Table ────
  const tableTop = 240;
  const colX = { item: 50, qty: 320, price: 390, total: 470 };

  // Table header
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Item", colX.item, tableTop)
    .text("Qty", colX.qty, tableTop)
    .text("Price", colX.price, tableTop)
    .text("Total", colX.total, tableTop);

  doc
    .moveTo(50, tableTop + 18)
    .lineTo(545, tableTop + 18)
    .stroke("#e0e0e0");

  // Table rows
  let y = tableTop + 28;
  const items = order.items || [];

  items.forEach((item) => {
    const qty = item.quantity || 1;
    const price = item.price || 0;
    const lineTotal = qty * price;

    // Truncate long product names
    const name =
      (item.name || "Product").length > 40
        ? (item.name || "Product").substring(0, 37) + "..."
        : item.name || "Product";

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(name, colX.item, y, { width: 260 })
      .text(String(qty), colX.qty, y)
      .text(`$${price.toFixed(2)}`, colX.price, y)
      .text(`$${lineTotal.toFixed(2)}`, colX.total, y);

    y += 20;

    // Page break safety
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
  });

  // Divider before summary
  doc.moveTo(300, y + 5).lineTo(545, y + 5).stroke("#e0e0e0");

  // ──── Order Summary ────
  y += 15;

  const summaryItems = [
    { label: "Subtotal", value: order.subtotal || 0 },
    { label: "Shipping", value: order.shippingCost || 0 },
    { label: "Tax (18%)", value: order.tax || 0 },
  ];

  if (order.discount > 0) {
    summaryItems.push({ label: "Discount", value: -(order.discount || 0) });
  }

  if (order.promoCode) {
    summaryItems.push({ label: `Promo (${order.promoCode})`, value: null });
  }

  summaryItems.forEach(({ label, value }) => {
    doc.fontSize(10).font("Helvetica").text(label, 350, y);
    if (value !== null) {
      doc.text(
        `${value < 0 ? "-" : ""}$${Math.abs(value).toFixed(2)}`,
        colX.total,
        y
      );
    }
    y += 18;
  });

  // Total
  doc.moveTo(300, y).lineTo(545, y).stroke("#333");
  y += 8;

  const grandTotal = order.total || order.totalAmount || 0;
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("TOTAL", 350, y)
    .text(`$${grandTotal.toFixed(2)}`, colX.total, y);

  // ──── Footer ────
  const footerY = 750;
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#999")
    .text(
      "Thank you for your purchase! This invoice was generated automatically by TechVibe.",
      50,
      footerY,
      { align: "center", width: 495 }
    )
    .text(
      `Generated: ${new Date().toISOString()}`,
      50,
      footerY + 14,
      { align: "center", width: 495 }
    );

  doc.end();
}

module.exports = { generateInvoice };
