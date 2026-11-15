const STORAGE_KEY = 'monitors_cart_items';
const JSON_URL = 'products.json';

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

function updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = getCart().length;
    }
}

function buildLayout(container, pageTitle) {
    container.innerHTML = `
        <header class="top-bar">
            <h1 class="page-title" id="pageTitle"></h1>
            <div class="cart-widget" id="cartIconBtn" title="Перейти у корзину">
                <span class="cart-icon">🛒</span>
                <span class="cart-badge" id="cartCount">0</span>
            </div>
        </header>

        <main class="catalog-wrapper">
            <div class="products-grid" id="productsGrid"></div>
        </main>

        <div class="modal-overlay" id="emptyCartModal" hidden>
            <div class="modal-box">
                <p class="modal-text">Корзина пуста</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="closeEmptyModalBtn">Зрозуміло</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" id="quantityModal" hidden>
            <div class="modal-box">
                <p class="modal-text">Вкажіть кількість:</p>
                <p class="modal-subtext" id="selectedProductTitle"></p>
                <input type="number" id="quantityInput" min="1" max="99" value="1" />
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="confirmAddBtn">Додати до корзини</button>
                    <button type="button" class="btn btn-secondary" id="cancelQuantityBtn">Скасувати</button>
                </div>
            </div>
        </div>

        <div class="modal-overlay" id="addedModal" hidden>
            <div class="modal-box">
                <p class="modal-text">Товар додано</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="goToCartBtn">Перейти у корзину</button>
                    <button type="button" class="btn btn-secondary" id="continueShoppingBtn">Повернутись до покупок</button>
                </div>
            </div>
        </div>
    `;

    document.title = pageTitle;
    document.getElementById('pageTitle').textContent = pageTitle;
}

function renderProducts(products) {
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

        const desc = document.createElement('p');
        desc.className = 'product-desc';
        desc.textContent = product.description || '';

        const priceBox = document.createElement('div');
        priceBox.className = 'product-price';

        const isAvailable = product.available !== false;
        if (isAvailable) {
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
        if (isAvailable) {
            btn.className = 'btn-cart btn-available';
            btn.textContent = 'У КОРЗИНУ';
            btn.addEventListener('click', () => openQuantityModal(product));
        } else {
            btn.className = 'btn-cart btn-soon';
            btn.textContent = 'НЕЗАБАРОМ У ПРОДАЖІ';
            btn.disabled = true;
        }

        card.append(cat, img, title, desc, priceBox, btn);
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

function bindEvents() {
    const emptyModal = document.getElementById('emptyCartModal');
    const quantityModal = document.getElementById('quantityModal');
    const addedModal = document.getElementById('addedModal');

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

// Завантаження даних про товари з JSON-файлу за допомогою fetch()
async function loadCatalogFromJSON() {
    const container = document.getElementById('product-container');
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        buildLayout(container, data.title || 'Магазин моніторів');
        renderProducts(data.products || []);
        updateCartBadge();
        bindEvents();
    } catch (error) {
        console.error('Помилка завантаження JSON:', error);
        container.textContent = 'Не вдалося завантажити каталог товарів з JSON-файлу.';
    }
}

document.addEventListener('DOMContentLoaded', loadCatalogFromJSON);
