// Dropdown menu
// document.addEventListener('DOMContentLoaded', function () {
//     const userInfo = document.getElementById('userInfo');
//     const dropdownMenu = document.getElementById('dropdownMenu');

//     userInfo.addEventListener('click', () => {
//         dropdownMenu.classList.toggle('show');
//     });

//     // ปิดเมนูเมื่อคลิกนอกพื้นที่
//     document.addEventListener('click', (e) => {
//         if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
//             ddropdownMenu.classList.remove('show');
//         }
//     });
// });

//tabs menu
document.addEventListener('DOMContentLoaded', function () {
    // ตั้งค่าเริ่มต้น
    const mainTabs = document.querySelectorAll('.tabs .tab');
    const expenseList = document.getElementById('expense-list');
    const incomeList = document.getElementById('income-list');

    if (expenseList) expenseList.style.display = 'block';
    if (incomeList) incomeList.style.display = 'none';
    if (mainTabs.length > 0) {
        mainTabs.forEach(t => t.classList.remove('active'));
        mainTabs[0].classList.add('active');
    }

    // คลิกแท็บ
    mainTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            mainTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabText = this.textContent.trim();
            if (tabText === 'Income') {
                incomeList.style.display = 'block';
                expenseList.style.display = 'none';
            } else {
                expenseList.style.display = 'block';
                incomeList.style.display = 'none';
            }
        });
    });
});

//side tabs
document.addEventListener('DOMContentLoaded', function () {
    // --- ตั้งค่าเริ่มต้นสำหรับ Side Panel ---
    const sideTabs = document.querySelectorAll('.side-tabs .tab');
    const sideExpenseList = document.getElementById('side-expense-list');
    const sideIncomeList = document.getElementById('side-income-list');

    // แสดงเฉพาะ Expenses ตอนเริ่มต้น
    if (sideExpenseList) sideExpenseList.style.display = 'block';
    if (sideIncomeList) sideIncomeList.style.display = 'none';
    if (sideTabs.length > 0) {
        sideTabs.forEach(t => t.classList.remove('active'));
        sideTabs[0].classList.add('active'); // สมมติว่าแท็บแรกคือ Expenses
    }

    // --- จัดการการคลิกแท็บใน Side Panel ---
    sideTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            sideTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabText = this.textContent.trim();
            if (tabText === 'Income') {
                if (sideIncomeList) sideIncomeList.style.display = 'block';
                if (sideExpenseList) sideExpenseList.style.display = 'none';
            } else {
                if (sideExpenseList) sideExpenseList.style.display = 'block';
                if (sideIncomeList) sideIncomeList.style.display = 'none';
            }
        });
    });
});

// filter switch tag expense between income
document.addEventListener("DOMContentLoaded", function () {
    const expenseSelect = document.getElementById("tag-select-expense");
    const incomeSelect = document.getElementById("tag-select-income");
    const tabExpense = document.getElementById("expense-tab");
    const tabIncome = document.getElementById("income-tab");

    function activateTab(selectedTab) {
        // สลับ class active
        tabExpense.classList.remove("active");
        tabIncome.classList.remove("active");
        selectedTab.classList.add("active");

        // สลับการแสดง select
        if (selectedTab === tabExpense) {
            expenseSelect.style.display = "block";
            incomeSelect.style.display = "none";
        } else {
            expenseSelect.style.display = "none";
            incomeSelect.style.display = "block";
        }
    }

    tabExpense.addEventListener("click", function () {
        activateTab(tabExpense);
    });

    tabIncome.addEventListener("click", function () {
        activateTab(tabIncome);
    });

    // เริ่มต้น: แสดงเฉพาะ expense
    activateTab(tabExpense);
});

// --- Pagination Variables ---
let expensePage = 1;
const expensePerPage = 5;
let incomePage = 1;
const incomePerPage = 5;

// ---------------- EXPENSE ----------------

// ฟังก์ชันเพิ่ม expense item ลง UI พร้อมปุ่มลบ
function addExpenseItemToList(item, idx) {
    const expenseList = document.getElementById('expense-list');
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
        <div class="expense-icon ${item.tag.toLowerCase()}">
            <span>${item.tag === 'Home' ? '&#8962;' : item.tag === 'Food' ? '&#127828;' : item.tag === 'Shopping' ? '&#128722;' : '&#128176;'}</span>
        </div>
        <div class="expense-details">
            <div class="expense-title">${item.tag}</div>
            <div class="expense-sub">${item.note ? item.note : ''}</div>
            <div class="expense-date">${new Date(item.date).toLocaleString()}</div>
        </div>
        <div class="expense-amount">
            <div>${parseFloat(item.amount).toFixed(2)}</div>
        </div>
        <button class="expense-delete-btn" data-idx="${idx}" title="ลบรายการนี้">
            <span>&#128465;</span>
        </button>
    `;
    expenseList.appendChild(div);

    // กำหนด event ปุ่มลบ
    const deleteBtn = div.querySelector('.expense-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
            let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.splice(idx, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenseListFiltered();
            updateExpenseSummary();
            updateGainLoss();
        });
    }
}

// ฟังก์ชันแสดงปุ่มแบ่งหน้า
function renderExpensePagination(totalPages) {
    const expenseList = document.getElementById('expense-list');
    let pagination = document.createElement('div');
    pagination.className = 'expense-pagination';
    pagination.innerHTML = `
        <button id="expense-prev" ${expensePage === 1 ? "disabled" : ""}>ก่อนหน้า</button>
        <span>หน้า ${expensePage} / ${totalPages}</span>
        <button id="expense-next" ${expensePage === totalPages ? "disabled" : ""}>ถัดไป</button>
    `;
    expenseList.appendChild(pagination);

    pagination.querySelector('#expense-prev').onclick = function () {
        if (expensePage > 1) {
            expensePage--;
            renderExpenseListFiltered();
        }
    };
    pagination.querySelector('#expense-next').onclick = function () {
        if (expensePage < totalPages) {
            expensePage++;
            renderExpenseListFiltered();
        }
    };
}

// ฟังก์ชันกรองและแบ่งหน้า expense
function renderExpenseListFiltered() {
    const expenseList = document.getElementById('expense-list');
    let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    // Filter
    const dateSelect = document.getElementById('date-select');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const tagSelect = document.getElementById('tag-select-expense');

    let filtered = expenses;

    // Filter by date
    if (dateSelect && dateSelect.value && dateSelect.style.display !== 'none') {
        const now = new Date();
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            switch (dateSelect.value) {
                case "Today":
                    return itemDate.toDateString() === now.toDateString();
                case "Yesterday":
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    return itemDate.toDateString() === yesterday.toDateString();
                case "Last 7 Days":
                    const sevenDaysAgo = new Date(now);
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return itemDate >= sevenDaysAgo && itemDate <= now;
                case "Last 30 Days":
                    const thirtyDaysAgo = new Date(now);
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return itemDate >= thirtyDaysAgo && itemDate <= now;
                default: return true;
            }
        });
    }
    // Filter by month
    if (monthSelect && monthSelect.value && monthSelect.style.display !== 'none') {
        const monthIndex = monthSelect.selectedIndex;
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === monthIndex;
        });
    }
    // Filter by year
    if (yearSelect && yearSelect.value && yearSelect.style.display !== 'none') {
        const selectedYear = parseInt(yearSelect.value);
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === selectedYear;
        });
    }
    // Filter by Tag
    if (tagSelect && tagSelect.value && tagSelect.value !== "All Tags") {
        filtered = filtered.filter(item => item.tag === tagSelect.value);
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / expensePerPage));
    if (expensePage > totalPages) expensePage = totalPages;

    const showList = filtered.slice((expensePage - 1) * expensePerPage, expensePage * expensePerPage);

    expenseList.innerHTML = '';
    showList.forEach((item, idx) => addExpenseItemToList(item, idx + (expensePage - 1) * expensePerPage));

    if (filtered.length > expensePerPage) {
        renderExpensePagination(totalPages);
    }
}

// ---------------- INCOME ----------------

// ฟังก์ชันเพิ่ม income item ลง UI พร้อมปุ่มลบ
function addIncomeItemToList(item, idx) {
    const incomeList = document.getElementById('income-list');
    const div = document.createElement('div');
    div.className = 'income-item';
    div.innerHTML = `
        <div class="income-icon ${item.tag.toLowerCase()}">
            <span>${item.tag === 'Salary' ? '&#128188;' : item.tag === 'Freelance' ? '&#128187;' : item.tag === 'Gift' ? '&#127873;' : '&#128176;'}</span>
        </div>
        <div class="income-details">
            <div class="income-title">${item.tag}</div>
            <div class="income-sub">${item.note ? item.note : ''}</div>
            <div class="income-date">${new Date(item.date).toLocaleString()}</div>
        </div>
        <div class="income-amount">
            <div>${parseFloat(item.amount).toFixed(2)}</div>
        </div>
        <button class="income-delete-btn" data-idx="${idx}" title="ลบรายการนี้">
            <span>&#128465;</span>
        </button>
    `;
    incomeList.appendChild(div);

    // กำหนด event ปุ่มลบ
    const deleteBtn = div.querySelector('.income-delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
            let incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
            incomes.splice(idx, 1);
            localStorage.setItem('incomes', JSON.stringify(incomes));
            renderIncomeListFiltered();
            updateGainLoss();
        });
    }
}

// ฟังก์ชันแสดงปุ่มแบ่งหน้า
function renderIncomePagination(totalPages) {
    const incomeList = document.getElementById('income-list');
    let pagination = document.createElement('div');
    pagination.className = 'income-pagination';
    pagination.innerHTML = `
        <button id="income-prev" ${incomePage === 1 ? "disabled" : ""}>ก่อนหน้า</button>
        <span>หน้า ${incomePage} / ${totalPages}</span>
        <button id="income-next" ${incomePage === totalPages ? "disabled" : ""}>ถัดไป</button>
    `;
    incomeList.appendChild(pagination);

    pagination.querySelector('#income-prev').onclick = function () {
        if (incomePage > 1) {
            incomePage--;
            renderIncomeListFiltered();
        }
    };
    pagination.querySelector('#income-next').onclick = function () {
        if (incomePage < totalPages) {
            incomePage++;
            renderIncomeListFiltered();
        }
    };
}

// ฟังก์ชันกรองและแบ่งหน้า income
function renderIncomeListFiltered() {
    const incomeList = document.getElementById('income-list');
    let incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
    // Filter
    const dateSelect = document.getElementById('date-select');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const tagSelect = document.getElementById('tag-select-income');

    let filtered = incomes;

    // Filter by date
    if (dateSelect && dateSelect.value && dateSelect.style.display !== 'none') {
        const now = new Date();
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            switch (dateSelect.value) {
                case "Today":
                    return itemDate.toDateString() === now.toDateString();
                case "Yesterday":
                    const yesterday = new Date(now);
                    yesterday.setDate(now.getDate() - 1);
                    return itemDate.toDateString() === yesterday.toDateString();
                case "Last 7 Days":
                    const sevenDaysAgo = new Date(now);
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return itemDate >= sevenDaysAgo && itemDate <= now;
                case "Last 30 Days":
                    const thirtyDaysAgo = new Date(now);
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return itemDate >= thirtyDaysAgo && itemDate <= now;
                default: return true;
            }
        });
    }
    // Filter by month
    if (monthSelect && monthSelect.value && monthSelect.style.display !== 'none') {
        const monthIndex = monthSelect.selectedIndex;
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === monthIndex;
        });
    }
    // Filter by year
    if (yearSelect && yearSelect.value && yearSelect.style.display !== 'none') {
        const selectedYear = parseInt(yearSelect.value);
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === selectedYear;
        });
    }
    // Filter by Tag
    if (tagSelect && tagSelect.value && tagSelect.value !== "All Tags") {
        filtered = filtered.filter(item => item.tag === tagSelect.value);
    }

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / incomePerPage));
    if (incomePage > totalPages) incomePage = totalPages;

    const showList = filtered.slice((incomePage - 1) * incomePerPage, incomePage * incomePerPage);

    incomeList.innerHTML = '';
    showList.forEach((item, idx) => addIncomeItemToList(item, idx + (incomePage - 1) * incomePerPage));

    if (filtered.length > incomePerPage) {
        renderIncomePagination(totalPages);
    }
}

// ----- ADD/SUBMIT FORM -----

// Handle side income form submission and add to income-list
document.addEventListener('DOMContentLoaded', function () {
    const sideIncomeForm = document.getElementById('side-income-form');
    const sideSaveIncomeBtn = document.getElementById('side-save-income-btn');
    const incomeList = document.getElementById('income-list');

    if (sideIncomeForm && sideSaveIncomeBtn && incomeList) {
        sideIncomeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const tagSelect = sideIncomeForm.querySelector('select.side-tag-select');
            const amountInput = sideIncomeForm.querySelector('input.side-amount-input');
            const noteInput = sideIncomeForm.querySelector('textarea.side-note-input');

            const tag = tagSelect ? tagSelect.value : '';
            const amount = amountInput ? amountInput.value : '';
            const note = noteInput ? noteInput.value : '';

            if (tag === 'Select Tag' || !amount) {
                alert('Please select a tag and enter an amount.');
                return;
            }

            // สร้างข้อมูล income พร้อมวันที่
            const incomeItem = {
                tag: tag,
                amount: amount,
                note: note,
                date: new Date().toISOString()
            };

            // อ่านข้อมูลเดิมจาก localStorage แล้วเพิ่มข้อมูลใหม่
            let incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
            incomes.push(incomeItem);
            localStorage.setItem('incomes', JSON.stringify(incomes));

            renderIncomeListFiltered();

            // รีเซ็ตฟอร์ม
            if (tagSelect) tagSelect.selectedIndex = 0;
            if (amountInput) amountInput.value = '';
            if (noteInput) noteInput.value = '';
            sideIncomeForm.style.display = 'none';

            // อัปเดตสรุปรายรับ (ถ้ามีฟังก์ชันนี้)
            updateExpenseSummary();
            updateGainLoss();
            resetSidePreview();
        });

        // แสดงฟอร์มเมื่อคลิก Add Transaction
        const addIncomeBtn = document.querySelector('.side-add-income-btn');
        if (addIncomeBtn) {
            addIncomeBtn.addEventListener('click', function () {
                sideIncomeForm.style.display = 'block';
            });
        }
    }
});

// Handle side expense form submission and add to expense-list
document.addEventListener('DOMContentLoaded', function () {
    const sideExpenseForm = document.getElementById('side-expense-form');
    const sideSaveBtn = document.getElementById('side-save-expense-btn');
    const expenseList = document.getElementById('expense-list');
    if (sideExpenseForm && sideSaveBtn && expenseList) {
        sideExpenseForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const tagSelect = sideExpenseForm.querySelector('select.side-tag-select');
            const amountInput = sideExpenseForm.querySelector('input.side-amount-input');
            const noteInput = sideExpenseForm.querySelector('textarea.side-note-input');
            const tag = tagSelect ? tagSelect.value : '';
            const amount = amountInput ? amountInput.value : '';
            const note = noteInput ? noteInput.value : '';
            if (tag === 'Select Tag' || !amount) {
                alert('Please select a tag and enter an amount.');
                return;
            }

            // สร้างข้อมูล expense พร้อมวันที่
            const expenseItem = {
                tag: tag,
                amount: amount,
                note: note,
                date: new Date().toISOString()
            };

            // อ่านข้อมูลเดิมจาก localStorage แล้วเพิ่มข้อมูลใหม่
            let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.push(expenseItem);
            localStorage.setItem('expenses', JSON.stringify(expenses));

            renderExpenseListFiltered();

            // Reset form
            if (tagSelect) tagSelect.selectedIndex = 0;
            if (amountInput) amountInput.value = '';
            if (noteInput) noteInput.value = '';
            sideExpenseForm.style.display = 'none';

            // Update summary after adding new expense
            updateExpenseSummary();
            updateGainLoss();
            resetSidePreview();
        });

        // Show form when Add Transaction is clicked
        const addTransactionBtn = document.querySelector('.side-add-transaction-btn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', function () {
                sideExpenseForm.style.display = 'block';
            });
        }
    }
});

// เพิ่ม event listener ให้กับ filter ทุกตัว
document.addEventListener('DOMContentLoaded', function () {
    const expenseFilters = [
        document.getElementById('date-select'),
        document.getElementById('month-select'),
        document.getElementById('year-select'),
        document.getElementById('tag-select-expense')
    ];
    expenseFilters.forEach(el => {
        if (el) el.addEventListener('change', function () {
            expensePage = 1;
            renderExpenseListFiltered();
        });
    });

    const incomeFilters = [
        document.getElementById('date-select'),
        document.getElementById('month-select'),
        document.getElementById('year-select'),
        document.getElementById('tag-select-income')
    ];
    incomeFilters.forEach(el => {
        if (el) el.addEventListener('change', function () {
            incomePage = 1;
            renderIncomeListFiltered();
        });
    });

    renderExpenseListFiltered();
    renderIncomeListFiltered();
});

// --- Real-time update (Expense) ---
function setupExpenseRealTimeUpdates() {
    const noteInput = document.querySelector('#side-expense-form .side-note-input');
    const subDisplay = document.getElementById('side-expense-sub');
    if (noteInput && subDisplay) {
        noteInput.addEventListener('input', function() {
            subDisplay.textContent = noteInput.value;
        });
    }

    const tagSelect = document.querySelector('#side-expense-form .side-tag-select');
    const titleDisplay = document.getElementById('side-expense-title');
    if (tagSelect && titleDisplay) {
        tagSelect.addEventListener('change', function() {
            titleDisplay.textContent = tagSelect.value === 'Select Tag' ? 'Select Tag' : tagSelect.value;
        });
    }

    const amountInput = document.querySelector('#side-expense-form .side-amount-input');
    const amountDisplay = document.getElementById('side-expense-amount');
    if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', function() {
            amountDisplay.textContent = amountInput.value;
        });
    }
}

// --- Real-time update (Income) ---
function setupIncomeRealTimeUpdates() {
    const noteInput = document.querySelector('#side-income-form .side-note-input');
    const subDisplay = document.getElementById('side-income-sub');
    if (noteInput && subDisplay) {
        noteInput.addEventListener('input', function() {
            subDisplay.textContent = noteInput.value;
        });
    }

    const tagSelect = document.querySelector('#side-income-form .side-tag-select');
    const titleDisplay = document.getElementById('side-income-title');
    if (tagSelect && titleDisplay) {
        tagSelect.addEventListener('change', function() {
            titleDisplay.textContent = tagSelect.value === 'Select Tag' ? 'Select Tag' : tagSelect.value;
        });
    }

    const amountInput = document.querySelector('#side-income-form .side-amount-input');
    const amountDisplay = document.getElementById('side-income-amount');
    if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', function() {
            amountDisplay.textContent = amountInput.value;
        });
    }
}

// --- Reset preview function ---
function resetSidePreview() {
    const defaults = {
        'side-expense-title': 'Select Tag',
        'side-expense-sub': 'Note',
        'side-expense-amount': '0',
        'side-income-title': 'Select Tag',
        'side-income-sub': 'Note',
        'side-income-amount': '0'
    };

    Object.keys(defaults).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = defaults[id];
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function () {
    setupExpenseRealTimeUpdates();
    setupIncomeRealTimeUpdates();
});


// Side Expense List Toggle
document.addEventListener('DOMContentLoaded', function() {
    const addTransBtn = document.querySelector('.side-add-expense-btn');
    const form = document.querySelector('.side-expense-form');
    if (addTransBtn && form) {
        addTransBtn.addEventListener('click', function() {
            addTransBtn.style.display = 'none';
            form.style.display = 'block';
        });
        // ซ่อนฟอร์มหลังจาก Submit หรือกด Back
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.style.display = 'none';
            addTransBtn.style.display = 'flex';
        });
        const addMoreBtn = form.querySelector('.side-add-more-btn');
        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                form.style.display = 'none';
                addTransBtn.style.display = 'flex';
            });
        }
    }
});
// Side Income list toggle
document.addEventListener('DOMContentLoaded', function() {
    const addIncomeBtn = document.querySelector('.side-add-income-btn');
    const incomeForm = document.querySelector('.side-income-form');

    if (addIncomeBtn && incomeForm) {
        addIncomeBtn.addEventListener('click', function() {
            addIncomeBtn.style.display = 'none';
            incomeForm.style.display = 'block';
        });

        // ซ่อนฟอร์มหลังจาก Submit หรือกด Add More
        incomeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            incomeForm.style.display = 'none';
            addIncomeBtn.style.display = 'flex';
        });

        const addMoreBtn = incomeForm.querySelector('.side-add-more-btn');
        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                incomeForm.style.display = 'none';
                addIncomeBtn.style.display = 'flex';
            });
        }
    }
});

// Show only relevant filter when clicking summary-cards
document.addEventListener('DOMContentLoaded', function () {
    const dayCard = document.querySelector('.summary-card.day');
    const monthCard = document.querySelector('.summary-card.month');
    const yearCard = document.querySelector('.summary-card.year');
    const dateSelect = document.getElementById('date-select');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    function showOnly(select) {
        // Hide all
        dateSelect.style.display = 'none';
        monthSelect.style.display = 'none';
        yearSelect.style.display = 'none';
        // Show only the selected
        if (select) select.style.display = '';
    }

    if (dayCard) {
        dayCard.addEventListener('click', function () {
            showOnly(dateSelect);
        });
    }
    if (monthCard) {
        monthCard.addEventListener('click', function () {
            showOnly(monthSelect);
        });
    }
    if (yearCard) {
        yearCard.addEventListener('click', function () {
            showOnly(yearSelect);
        });
    }

    // Default: show only day filter
    dateSelect.style.display = '';
    monthSelect.style.display = 'none';
    yearSelect.style.display = 'none';

    renderExpenseListFiltered();
    renderIncomeListFiltered();
});

// summary-card
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.summary-card');
    if (cards.length > 0) {
    cards[0].classList.add('active');
  }
  cards.forEach(card => {
    card.addEventListener('click', function() {
      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// side-panel date
document.addEventListener('DOMContentLoaded', function() {
  const sideMonth = document.getElementById('side-month');
  const sideDate = document.getElementById('side-date');
  const today = new Date();
  const options = { month: '2-digit' ,day: '2-digit', year: 'numeric' };
  sideMonth.textContent = today.toLocaleDateString('en-US', { month: 'long' });
  sideDate.textContent = today.toLocaleDateString('TH', options);
});

// สรุป income/expense/balance สำหรับแต่ละช่วงใน summary-cards
function updateSummaryCards() {
    let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    let incomes = JSON.parse(localStorage.getItem('incomes') || '[]');
    const now = new Date();

    // DAY
    let expenseDay = 0;
    let incomeDay = 0;
    expenses.forEach(item => {
        if (new Date(item.date).toDateString() === now.toDateString()) {
            expenseDay += parseFloat(item.amount) || 0;
        }
    });
    incomes.forEach(item => {
        if (new Date(item.date).toDateString() === now.toDateString()) {
            incomeDay += parseFloat(item.amount) || 0;
        }
    });
    document.getElementById('income-day').textContent = incomeDay.toFixed(2);
    document.getElementById('expense-day').textContent = expenseDay.toFixed(2);
    document.getElementById('balance-day').textContent = (incomeDay - expenseDay).toFixed(2);

    // MONTH
    let expenseMonth = 0;
    let incomeMonth = 0;
    let m = now.getMonth(), y = now.getFullYear();
    expenses.forEach(item => {
        const d = new Date(item.date);
        if (d.getMonth() === m && d.getFullYear() === y) {
            expenseMonth += parseFloat(item.amount) || 0;
        }
    });
    incomes.forEach(item => {
        const d = new Date(item.date);
        if (d.getMonth() === m && d.getFullYear() === y) {
            incomeMonth += parseFloat(item.amount) || 0;
        }
    });
    document.getElementById('income-month').textContent = incomeMonth.toFixed(2);
    document.getElementById('expense-month').textContent = expenseMonth.toFixed(2);
    document.getElementById('balance-month').textContent = (incomeMonth - expenseMonth).toFixed(2);

    // YEAR
    let expenseYear = 0;
    let incomeYear = 0;
    let yy = now.getFullYear();
    expenses.forEach(item => {
        const d = new Date(item.date);
        if (d.getFullYear() === yy) {
            expenseYear += parseFloat(item.amount) || 0;
        }
    });
    incomes.forEach(item => {
        const d = new Date(item.date);
        if (d.getFullYear() === yy) {
            incomeYear += parseFloat(item.amount) || 0;
        }
    });
    document.getElementById('income-year').textContent = incomeYear.toFixed(2);
    document.getElementById('expense-year').textContent = expenseYear.toFixed(2);
    document.getElementById('balance-year').textContent = (incomeYear - expenseYear).toFixed(2);
}

// เรียกอัปเดต summary cards ทุกครั้งที่เปลี่ยนข้อมูล
function updateExpenseSummary() {
    const expenseAmountEls = document.querySelectorAll('.expense-amount > div:first-child');
    let total = 0;
    expenseAmountEls.forEach(el => {
        const val = parseFloat(el.textContent);
        if (!isNaN(val)) total += val;
    });
    // document.getElementById('amount-day').textContent = total.toFixed(2);
    // document.getElementById('amount-month').textContent = total.toFixed(2);
    // document.getElementById('amount-year').textContent = total.toFixed(2);
    updateSummaryCards();
}

function updateGainLoss() {
    // Gain
    const incomeAmountEls = document.querySelectorAll('#income-list .income-amount > div:first-child');
    let totalIncome = 0;
    incomeAmountEls.forEach(el => {
        const val = parseFloat(el.textContent);
        if (!isNaN(val)) totalIncome += val;
    });

    // Loss
    const expenseAmountEls = document.querySelectorAll('#expense-list .expense-amount > div:first-child');
    let totalExpense = 0;
    expenseAmountEls.forEach(el => {
        const val = parseFloat(el.textContent);
        if (!isNaN(val)) totalExpense += val;
    });

    // Update Gain / Loss
    const gainEl = document.getElementById('gain-amount');
    const lossEl = document.getElementById('loss-amount');
    if (gainEl) gainEl.textContent = totalIncome.toFixed(2);
    if (lossEl) lossEl.textContent = totalExpense.toFixed(2);

    // Update Current Money
    const balanceEl = document.querySelector('.side-balance');
    if (balanceEl) balanceEl.textContent = (totalIncome - totalExpense).toFixed(2);

    updateSummaryCards();
}

document.addEventListener('DOMContentLoaded', function () {
    renderExpenseListFiltered();
    renderIncomeListFiltered();
    updateExpenseSummary();
    updateGainLoss();
    updateSummaryCards();
});
