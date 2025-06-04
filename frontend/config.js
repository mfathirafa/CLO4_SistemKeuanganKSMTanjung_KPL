const config = {
  defaultStatus: "active",
  showLastPayment: true,
};

const statusMachine = {
  active: { toggle: "inactive" },
  inactive: { toggle: "active" },
};

// Table-driven construction for actions
const actionTable = {
  active: {
    actions: ["Edit", "Deactivate"],
    color: "green",
  },
  inactive: {
    actions: ["Edit", "Activate"],
    color: "red",
  },
};
