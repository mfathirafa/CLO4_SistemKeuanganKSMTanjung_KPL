// Runtime Configuration (menggunakan variabel ENV fallback)
const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";

// Automata (State untuk pengelolaan status UI)
const UIState = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
};

let currentState = UIState.IDLE;
function setState(state) {
  currentState = state;
  console.log("State sekarang:", state);
  // Di sini kamu bisa update UI tergantung statusnya
}

// Table-driven Construction (mapping filter logika)
const filters = {
  name: (item, keyword) => item.name.toLowerCase().includes(keyword),
  phone: (item, keyword) => item.phone.toLowerCase().includes(keyword),
  status: (item, status) => !status || item.status === status,
};

let customers = [];

document.addEventListener("DOMContentLoaded", () => {
  setState(UIState.LOADING);
  fetch(`${API_BASE_URL}/customers`)
    .then((res) => res.json())
    .then((data) => {
      customers.length = 0;
      customers.push(...data);
      renderCustomers(customers);
      setState(UIState.SUCCESS);
    })
    .catch(() => setState(UIState.ERROR));

  document.getElementById("addCustomerBtn").addEventListener("click", () => {
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    if (name && phone) {
      setState(UIState.LOADING);
      fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      })
        .then((res) => res.json())
        .then((data) => {
          customers.push(data);
          renderCustomers(customers);
          document.getElementById("customerName").value = "";
          document.getElementById("customerPhone").value = "";
          setState(UIState.SUCCESS);
        })
        .catch(() => setState(UIState.ERROR));
    } else {
      alert("Nama dan nomor HP harus diisi!");
    }
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;

    const filteredData = customers.filter((item) => {
      return (
        filters.name(item, query) ||
        filters.phone(item, query)
      ) && filters.status(item, status);
    });

    renderCustomers(filteredData);
  });
});
