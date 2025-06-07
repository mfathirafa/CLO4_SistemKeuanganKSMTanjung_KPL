const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());

// In-memory storage
let customers = [];
let bills = [];
let billIdCounter = 1;
let customerIdCounter = 1;

// Dummy admin
const admin = {
  username: "admin",
  password: "123456",
};

// Middleware: auth
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (token === "secret-admin-token") {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized. Token invalid or missing." });
  }
}

// ----------------------- AUTH -----------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === admin.username && password === admin.password) {
    res.json({ token: "secret-admin-token" });
  } else {
    res.status(401).json({ error: "Username atau password salah" });
  }
});

// --------------------- CUSTOMERS ---------------------
// GET semua pelanggan
app.get("/customers", authMiddleware, (req, res) => {
  res.json(customers);
});

// POST tambah pelanggan baru
app.post("/customers", authMiddleware, (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Nama dan nomor HP harus diisi." });
  }

  const exists = customers.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    return res.status(400).json({ error: "Pelanggan dengan nama ini sudah ada." });
  }

  const newCustomer = {
    id: customerIdCounter++,
    name: name.trim(),
    phone: phone.trim(),
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// Search pelanggan by name
app.get("/customers/search", authMiddleware, (req, res) => {
  const { name } = req.query;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Nama minimal 3 karakter." });
  }

  const result = customers.filter((c) =>
    c.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(result);
});

// ---------------------- BILLS ------------------------
app.post("/bills", authMiddleware, (req, res) => {
  const { customerId, amount, dueDate } = req.body;

  // Convert customerId to number if it's a string
  const customerIdNum = parseInt(customerId);
  const amountNum = parseFloat(amount);

  if (
    isNaN(customerIdNum) ||
    isNaN(amountNum) ||
    amountNum <= 0 ||
    typeof dueDate !== "string" ||
    !dueDate.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    return res.status(400).json({ error: "Data tagihan tidak valid." });
  }

  const customer = customers.find((c) => c.id === customerIdNum);
  if (!customer) {
    return res.status(400).json({ error: "Pelanggan tidak ditemukan." });
  }

  const newBill = {
    id: billIdCounter++,
    customerId: customerIdNum,
    amount: amountNum,
    dueDate,
    status: "unpaid",
  };
  bills.push(newBill);
  res.status(201).json(newBill);
});

app.get("/bills", authMiddleware, (req, res) => {
  const { customerId, status } = req.query;
  let result = bills;

  if (customerId) {
    const idNum = parseInt(customerId);
    if (isNaN(idNum)) {
      return res.status(400).json({ error: "customerId harus angka." });
    }
    result = result.filter((b) => b.customerId === idNum);
  }

  const allowedStatus = ["paid", "unpaid"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Status harus paid atau unpaid." });
  }

  if (status) {
    result = result.filter((b) => b.status === status);
  }

  // Tambahkan nama pelanggan ke hasil
  const resultWithName = result.map((b) => {
    const customer = customers.find((c) => c.id === b.customerId);
    return {
      ...b,
      customerName: customer ? customer.name : "Unknown",
    };
  });