const STORAGE_KEY = 'monitors_cart_items';

// Варіант 11: Тема "Монітори"
const products = [
    {
        id: 'mon-1',
        category: 'OLED ГЕЙМІНГ',
        name: 'ASUS ROG Swift 27" OLED',
        price: 34990,
        oldPrice: null,
        image: 'monitor-oled.jpg',
        badge: { text: 'НОВИНКА', type: 'new' },
        available: false
    },
    {
        id: 'mon-2',
        category: 'КІБЕРСПОРТ IPS',
        name: 'LG UltraGear 27" Fast IPS',
        price: 10990,
        oldPrice: 12500,
        image: 'monitor-ips.jpg',
        badge: null,
        available: true
    },
    {
        id: 'mon-3',
        category: 'ВИГНУТИЙ ЕКРАН',
        name: 'Samsung Odyssey G5 27" VA',
        price: 8490,
        oldPrice: null,
        image: 'monitor-va.jpg',
        badge: { text: 'ХІТ ПРОДАЖІВ', type: 'hit' },
        available: true
    },
    {
        id: 'mon-4',
        category: 'ДЛЯ РОБОТИ 4K',
        name: 'Dell UltraSharp 27" 4K UHD',
        price: 16500,
        oldPrice: null,
        image: 'monitor-4k.jpg',
        badge: { text: 'ХІТ ПРОДАЖІВ', type: 'hit' },
        available: true
    }
];

let selectedProduct = null;

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

// Пункт 5: Відображати саме кількість найменувань доданих товарів (cart.length)
function updateCartBadge() {
    const cart = getCart();
    document.getElementById('cartCount').textContent = cart.length;
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        if (product.badge) {
            const badge = document.createElement('div');
            badge.className = `badge-circle ${product.badge.type === 'new' ? 'badge-new' : 'badge-hit'}`;
            badge.textContent = product.badge.text;
            card.appendChild(badge);
        }

        const cat = document.createElement('div');
        cat.className = 'product-category';
        cat.textContent = product.category;

        const img = document.createElement('img');
        img.className = 'product-img';
        img.src = product.image;
        img.alt = product.name;

        const title = document.createElement('h3');
        title.className = 'product-name';
        title.textContent = product.name;

        const priceBox = document.createElement('div');
        priceBox.className = 'product-price';

        if (product.available) {
            if (product.oldPrice) {
                const oldSpan = document.createElement('span');
                oldSpan.className = 'old-price';
                oldSpan.textContent = `${product.oldPrice} ГРН`;
                priceBox.appendChild(oldSpan);
            }
            priceBox.appendChild(document.createTextNode(`${product.price} ГРН`));
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        if (product.available) {
            btn.className = 'btn-cart btn-available';
            btn.textContent = 'У КОРЗИНУ';
            btn.addEventListener('click', () => openQuantityModal(product));
        } else {
            btn.className = 'btn-cart btn-soon';
            btn.textContent = 'НЕЗАБАРОМ У ПРОДАЖІ';
            btn.disabled = true;
        }

        card.append(cat, img, title, priceBox, btn);
        grid.appendChild(card);
    });
}

function openQuantityModal(product) {
    selectedProduct = product;
    document.getElementById('selectedProductTitle').textContent = product.name;
    const qtyInput = document.getElementById('quantityInput');
    qtyInput.value = 1;
    document.getElementById('quantityModal').hidden = false;
    qtyInput.focus();
}

function initCatalog() {
    renderProducts();
    updateCartBadge();

    const emptyModal = document.getElementById('emptyCartModal');
    const quantityModal = document.getElementById('quantityModal');
    const addedModal = document.getElementById('addedModal');

    // Пункт 3: Клік по іконці корзини
    document.getElementById('cartIconBtn').addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
            emptyModal.hidden = false;
        } else {
            window.location.href = 'cart.html';
        }
    });

    document.getElementById('closeEmptyModalBtn').addEventListener('click', () => {
        emptyModal.hidden = true;
    });

    document.getElementById('cancelQuantityBtn').addEventListener('click', () => {
        quantityModal.hidden = true;
    });

    // Пункт 4: Додавання вибраної кількості у корзину
    document.getElementById('confirmAddBtn').addEventListener('click', () => {
        const qty = parseInt(document.getElementById('quantityInput').value, 10);
        if (isNaN(qty) || qty <= 0 || !selectedProduct) {
            alert('Введіть коректну кількість (від 1)');
            return;
        }

        const cart = getCart();
        const existing = cart.find(item => item.id === selectedProduct.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: qty
            });
        }

        saveCart(cart);
        updateCartBadge();

        quantityModal.hidden = true;
        addedModal.hidden = false;
    });

    document.getElementById('goToCartBtn').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        addedModal.hidden = true;
    });
}

document.addEventListener('DOMContentLoaded', initCatalog);
