const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const db = router.db;
  const user = db.get('users').find({ email, password }).value();

  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: "Email və ya şifrə yanlışdır" });
  }
});

server.get('/stats', (req, res) => {
  const db = router.db;
  
  const stats = {
    users: db.get('users').size().value(),
    products: db.get('products').size().value(),
    orders: db.get('orders').size().value(),
    revenue: db.get('orders').map('totalAmount').sum().value() || 0
  };
  
  res.json(stats);
});

server.use(router);

server.listen(3000, () => {
  console.log('TechVibe Server is running on port 3000');
});