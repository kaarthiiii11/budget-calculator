let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let expenseChart = null;


/* ================= FORMAT MONEY ================= */

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}


/* ================= ADD INCOME ================= */

function addIncome() {

    let source =
        document.getElementById("incomeSource").value.trim();

    let amount =
        Number(document.getElementById("incomeAmount").value);


    if (source === "") {

        alert("Please enter income source.");

        return;

    }


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    let transaction = {

        id: Date.now(),

        type: "income",

        name: source,

        category: "Income",

        amount: amount,

        date: new Date().toLocaleDateString("en-IN")

    };


    transactions.push(transaction);

    saveTransactions();

    updateDashboard();


    document.getElementById("incomeSource").value = "";

    document.getElementById("incomeAmount").value = "";

}


/* ================= ADD EXPENSE ================= */

function addExpense() {

    let category =
        document.getElementById("expenseCategory").value.trim();

    let amount =
        Number(document.getElementById("expenseAmount").value);


    if (category === "") {

        alert("Please enter expense category.");

        return;

    }


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    let transaction = {

        id: Date.now(),

        type: "expense",

        name: category,

        category: category,

        amount: amount,

        date: new Date().toLocaleDateString("en-IN")

    };


    transactions.push(transaction);

    saveTransactions();

    updateDashboard();


    document.getElementById("expenseCategory").value = "";

    document.getElementById("expenseAmount").value = "";

}


/* ================= SAVE TRANSACTIONS ================= */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* ================= UPDATE DASHBOARD ================= */

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        }

        else if (transaction.type === "expense") {

            totalExpense += Number(transaction.amount);

        }

    });


    let balance = totalIncome - totalExpense;


    /* BALANCE */

    document.getElementById("balance").textContent =
        formatMoney(balance);


    /* TOTAL INCOME */

    document.getElementById("totalIncome").textContent =
        formatMoney(totalIncome);


    /* TOTAL EXPENSE */

    document.getElementById("totalExpense").textContent =
        formatMoney(totalExpense);


    /* SUMMARY */

    document.getElementById("summaryIncome").textContent =
        formatMoney(totalIncome);


    document.getElementById("summaryExpense").textContent =
        formatMoney(totalExpense);


    document.getElementById("summaryBalance").textContent =
        formatMoney(balance);


    /* UPDATE CHART */

    updateChart();


    /* UPDATE ACTIVITY */

    updateActivity();

}


/* ================= UPDATE CHART ================= */

function updateChart() {

    let categories = {};


    /*
        Create categories dynamically.

        Example:

        Food       → ₹500
        Travel     → ₹1000
        Shopping   → ₹2000
        Electricity → ₹800

        If the same category is entered again,
        the amount will be added to that category.
    */

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            let category =
                transaction.category.trim();


            if (categories[category]) {

                categories[category] +=
                    Number(transaction.amount);

            }

            else {

                categories[category] =
                    Number(transaction.amount);

            }

        }

    });


    let labels =
        Object.keys(categories);


    let values =
        Object.values(categories);


    /* DESTROY PREVIOUS CHART */

    if (expenseChart) {

        expenseChart.destroy();

        expenseChart = null;

    }


    let ctx =
        document.getElementById("expenseChart");


    /* ================= NO EXPENSES ================= */

    if (labels.length === 0) {

        expenseChart = new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: ["No expenses"],

                datasets: [{

                    data: [1],

                    backgroundColor: [

                        "#ded7e5"

                    ],

                    borderWidth: 0

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });


        updateChartLegend(categories);

        return;

    }


    /* ================= CHART COLORS ================= */

    let colors = [

        "#dc5c50",

        "#7052d1",

        "#f0ad4e",

        "#26945b",

        "#3498db",

        "#e67e22",

        "#9b59b6",

        "#1abc9c",

        "#34495e",

        "#e84393",

        "#16a085",

        "#d35400",

        "#8e44ad",

        "#2ecc71",

        "#2980b9"

    ];


    let backgroundColors = [];


    labels.forEach(function(category, index) {

        backgroundColors.push(

            colors[index % colors.length]

        );

    });


    /* ================= CREATE CHART ================= */

    expenseChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                backgroundColor: backgroundColors,

                borderWidth: 0

            }]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "65%",

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            let value =
                                context.raw;

                            return " " +
                                context.label +
                                ": " +
                                formatMoney(value);

                        }

                    }

                }

            }

        }

    });


    /* UPDATE LEGEND */

    updateChartLegend(categories);

}


/* ================= UPDATE CHART LEGEND ================= */

function updateChartLegend(categories) {

    let total = 0;


    /*
        Calculate total expense.
    */

    Object.values(categories).forEach(function(amount) {

        total += Number(amount);

    });


    let legend =
        document.getElementById("chartLegend");


    /*
        If there are no expenses.
    */

    if (Object.keys(categories).length === 0) {

        legend.innerHTML = `

            <div class="text-center text-muted mt-3">

                No expenses added yet.

            </div>

        `;

        return;

    }


    let html = "";


    /*
        Display every user-created category.
    */

    Object.keys(categories).forEach(function(category) {

        let amount =
            Number(categories[category]);


        let percentage = 0;


        if (total > 0) {

            percentage =
                Math.round(
                    (amount / total) * 100
                );

        }


        html += `

            <div class="d-flex justify-content-between
                        align-items-center mb-2">

                <span>

                    <i class="bi bi-circle-fill me-2"></i>

                    ${category}

                </span>


                <strong>

                    ${formatMoney(amount)}

                    (${percentage}%)

                </strong>

            </div>

        `;

    });


    legend.innerHTML = html;

}


/* ================= UPDATE ACTIVITY ================= */

function updateActivity() {

    let activity =
        document.getElementById("activityList");


    /*
        No transactions.
    */

    if (transactions.length === 0) {

        activity.innerHTML = `

            <div class="empty-message">

                <i class="bi bi-wallet2 fs-2 d-block mb-2"></i>

                No transactions yet

            </div>

        `;

        return;

    }


    /*
        Get latest 5 transactions.
    */

    let recent =
        transactions.slice(-5).reverse();


    let html = "";


    recent.forEach(function(transaction) {

        let icon = "bi-wallet2";

        let iconClass = "salary";


        /* ================= EXPENSE ICONS ================= */

        if (transaction.type === "expense") {

            icon = "bi-cash";

            iconClass = "food";


            let category =
                transaction.category.toLowerCase();


            /*
                Food
            */

            if (
                category.includes("food") ||
                category.includes("restaurant") ||
                category.includes("grocery")
            ) {

                icon = "bi-cup-hot";

                iconClass = "food";

            }


            /*
                Shopping
            */

            else if (
                category.includes("shop") ||
                category.includes("clothes")
            ) {

                icon = "bi-bag";

                iconClass = "shopping";

            }


            /*
                Bills
            */

            else if (
                category.includes("bill") ||
                category.includes("electric") ||
                category.includes("water") ||
                category.includes("internet")
            ) {

                icon = "bi-lightning-charge";

                iconClass = "bill";

            }


            /*
                Travel
            */

            else if (
                category.includes("travel") ||
                category.includes("taxi") ||
                category.includes("bus") ||
                category.includes("fuel")
            ) {

                icon = "bi-car-front";

                iconClass = "shopping";

            }

        }


        /* ================= SIGN ================= */

        let sign =
            transaction.type === "income"
                ? "+"
                : "-";


        /* ================= AMOUNT COLOR ================= */

        let amountClass =
            transaction.type === "income"
                ? "income-text"
                : "expense-text";


        /* ================= ACTIVITY HTML ================= */

        html += `

            <div class="activity-item d-flex
                        justify-content-between
                        align-items-center">


                <div class="d-flex
                            align-items-center gap-2">


                    <div class="activity-icon ${iconClass}">

                        <i class="bi ${icon}"></i>

                    </div>


                    <div>

                        <div class="fw-semibold">

                            ${transaction.name}

                        </div>


                        <small class="text-muted">

                            ${transaction.date}

                        </small>

                    </div>

                </div>


                <span class="${amountClass}">

                    ${sign}${formatMoney(transaction.amount)}

                </span>


            </div>

        `;

    });


    activity.innerHTML = html;

}


/* ================= CLEAR ALL RECORDS ================= */

function clearAllRecords() {

    /*
        Check whether there are records.
    */

    if (transactions.length === 0) {

        alert("There are no records to clear.");

        return;

    }


    /*
        Confirmation popup.
    */

    let confirmClear =
        confirm(
            "Are you sure you want to clear all income and expense records?"
        );


    if (!confirmClear) {

        return;

    }


    /*
        Clear transactions.
    */

    transactions = [];


    localStorage.removeItem("transactions");


    /*
        Update dashboard.
    */

    updateDashboard();


    alert("All records have been cleared.");

}


/* ================= PROFILE ================= */

function loadProfile() {

    let user =
        JSON.parse(localStorage.getItem("user"));


    if (
        user &&
        user.username
    ) {

        let profileElement =
            document.getElementById("profileName");


        if (profileElement) {

            profileElement.textContent =
                user.username;

        }

    }

}


/* ================= LOGOUT ================= */

function logoutUser() {

    /*
        Show confirmation popup.
    */

    let confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    /*
        If user clicks Cancel.
    */

    if (!confirmLogout) {

        return;

    }


    /*
        Remove logged-in user information.
    */

    localStorage.removeItem("user");


    /*
        Remove login status if it exists.
    */

    localStorage.removeItem("isLoggedIn");


    /*
        Show logout message.
    */

    alert(
        "You have been logged out successfully."
    );


    /*
        Redirect to login page.
    */

    window.location.href =
        "login.html";

}


/* ================= PAGE LOAD ================= */

loadProfile();

updateDashboard();