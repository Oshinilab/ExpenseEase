
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transactionList");

const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");
const balanceDisplay = document.getElementById("balance");

// Save transactions in the browser
let transactions = [];

try {
    transactions = JSON.parse(
        localStorage.getItem("expenseEaseTransactions")
    ) || [];
} catch (error) {
    transactions = [];
}

// Set today's date automatically
dateInput.value = new Date().toISOString().slice(0, 10);

function saveTransactions() {
    localStorage.setItem(
        "expenseEaseTransactions",
        JSON.stringify(transactions)
    );
}

function formatMoney(amount) {
    return "Rs. " + amount.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function renderTransactions() {
    transactionList.replaceChildren();

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(function (transaction) {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            totalIncome += amount;
        } else {
            totalExpenses += amount;
        }

        const row = document.createElement("tr");

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(amount);

        const typeCell = document.createElement("td");
        typeCell.textContent =
            transaction.type === "income" ? "Income" : "Expense";

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.style.backgroundColor = "#dc2626";

        deleteButton.addEventListener("click", function () {
            transactions = transactions.filter(function (item) {
                return item.id !== transaction.id;
            });

            saveTransactions();
            renderTransactions();
        });

        actionCell.appendChild(deleteButton);

        row.append(
            descriptionCell,
            amountCell,
            typeCell,
            dateCell,
            actionCell
        );

        transactionList.appendChild(row);
    });

    incomeDisplay.textContent = formatMoney(totalIncome);
    expensesDisplay.textContent = formatMoney(totalExpenses);
    balanceDisplay.textContent = formatMoney(totalIncome - totalExpenses);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const date = dateInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
        alert("Please enter a valid description, amount and date.");
        return;
    }

    const transaction = {
        id: Date.now() + Math.random(),
        description: description,
        amount: amount,
        type: type,
        date: date
    };

    transactions.unshift(transaction);

    saveTransactions();
    renderTransactions();

    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);
});

renderTransactions();
