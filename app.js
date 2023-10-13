function formatPrice(price) {
  const digits = String(price).split("");
  let formatedString = "";
  for (let i = digits.length - 1, j = 0; i >= 0; i--, j++) {
    formatedString += digits[j];
    if (i % 3 === 0 && digits[j] !== "-") formatedString += " ";
  }

  return formatedString;
}

const addBudgetBtn = document.getElementById("add-budget");
const addExpenseBtn = document.getElementById("add-expense");
const budgetInput = document.getElementById("budget");
const expenseInput = document.getElementById("expense");
const amountInput = document.getElementById("amount");
const budgetValue = document.getElementById("budget-value");
const expenseValue = document.getElementById("expense-value");
const amountValue = document.getElementById("amount-value");
const resetValueBtn = document.getElementById("reset-value");
const historyBtn = document.getElementById("history-btn");

let storedData = {
  budget: 0,
  expense: 0,
  amount: 0,
  items: [],
};

let chart = null;

if (localStorage.getItem("data")) {
  storedData = JSON.parse(localStorage.getItem("data"));
}

budgetValue.textContent = storedData.budget
  ? `${formatPrice(storedData.budget)} F`
  : "0 F";
expenseValue.textContent = storedData.expense
  ? `${formatPrice(storedData.expense)} F`
  : "0 F";
amountValue.textContent = storedData.amount
  ? `${formatPrice(storedData.amount)} F`
  : "0 F";

function calculateBudget(budget) {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };

  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));

  storedData.budget += budget;
  storedData.amount = storedData.budget - storedData.expense;
  localStorage.setItem("data", JSON.stringify(storedData));
  budgetValue.textContent = storedData.budget
    ? `${formatPrice(storedData.budget)} F`
    : "0 F";
  budgetValue.textContent = storedData.budget
    ? `${formatPrice(storedData.budget)} F`
    : "0 F";

  amountValue.textContent = storedData.amount
    ? `${formatPrice(storedData.amount)} F`
    : "0 F";

  budgetInput.value = "";

  notification("Ajout de budget", "Votre budget a été ajouté avec succès.");
}

// Add

function addExpense(name, price) {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));

  let itemIndex = 0;
  const foundItem = storedData.items.find((item, index) => {
    itemIndex = index;
    return item.name === name;
  });

  if (foundItem) {
    storedData.items[itemIndex] = {
      ...foundItem,
      price: foundItem.price + price,
    };
  } else {
    if (storedData.items)
      storedData.items.push({
        id: storedData.items.length + 1,
        name,
        price,
      });
    else {
      storedData.items = [];
      storedData.items.push({
        id: storedData.items.length + 1,
        name,
        price,
      });
    }
  }

  storedData.expense = storedData.items
    .map((item) => item.price)
    .reduce((accumulator, item) => accumulator + item, 0);

  storedData.amount = storedData.budget - storedData.expense;

  localStorage.setItem("data", JSON.stringify(storedData));

  expenseValue.textContent = storedData.expense
    ? `${formatPrice(storedData.expense)} F`
    : "0 F";

  amountValue.textContent = storedData.amount
    ? `${formatPrice(storedData.amount)} F`
    : "0 F";

  notification("Ajout de dépense", "Votre dépense a été ajouté avec succès.");
}

// Edit

function editExpense(name, price, itemId) {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));

  let itemIndex = 0;
  const foundItem = storedData.items.find((item, index) => {
    itemIndex = index;
    return item.id === itemId;
  });

  storedData.items[itemIndex] = {
    ...foundItem,
    name,
    price,
  };

  storedData.expense = storedData.items
    .map((item) => item.price)
    .reduce((accumulator, item) => accumulator + item, 0);

  storedData.amount = storedData.budget - storedData.expense;

  localStorage.setItem("data", JSON.stringify(storedData));

  expenseValue.textContent = storedData.expense
    ? `${formatPrice(storedData.expense)} F`
    : "0 F";

  amountValue.textContent = storedData.amount
    ? `${formatPrice(storedData.amount)} F`
    : "0 F";

  addExpenseBtn.setAttribute("btn-action", "add");

  notification(
    "Modification de dépense",
    "Votre dépense a été modifié avec succès."
  );
}

// Delete

function deleteExpense(itemId) {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));

  const filtredItems = storedData.items.filter((item) => item.id !== itemId);
  storedData.items = filtredItems;
  storedData.expense = storedData.items
    .map((item) => item.price)
    .reduce((accumulator, item) => accumulator + item, 0);
  storedData.amount = storedData.budget - storedData.expense;
  localStorage.setItem("data", JSON.stringify(storedData));

  // A deplacer dans une fonction
  budgetValue.textContent = storedData.budget
    ? `${formatPrice(storedData.budget)} F`
    : "0 F";
  expenseValue.textContent = storedData.expense
    ? `${formatPrice(storedData.expense)} F`
    : "0 F";
  amountValue.textContent = storedData.amount
    ? `${formatPrice(storedData.amount)} F`
    : "0 F";
  //
  displayItems();

  notification(
    "Suppression de dépense",
    "Votre dépense a été supprimé avec succès."
  );
}

function displayItems() {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));
  const itemsDataTable = document.querySelector("#items-table tbody");

  itemsDataTable.innerHTML = "";

  if (storedData.items.length > 0) {
    storedData.items.map((item) => {
      const row = document.createElement("tr");
      const expenseTittle = document.createElement("td");
      const expenseValue = document.createElement("td");
      const actions = document.createElement("td");
      const editButton = document.createElement("span");
      const deleteButton = document.createElement("span");
      row.className = "border-b border-blue-300";
      actions.className = "text-center";
      editButton.className =
        "fa-solid fa-pen-to-square cursor-pointer text-blue-300 mr-3";
      editButton.id = `item-${item.id}`;
      deleteButton.className = "fa-solid fa-trash cursor-pointer text-red-500";
      deleteButton.id = `item-${item.id}`;
      expenseTittle.textContent = item.name;
      expenseValue.textContent = `${formatPrice(item.price)} F`;
      actions.appendChild(editButton);
      actions.appendChild(deleteButton);
      row.appendChild(expenseTittle);
      row.appendChild(expenseValue);
      row.appendChild(actions);
      itemsDataTable.appendChild(row);
      editButton.addEventListener("click", () => {
        const expenseInput = document.getElementById("expense");
        const amountInput = document.getElementById("amount");
        expenseInput.value = item.name;
        amountInput.value = item.price;
        addExpenseBtn.setAttribute("btn-action", "edit");
        expenseInput.setAttribute("item-id", item.id);
        // editExpense(item.id);
      });
      deleteButton.addEventListener("click", () => {
        deleteExpense(item.id);
      });
    });
  }
  if (chart) chart.destroy();
  showChart();
}

function chartRandomColor() {
  const randomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  };

  return `rgb(${randomInteger(0, 255)}, ${randomInteger(
    0,
    255
  )}, ${randomInteger(0, 255)})`; 
}

function showChart() {
  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));
  const data = [];
  const labels = [];
  storedData.items.forEach((item) => {
    data.push({
      value: item.price,
      color: chartRandomColor(),
      label: item.name,
    });

    labels.push(item.name);
  });

  // console.log(data);

  const ctx = document.getElementById("stats").getContext("2d");

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: data.map((d) => d.color),
        },
      ],
    },
    options: {
      cutout: 100,
    },
  });
}

function resetData() {
  localStorage.removeItem("data");
  budgetValue.textContent = "0 F";
  expenseValue.textContent = "0 F";
  amountValue.textContent = "0 F";
  displayItems();
}

function notification(title, message) {
  const notif = document.querySelector(".notif");
  const notifTitle = document.querySelector(".notif .notif-title");
  const notifMessage = document.querySelector(".notif .notif-message");

  notifTitle.textContent = title;
  notifMessage.textContent = message;

  notif.classList.remove("hidden");

  setTimeout(() => {
    notif.classList.add("hidden");
  }, 2000);
}

let isShow = false;

function historyDisplay() {
  const history = document.querySelector(".history");

  isShow = !isShow;

  if (isShow) {
    history.classList.remove("hidden");
  } else {
    history.classList.add("hidden");
  }

  let storedData = {
    budget: 0,
    expense: 0,
    amount: 0,
    items: [],
  };
  if (localStorage.getItem("data"))
    storedData = JSON.parse(localStorage.getItem("data"));
  const itemsDataTable = document.querySelector(".history-table tbody");

  itemsDataTable.innerHTML = "";

  if (storedData.items.length > 0) {
    storedData.items.map((item, index) => {
      const row = document.createElement("tr");
      const expenseTittle = document.createElement("td");
      const expenseValue = document.createElement("td");
      const actions = document.createElement("td");
      row.className = "border-b border-blue-300";
      actions.className = "";
      actions.textContent = index + 1 < 10 ? `0${index}` : index;
      expenseTittle.textContent = item.name;
      expenseValue.textContent = `${formatPrice(item.price)} F`;
      row.appendChild(actions);
      row.appendChild(expenseTittle);
      row.appendChild(expenseValue);
      itemsDataTable.appendChild(row);
    });
  }
}

historyBtn.addEventListener("click", historyDisplay);

resetValueBtn.addEventListener("click", resetData);

addBudgetBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (budgetInput.value === "" || budgetInput.value < 0) return;

  calculateBudget(Number(budgetInput.value));
});

addExpenseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    (amountInput.value < 0 && amountInput.value === "") ||
    expenseInput.value === ""
  )
    return;

  if (this.getAttribute("btn-action") === "add")
    addExpense(expenseInput.value, Number(amountInput.value));
  else
    editExpense(
      expenseInput.value,
      Number(amountInput.value),
      Number(expenseInput.getAttribute("item-id"))
    );
  expenseInput.value = "";
  amountInput.value = "";

  displayItems();
});

displayItems();
