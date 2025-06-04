function toggleStatus(current) {
  return statusMachine[current]?.toggle || current;
}

function renderCustomers(data) {
  const customerList = document.getElementById("customerList");
  customerList.innerHTML = "";

  if (data.length === 0) {
    customerList.innerHTML = "<p>Tidak ada pelanggan yang ditemukan.</p>";
    return;
  }

  data.forEach(({ name, phone, status, lastPayment }) => {
    const { actions, color } = actionTable[status] || {
      actions: [],
      color: "gray",
    };

    const div = document.createElement("div");
    div.classList.add("customer");
    div.innerHTML = `
      <span>${_.capitalize(name)}</span>
      <span>${phone}</span>
      <span class="status ${status}" style="background-color: ${color};">${_.capitalize(
      status
    )}</span>
      ${
        config.showLastPayment
          ? `<span>Last payment: ${lastPayment}</span>`
          : ""
      }
      ${actions.map((action) => `<button>${action}</button>`).join("")}
    `;

    // Event listener untuk tombol
    const buttons = div.querySelectorAll("button");
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const action = actions[index];
        if (action === "Edit") {
          alert(`Edit pelanggan: ${name}`);
        } else if (action === "Activate" || action === "Deactivate") {
          const newStatus = toggleStatus(status);

          // Kirim PATCH ke backend
          fetch(`http://localhost:3000/customers/${encodeURIComponent(name)}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          })
            .then((res) => res.json())
            .then((updated) => {
              // Perbarui data lokal
              const updatedCustomer = data.find((c) => c.name === name);
              if (updatedCustomer) {
                updatedCustomer.status = updated.status;
              }
              renderCustomers(data);
            });
        }
      });
    });

    customerList.appendChild(div);
  });
}
