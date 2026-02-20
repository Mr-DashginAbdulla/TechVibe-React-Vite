const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const { email, password } = req.body;

  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: "Email və ya şifrə yanlışdır" });
  }
});

server.get("/stats", (req, res) => {
  const db = router.db;

  const stats = {
    users: db.get("users").size().value(),
    products: db.get("products").size().value(),
    orders: db.get("orders").size().value(),
    revenue: db.get("orders").map("totalAmount").sum().value() || 0,
  };

  res.json(stats);
});

server.post("/validate-promo", (req, res) => {
  const { code, subtotal = 0 } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Promo code is required" });
  }

  const db = router.db;
  const promo = db
    .get("promoCodes")
    .find((p) => p.code === code.toUpperCase())
    .value();

  if (!promo) {
    return res.status(404).json({ error: "Invalid promo code" });
  }

  if (!promo.isActive) {
    return res.status(400).json({ error: "Promo code is inactive" });
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return res.status(400).json({ error: "Promo code has expired" });
  }

  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return res.status(400).json({ error: "Promo code usage limit reached" });
  }

  if (subtotal < promo.minOrder) {
    return res.status(400).json({
      error: "Minimum order amount not met",
      minOrder: promo.minOrder,
    });
  }

  const discountAmount =
    promo.type === "percentage"
      ? (subtotal * promo.discount) / 100
      : promo.discount;

  return res.json({
    code: promo.code,
    type: promo.type,
    discount: promo.discount,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    description: promo.description,
  });
});

server.use(router);

if (require.main === module) {
  server.listen(3000, () => {
    console.log("TechVibe Server is running on port 3000");
  });
}

module.exports = server;
