const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let customers = [];

app.get("/customers", (req, res) => {
  res.json(customers);
});

app.post("/customers", (req, res) => {
  const { name, phone } = req.body;
  if (name && phone) {
    const newCustomer = {
      name,
      phone,
      status: "active",
      lastPayment: "N/A",
    };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
  } else {
    res.status(400).json({ error: "Missing name or phone" });
  }
});

app.patch("/customers/:name", (req, res) => {
  const name = req.params.name;
  const { status } = req.body;

  const customer = customers.find((c) => c.name === name);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  if (!status) {
    return res.status(400).json({ error: "Missing status in request body" });
  }

  customer.status = status;
  res.json(customer);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
