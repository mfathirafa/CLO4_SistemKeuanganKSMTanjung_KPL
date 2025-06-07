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