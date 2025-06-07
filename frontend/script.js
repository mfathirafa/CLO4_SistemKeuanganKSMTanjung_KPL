const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";

const UIState = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
};

let currentState = UIState.IDLE;
let adminToken = localStorage.getItem("adminToken") || null;
let customers = [];

const loginSection = document.getElementById("login-section");
const mainApp = document.getElementById("main-section");

function showLoginOnly() {
  loginSection.style.display = "block";
  mainApp.style.display = "none";
}

function showMainApp() {
  loginSection.style.display = "none";
  mainApp.style.display = "block";
  fillCustomerDropdown();
}

function setState(state) {
  currentState = state;
  console.log("State sekarang:", state);
}

function fillCustomerDropdown() {
  const select = document.getElementById("billCustomerId");
  if (!select) return;
  
  select.innerHTML = '<option value="">Pilih pelanggan</option>';
  customers.forEach((c) => {
    const option = document.createElement("option");
    option.value = c.id; // pastikan menggunakan c.id yang adalah number
    option.textContent = c.name;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (adminToken) {
    showMainApp();
    loadCustomers();
  } else {
    showLoginOnly();
  }

  // Login form submit
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      fetch(${API_BASE_URL}/login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Login gagal");
          return res.json();
        })
        .then((data) => {
          adminToken = data.token;
          localStorage.setItem("adminToken", adminToken);
          const errorElement = document.getElementById("loginError");
          if (errorElement) errorElement.textContent = "";
          showMainApp();
          loadCustomers();
        })
        .catch((error) => {
          console.error("Login error:", error);
          const errorElement = document.getElementById("loginError");
          if (errorElement) {
            errorElement.textContent = "Login gagal. Cek username dan password.";
          }
        });
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      adminToken = null;
      localStorage.removeItem("adminToken");
      showLoginOnly();
    });
  }

  // Add Customer
  const addCustomerForm = document.getElementById("addCustomerForm");
  if (addCustomerForm) {
    addCustomerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("customerName").value.trim();
      const phone = document.getElementById("customerPhone").value.trim();

      if (!name || !phone) {
        alert("Nama dan nomor HP harus diisi");
        return;
      }

      fetch(${API_BASE_URL}/customers, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: adminToken,
        },
        body: JSON.stringify({ name, phone }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(err => {
              throw new Error(err.error || "Gagal menambahkan pelanggan");
            });
          }
          return res.json();
        })
        .then((data) => {
          customers.push(data);
          renderCustomers(customers);
          fillCustomerDropdown();
          document.getElementById("customerName").value = "";
          document.getElementById("customerPhone").value = "";
          alert("Pelanggan berhasil ditambahkan");
        })
        .catch((error) => {
          console.error("Add customer error:", error);
          alert(error.message || "Gagal tambah pelanggan");
        });
    });
  }