const STORAGE_KEY = 'monitors_cart_items';
const LANG_KEY = 'monitors_selected_lang';

let translations = {};

function getCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

async function loadCartLanguage(lang) {
    try {
        let response = await fetch(`${lang}.json`);
        if (!response.ok) {
            response = await fetch(`locales/${lang}.json`);
        }
        translations = await response.json();
        localStorage.setItem(LANG_KEY, lang);
        document.documentElement.lang = lang;

        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = lang;
        }

        updateCartTexts();
        renderCartTable();
    } catch (error) {
        console.error('Error loading cart translation:', error);
    }
}

function updateCartTexts() {
    document.getElementById('cartHeading').textContent = translations.cart_heading;
    document.getElementById('thNum').textContent = translations.th_num;
    document.getElementById('thName').textContent = translations.th_name;
    document.getElementById('thPrice').textContent = translations.th_price;
    document.getElementById('thQty').textContent = translations.th_qty;
    document.getElementById('thSum').textContent = translations.th_sum;
    document.getElementById('totalLabel').textContent = translations.total_label;
    document.getElementById('payLink').textContent = translations.pay_link;
    document.getElementById('backToShopLink').textContent = translations.back_to_shop;
}

function renderCartTable() {
    const cart = getCart();
    const tbody = document.getElementById('cartTableBody');
    const totalEl = document.getElementById('cartTotalValue');
    const currency = translations.currency || 'грн.';

    tbody.innerHTML = '';
    let totalSum = 0;

    cart.forEach((item, index) => {
        const tr = document.createElement('tr');
        const itemSum = item.price * item.quantity;
        totalSum += itemSum;

        const tdNum = document.createElement('td');
        tdNum.textContent = `${index + 1}.`;

        const tdName = document.createElement('td');
        tdName.textContent = item.name;

        const tdPrice = document.createElement('td');
        tdPrice.textContent = item.price.toFixed(2);

        const tdQty = document.createElement('td');
        tdQty.appendChild(document.createTextNode(`${item.quantity} `));
        const changeQtyLink = document.createElement('span');
        changeQtyLink.className = 'cart-action-link';
        changeQtyLink.textContent = translations.change_qty || '(змінити к-сть)';
        changeQtyLink.addEventListener('click', () => {
            const newQtyStr = prompt(`${translations.prompt_new_qty || 'Нова кількість'} "${item.name}":`, item.quantity);
            if (newQtyStr === null) return;
            const newQty = parseInt(newQtyStr, 10);
            if (!isNaN(newQty) && newQty > 0) {
                item.quantity = newQty;
                saveCart(cart);
                renderCartTable();
            } else {
                alert(translations.invalid_qty_alert || 'Invalid quantity');
            }
        });
        tdQty.appendChild(changeQtyLink);

        const tdSum = document.createElement('td');
        tdSum.textContent = itemSum.toFixed(2);

        const tdDelete = document.createElement('td');
        const deleteLink = document.createElement('span');
        deleteLink.className = 'cart-action-link';
        deleteLink.textContent = translations.delete_item || '(видалити)';
        deleteLink.addEventListener('click', () => {
            const updatedCart = cart.filter(current => current.id !== item.id);
            saveCart(updatedCart);
            renderCartTable();
        });
        tdDelete.appendChild(deleteLink);

        tr.append(tdNum, tdName, tdPrice, tdQty, tdSum, tdDelete);
        tbody.appendChild(tr);
    });

    totalEl.textContent = `${totalSum.toFixed(2)} ${currency}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem(LANG_KEY) || 'uk';
    loadCartLanguage(savedLang);

    document.getElementById('language-selector').addEventListener('change', function () {
        loadCartLanguage(this.value);
    });

    document.getElementById('payLink').addEventListener('click', (event) => {
        event.preventDefault();
        const cart = getCart();
        const msg = document.getElementById('payMessage');
        if (cart.length === 0) {
            alert(translations.empty_cart_msg || 'Корзина пуста!');
            return;
        }
        saveCart([]);
        renderCartTable();
        msg.textContent = translations.pay_success || 'Оплачено!';
        msg.hidden = false;
    });
});
