// Dropdown menu
document.addEventListener('DOMContentLoaded', function () {
    const userInfo = document.getElementById('userInfo');
    const dropdownMenu = document.getElementById('dropdownMenu');

    userInfo.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // ปิดเมนูเมื่อคลิกนอกพื้นที่
    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target) && !dropdownMenu.contains(e.target)) {
            ddropdownMenu.classList.remove('show');
        }
    });
});

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

            // สร้างรายการ income ใหม่
            const item = document.createElement('div');
            item.className = 'income-item';
            item.innerHTML = `
                <div class="income-icon ${tag.toLowerCase()}">
                    <span>${tag === 'Salary' ? '&#128188;' : tag === 'Freelance' ? '&#128187;' : tag === 'Gift' ? '&#127873;' : '&#128176;'}</span>
                </div>
                <div class="income-details">
                    <div class="income-title">${tag}</div>
                    <div class="income-sub">${note ? note : ''}</div>
                </div>
                <div class="income-amount">
                    <div>${parseFloat(amount).toFixed(2)}</div>
                    <div class="income-trans">1 Transaction</div>
                </div>
                <div class="income-menu">&#8942;</div>
            `;

            incomeList.appendChild(item);

            // รีเซ็ตฟอร์ม
            if (tagSelect) tagSelect.selectedIndex = 0;
            if (amountInput) amountInput.value = '';
            if (noteInput) noteInput.value = '';
            sideIncomeForm.style.display = 'none';

            // อัปเดตสรุปรายรับ (ถ้ามีฟังก์ชันนี้)
            updateGainLoss();
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
            // Use name attributes for more robust selection
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
            // Create new expense item
            const item = document.createElement('div');
            item.className = 'expense-item';
            item.innerHTML = `
                <div class="expense-icon ${tag.toLowerCase()}">
                    <span>${tag === 'Home' ? '&#8962;' : tag === 'Food' ? '&#127828;' : tag === 'Shopping' ? '&#128722;' : '&#128176;'}</span>
                </div>
                <div class="expense-details">
                    <div class="expense-title">${tag}</div>
                    <div class="expense-sub">${note ? note : ''}</div>
                </div>
                <div class="expense-amount">
                    <div>${parseFloat(amount).toFixed(2)}</div>
                    <div class="expense-trans">1 Transaction</div>
                </div>
                <div class="expense-menu">&#8942;</div>
            `;
            expenseList.appendChild(item);
            // Reset form
            if (tagSelect) tagSelect.selectedIndex = 0;
            if (amountInput) amountInput.value = '';
            if (noteInput) noteInput.value = '';
            sideExpenseForm.style.display = 'none';
            // Update summary after adding new expense
            updateExpenseSummary();
            updateGainLoss();
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
// Real-time update of note to #side-expense-sub, tag to #side-expense-title, and amount to #side-expense-amount
document.addEventListener('DOMContentLoaded', function() {
    const noteInput = document.querySelector('.side-note-input');
    const subDisplay = document.getElementById('side-expense-sub');
    if (noteInput && subDisplay) {
        noteInput.addEventListener('input', function() {
            subDisplay.textContent = noteInput.value;
        });
    }

    const tagSelect = document.querySelector('.side-tag-select');
    const titleDisplay = document.getElementById('side-expense-title');
    if (tagSelect && titleDisplay) {
        tagSelect.addEventListener('change', function() {
            // Don't show 'Select Tag' as a title
            titleDisplay.textContent = tagSelect.value === 'Select Tag' ? '' : tagSelect.value;
        });
    }

    const amountInput = document.querySelector('.side-amount-input');
    const amountDisplay = document.getElementById('side-expense-amount');
    if (amountInput && amountDisplay) {
        amountInput.addEventListener('input', function() {
            amountDisplay.textContent = amountInput.value;
        });
    }
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


// New Total Calculation Function
function updateExpenseSummary() {
    const expenseAmountEls = document.querySelectorAll('.expense-amount > div:first-child');
    let total = 0;
    expenseAmountEls.forEach(el => {
        const val = parseFloat(el.textContent);
        if (!isNaN(val)) total += val;
    });
    document.getElementById('amount-day').textContent = total.toFixed(2);
    document.getElementById('amount-month').textContent = total.toFixed(2);
    document.getElementById('amount-year').textContent = total.toFixed(2);
}

// Update Gain / Loss and Current Money
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
}

// Run first time when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateExpenseSummary();
    updateGainLoss();
});
