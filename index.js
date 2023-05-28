const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

const DELETE = "delete";
const EDIT = "edit";
const ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

updateUI();

expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});

incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});

allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  if (
    !expenseTitle.value ||
    expenseAmount.value === "0" ||
    expenseAmount.value.startsWith("0")
  ) {
    alert("Wpisz poprawną kwotę.");
    return;
  }

  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value),
  };
  ENTRY_LIST.push(expense);

  updateUI();
  clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener("click", function () {
  if (
    !incomeTitle.value ||
    incomeAmount.value === "0" ||
    incomeAmount.value.startsWith("0")
  ) {
    alert("Wpisz poprawną kwotę.");
    return;
  }

  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseInt(incomeAmount.value),
  };
  ENTRY_LIST.push(income);

  updateUI();
  clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id === DELETE) {
    showDeleteConfirmation(entry);
  } else if (targetBtn.id === EDIT) {
    if (!entry.classList.contains("editing")) {
      openEditForm(entry);
    }
  }
}
function showDeleteConfirmation(entry) {
  const confirmDelete = confirm("Czy na pewno chcesz usunąć ten wpis?");
  if (confirmDelete) {
    const entryIndex = parseInt(entry.id);
    deleteEntry(entryIndex);
  }
}

function deleteEntry(entryIndex) {
  ENTRY_LIST.splice(entryIndex, 1);
  updateUI();
}
function openEditForm(entry) {
  const entryIndex = parseInt(entry.id);
  const ENTRY = ENTRY_LIST[entryIndex];

  if (ENTRY.type === "income") {
    incomeAmount.value = ENTRY.amount;
    incomeTitle.value = ENTRY.title;
  } else if (ENTRY.type === "expense") {
    expenseAmount.value = ENTRY.amount;
    expenseTitle.value = ENTRY.title;
  }

  showEditForm(entryIndex);
  entry.classList.add("editing");
  disableInputFields([expenseTitle, expenseAmount, incomeTitle, incomeAmount]);

  const editForm = document.querySelector(".edit-form");
  editForm.style.display = "flex";
  editForm.style.flexDirection = "column";
  editForm.style.alignItems = "center";
  editForm.style.padding = "18px";
  editForm.style.borderRadius = "5px";
  editForm.innerHTML = "";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = ENTRY_LIST[entryIndex].title;
  titleInput.style.marginBottom = "10px";

  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.value = ENTRY_LIST[entryIndex].amount;
  amountInput.style.marginBottom = "10px";

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Zapisz";
  saveBtn.style.backgroundColor = "#0466c8";
  saveBtn.style.color = "white";
  saveBtn.style.border = "none";
  saveBtn.style.padding = "10px 20px";
  saveBtn.style.cursor = "pointer";
  saveBtn.style.borderRadius = "5px";
  saveBtn.style.display = "flex";
  saveBtn.style.alignItems = "center";
  saveBtn.style.justifyContent = "center";
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Anuluj";
  cancelBtn.style.backgroundColor = "#f44336";
  cancelBtn.style.color = "white";
  cancelBtn.style.border = "none";
  cancelBtn.style.padding = "10px 20px";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.borderRadius = "5px";
  cancelBtn.style.display = "flex";
  cancelBtn.style.alignItems = "center";
  cancelBtn.style.justifyContent = "center";

  saveBtn.addEventListener("click", function () {
    const newTitle = titleInput.value;
    const newAmount = parseInt(amountInput.value);

    if (!newTitle || newAmount === 0 || newAmount.toString().startsWith("0")) {
      alert("Wpisz poprawną kwotę.");
      return;
    }

    ENTRY_LIST[entryIndex].title = newTitle;
    ENTRY_LIST[entryIndex].amount = newAmount;

    updateUI();
    hideEditForm();
  });

  cancelBtn.addEventListener("click", function () {
    hideEditForm();
  });

  buttonContainer.appendChild(saveBtn);
  buttonContainer.appendChild(cancelBtn);

  editForm.appendChild(titleInput);
  editForm.appendChild(amountInput);
  editForm.appendChild(buttonContainer);
}

function hideEditForm() {
  const editForms = document.getElementsByClassName("edit-form");
  const entries = document.getElementsByClassName("entry");

  while (editForms.length > 0) {
    editForms[0].parentNode.removeChild(editForms[0]);
  }

  for (let i = 0; i < entries.length; i++) {
    entries[i].classList.remove("editing");
  }
  enableInputFields([expenseTitle, expenseAmount, incomeTitle, incomeAmount]);
}
function disableInputFields(inputs) {
  inputs.forEach((input) => {
    input.disabled = true;
  });
}

function enableInputFields(inputs) {
  inputs.forEach((input) => {
    input.disabled = false;
  });
}

function showEditForm(entryIndex) {
  const ENTRY = ENTRY_LIST[entryIndex];

  const editForm = document.createElement("div");
  editForm.classList.add("edit-form");

  const entry = document.getElementById(entryIndex);
  entry.appendChild(editForm);
}

function updateUI() {
  const income = calculateTotal("income", ENTRY_LIST);
  const outcome = calculateTotal("expense", ENTRY_LIST);
  const balance = calculateBalance(income, outcome);
  const balanceMessage = getBalanceMessage(balance);

  balanceEl.innerHTML = balanceMessage;
  outcomeTotalEl.innerHTML = `${Math.abs(outcome)}<small>zł</small>`;
  incomeTotalEl.innerHTML = `${Math.max(income, 0)}<small>zł</small>`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.title, -entry.amount, index);
    } else if (entry.type === "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });

  updateChart(income, outcome);

  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function getBalanceMessage(balance) {
  if (balance > 0) {
    return `Możesz jeszcze wydać ${balance} złotych.`;
  } else if (balance === 0) {
    return "Bilans wynosi zero.";
  } else {
    return `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
      balance
    )} złotych.`;
  }
}

function showEntry(list, type, title, amount, id) {
  const sign = type === "expense" ? "-" : "";

  const entry = `<li id="${id}" class="${type}">
                    <div class="entry">${title}: ${sign}${Math.abs(
    amount
  )}zł</div>
                    <div id="edit"></div>
                    <div id="delete"></div>
                </li>`;

  const position = "afterbegin";

  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach((element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  });
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;

  list.forEach((entry) => {
    if (entry.type === type) {
      sum += entry.amount;
    }
  });

  return sum;
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("active");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("active");
  });
}
