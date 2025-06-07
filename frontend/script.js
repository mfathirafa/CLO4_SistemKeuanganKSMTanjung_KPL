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

  // Search Pelanggan
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = document.getElementById("searchInput").value.toLowerCase();
      if (!query) {
        renderCustomers(customers);
        return;
      }
      // Perbaiki search - hanya search berdasarkan name dan phone
      const filtered = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.phone && c.phone.toLowerCase().includes(query))
      );
      renderCustomers(filtered);
    });
  }

  // Load Bills
  const loadBillsBtn = document.getElementById("loadBillsBtn");
  if (loadBillsBtn) {
    loadBillsBtn.addEventListener("click", loadBills);
  }

  // Add Bill
  const addBillForm = document.getElementById("addBillForm");
  if (addBillForm) {
    addBillForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const customerId = parseInt(document.getElementById("billCustomerId").value);
      const amount = parseFloat(document.getElementById("billAmount").value);
      const dueDate = document.getElementById("billDueDate").value;

      if (!customerId || !amount || !dueDate) {
        alert("Semua field tagihan harus diisi");
        return;
      }

      fetch(${API_BASE_URL}/bills, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: adminToken,
        },
        body: JSON.stringify({ customerId, amount, dueDate }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(err => {
              throw new Error(err.error || "Gagal menambahkan tagihan");
            });
          }
          return res.json();
        })
        .then((data) => {
          alert("Tagihan berhasil ditambahkan");
          document.getElementById("billCustomerId").value = "";
          document.getElementById("billAmount").value = "";
          document.getElementById("billDueDate").value = "";
        })
        .catch((error) => {
          console.error("Add bill error:", error);
          alert(error.message || "Gagal tambah tagihan");
        });
    });
  }

  // Load History
  const loadHistoryBtn = document.getElementById("loadHistoryBtn");
  if (loadHistoryBtn) {
    loadHistoryBtn.addEventListener("click", loadHistory);
  }

  // Download History (CSV)
  const downloadHistoryBtn = document.getElementById("downloadHistoryBtn");
  if (downloadHistoryBtn) {
    downloadHistoryBtn.addEventListener("click", downloadHistoryCSV);
  }

  // Load Report
  const loadReportBtn = document.getElementById("loadReportBtn");
  if (loadReportBtn) {
    loadReportBtn.addEventListener("click", loadReport);
  }

  // Download Report (TXT)
  const downloadReportBtn = document.getElementById("downloadReportBtn");
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", downloadReportTXT);
  }
});

// Fungsi render pelanggan
function renderCustomers(list) {
  const container = document.getElementById("customerList");
  if (!container) return;
  
  container.innerHTML = "";
  if (!list.length) {
    container.textContent = "Tidak ada pelanggan";
    return;
  }
  list.forEach((c) => {
    const div = document.createElement("div");
    div.className = "customer";
    div.textContent = ${c.name} - ${c.phone || '-'};
    container.appendChild(div);
  });
}

function loadCustomers() {
  if (!adminToken) return;
  
  fetch(${API_BASE_URL}/customers, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat pelanggan");
      }
      return res.json();
    })
    .then((data) => {
      customers = data;
      renderCustomers(customers);
      fillCustomerDropdown();
    })
    .catch((error) => {
      console.error("Load customers error:", error);
      alert("Gagal memuat pelanggan");
    });
}

function loadBills() {
  if (!adminToken) return;
  
  fetch(${API_BASE_URL}/bills, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat tagihan");
      }
      return res.json();
    })
    .then((bills) => {
      renderBills(bills);
    })
    .catch((error) => {
      console.error("Load bills error:", error);
      alert("Gagal memuat tagihan");
    });
}

function renderBills(bills) {
  const container = document.getElementById("billList");
  if (!container) return;
  
  container.innerHTML = "";
  if (!bills.length) {
    container.textContent = "Tidak ada tagihan";
    return;
  }
  bills.forEach((b) => {
    const div = document.createElement("div");
    div.className = "bill";
    div.innerHTML = `
      <p><strong>Pelanggan:</strong> ${b.customerName || 'Unknown'}</p>
      <p><strong>Jumlah:</strong> Rp ${b.amount.toLocaleString('id-ID')}</p>
      <p><strong>Jatuh tempo:</strong> ${b.dueDate}</p>
      <p><strong>Status:</strong> ${b.status === 'paid' ? 'Terbayar' : 'Belum Terbayar'}</p>
      ${b.status === 'unpaid' ? <button onclick="payBill(${b.id})">Bayar</button> : ''}
    `;
    container.appendChild(div);
  });
}

// Fungsi untuk membayar tagihan
function payBill(billId) {
  if (!adminToken) return;
  
  fetch(${API_BASE_URL}/bills/${billId}, {
    method: 'PATCH',
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || "Gagal membayar tagihan");
        });
      }
      return res.json();
    })
    .then(() => {
      alert("Tagihan berhasil dibayar");
      loadBills(); // Refresh the bills list
    })
    .catch((error) => {
      console.error("Pay bill error:", error);
      alert(error.message || "Gagal membayar tagihan");
    });
}

function loadHistory() {
  if (!adminToken) return;
  
  fetch(`${API_BASE_URL}/payments/history`, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat riwayat pembayaran");
      }
      return res.json();
    })
    .then((history) => {
      renderHistory(history);
    })
    .catch((error) => {
      console.error("Load history error:", error);
      alert("Gagal memuat riwayat pembayaran");
    });
}

function renderHistory(history) {
  const container = document.getElementById("historyList");
  if (!container) return;
  
  container.innerHTML = "";
  if (!history.length) {
    container.textContent = "Tidak ada riwayat pembayaran";
    return;
  }
  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.innerHTML = `
      <p><strong>Pelanggan:</strong> ${item.customerName || 'Unknown'}</p>
      <p><strong>Jumlah:</strong> Rp ${item.amount.toLocaleString('id-ID')}</p>
      <p><strong>Tanggal:</strong> ${item.date}</p>
    `;
    container.appendChild(div);
  });
}

function downloadHistoryCSV() {
  if (!adminToken) return;
  
  fetch(`${API_BASE_URL}/payments/history`, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat riwayat pembayaran");
      }
      return res.json();
    })
    .then((history) => {
      if (!history.length) {
        alert("Tidak ada riwayat untuk diunduh");
        return;
      }
      const csvHeader = "Customer Name,Amount,Date\n";
      const csvRows = history
        .map((h) => `"${h.customerName}",${h.amount},"${h.date}"`)
        .join("\n");
      const csvContent = csvHeader + csvRows;
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "payment_history.csv";
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Download history error:", error);
      alert("Gagal unduh riwayat pembayaran");
    });
}

function loadReport() {
  if (!adminToken) return;
  
  fetch(`${API_BASE_URL}/report`, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat laporan");
      }
      return res.text();
    })
    .then((reportText) => {
      const reportBox = document.getElementById("reportBox");
      if (reportBox) {
        reportBox.textContent = reportText;
      }
    })
    .catch((error) => {
      console.error("Load report error:", error);
      alert("Gagal memuat laporan");
    });
}

function searchCustomer(name) {
  if (!adminToken || !name || name.length < 3) {
    return;
  }
  
  fetch(`${API_BASE_URL}/customers/search?name=${encodeURIComponent(name)}`, {
    method: "GET",
    headers: {
      Authorization: adminToken,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.error || "Gagal mencari pelanggan");
        });
      }
      return res.json();
    })
    .then((data) => {
      renderCustomers(data);
    })
    .catch((error) => {
      console.error("Search customer error:", error);
      alert(error.message || "Gagal mencari pelanggan");
    });
}

function downloadReportTXT() {
  if (!adminToken) return;
  
  fetch(`${API_BASE_URL}/report`, {
    headers: { Authorization: adminToken },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal memuat laporan");
      }
      return res.text();
    })
    .then((reportText) => {
      const blob = new Blob([reportText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.txt";
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Download report error:", error);
      alert("Gagal unduh laporan");
    });
}