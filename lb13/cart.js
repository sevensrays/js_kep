const STORAGE_KEY = 'monitors_cart_items';

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

function renderCartTable() {
    const cart = getCart();
    const tbody = document.getElementById('cartTableBody');
    const totalEl = document.getElementById('cartTotalValue');

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
        changeQtyLink.textContent = '(змінити к-сть)';
        changeQtyLink.addEventListener('click', () => {
            const newQtyStr = prompt(`Вкажіть нову кількість для "${item.name}":`, item.quantity);
            if (newQtyStr === null) return;
            const newQty = parseInt(newQtyStr, 10);
            if (!isNaN(newQty) && newQty > 0) {
                item.quantity = newQty;
                saveCart(cart);
                renderCartTable();
            } else {
                alert('Кількість має бути цілим числом більше 0.');
            }
        });
        tdQty.appendChild(changeQtyLink);

        const tdSum = document.createElement('td');
        tdSum.textContent = itemSum.toFixed(2);

        const tdDelete = document.createElement('td');
        const deleteLink = document.createElement('span');
        deleteLink.className = 'cart-action-link';
        deleteLink.textContent = '(видалити)';
        deleteLink.addEventListener('click', () => {
            const updatedCart = cart.filter(current => current.id !== item.id);
            saveCart(updatedCart);
            renderCartTable();
        });
        tdDelete.appendChild(deleteLink);

        tr.append(tdNum, tdName, tdPrice, tdQty, tdSum, tdDelete);
        tbody.appendChild(tr);
    });

    totalEl.textContent = `${totalSum.toFixed(2)} грн.`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartTable();

    document.getElementById('payLink').addEventListener('click', (event) => {
        event.preventDefault();
        const cart = getCart();
        const msg = document.getElementById('payMessage');
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        saveCart([]);
        renderCartTable();
        msg.textContent = 'Замовлення успішно оплачено! Дякуємо за покупку.';
        msg.hidden = false;
    });
});
