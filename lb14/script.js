const STORAGE_KEY = 'monitors_cart_items';
const LANG_KEY = 'monitors_selected_lang';

let translations = {};
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

function buildLayout(container) {
    container.innerHTML = `
        <header class="top-bar">
            <h1 class="page-title" id="pageTitle"></h1>
            <div class="top-actions">
                <div class="lang-switch-box">
                    <label for="language-selector">🌐</label>
                    <select id="language-selector">
                        <option value="uk">Українська</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div class="cart-widget" id="cartIconBtn">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-badge" id="cartCount">0</span>
                </div>
            </div>
        </header>

        <main class="catalog-wrapper">
            <div class="products-grid" id="productsGrid"></div>
        </main>

        <!-- Модальне вікно вибору мови при першому відвідуванні -->
        <div class="modal-overlay" id="langModal" hidden>
            <div class="modal-box">
                <p class="modal-text" id="langModalTitle">Оберіть мову / Choose language</p>
                <p class="modal-subtext" id="langModalDesc">Будь ласка, оберіть мову для перегляду сторінки:</p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="chooseUkBtn">Українська</button>
                    <button type="button" class="btn btn-primary" id="chooseEnBtn">English</button>
                </div>
            </div>
        </div>

        <!-- Модальне вікно 1: Корзина пуста -->
        <div class="modal-overlay" id="emptyCartModal" hidden>
            <div class="modal-box">
                <p class="modal-text" id="emptyCartText"></p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="closeEmptyModalBtn"></button>
                </div>
            </div>
        </div>

        <!-- Модальне вікно 2: Вкажіть кількість -->
        <div class="modal-overlay" id="quantityModal" hidden>
            <div class="modal-box">
                <p class="modal-text" id="enterQtyText"></p>
                <p class="modal-subtext" id="selectedProductTitle"></p>
                <input type="number" id="quantityInput" min="1" max="99" value="1" />
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="confirmAddBtn"></button>
                    <button type="button" class="btn btn-secondary" id="cancelQuantityBtn"></button>
                </div>
            </div>
        </div>

        <!-- Модальне вікно 3: Товар додано -->
        <div class="modal-overlay" id="addedModal" hidden>
            <div class="modal-box">
                <p class="modal-text" id="addedText"></p>
                <div class="modal-actions">
                    <button type="button" class="btn btn-primary" id="goToCartBtn"></button>
                    <button type="button" class="btn btn-secondary" id="continueShoppingBtn"></button>
                </div>
            </div>
        </div>
    `;
}

// Завантаження локалізаційного JSON-файлу (uk.json або en.json)
async function loadLanguage(lang) {
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

        updateText();
    } catch (error) {
        console.error('Error loading translation:', error);
    }
}

// Оновлення текстів інтерфейсу та карток товарів обраною мовою
function updateText() {
    document.title = translations.title || 'Monitor Store';
    document.getElementById('pageTitle').textContent = translations.title || '';

    document.getElementById('emptyCartText').textContent = translations.empty_cart_msg;
    document.getElementById('closeEmptyModalBtn').textContent = translations.btn_ok;

    document.getElementById('enterQtyText').textContent = translations.enter_qty_msg;
    document.getElementById('confirmAddBtn').textContent = translations.btn_confirm_add;
    document.getElementById('cancelQuantityBtn').textContent = translations.btn_cancel;

    document.getElementById('addedText').textContent = translations.added_msg;
    document.getElementById('goToCartBtn').textContent = translations.btn_go_to_cart;
    document.getElementById('continueShoppingBtn').textContent = translations.btn_continue;

    renderProducts(translations.products || []);
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    const currency = translations.currency || 'ГРН';

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
                oldSpan.textContent = `${product.oldPrice} ${currency}`;
                priceBox.appendChild(oldSpan);
            }
            priceBox.appendChild(document.createTextNode(`${product.price} ${currency}`));
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        if (isAvailable) {
            btn.className = 'btn-cart btn-available';
            btn.textContent = translations.btn_add_to_cart;
            btn.addEventListener('click', () => openQuantityModal(product));
        } else {
            btn.className = 'btn-cart btn-soon';
            btn.textContent = translations.btn_coming_soon;
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
    const langModal = document.getElementById('langModal');
    const emptyModal = document.getElementById('emptyCartModal');
    const quantityModal = document.getElementById('quantityModal');
    const addedModal = document.getElementById('addedModal');

    // Вибір мови на самій сторінці
    document.getElementById('language-selector').addEventListener('change', function () {
        loadLanguage(this.value);
    });

    // Кнопки модального вікна першого візиту
    document.getElementById('chooseUkBtn').addEventListener('click', () => {
        langModal.hidden = true;
        loadLanguage('uk');
    });

    document.getElementById('chooseEnBtn').addEventListener('click', () => {
        langModal.hidden = true;
        loadLanguage('en');
    });

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
            alert(translations.invalid_qty_alert || 'Invalid quantity');
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

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('product-container');
    buildLayout(container);
    updateCartBadge();
    bindEvents();

    const savedLang = localStorage.getItem(LANG_KEY);
    if (!savedLang) {
        // Перед першим відвідуванням показуємо модальне вікно вибору мови
        await loadLanguage('uk');
        localStorage.removeItem(LANG_KEY);
        document.getElementById('langModal').hidden = false;
    } else {
        // При наступних відвідуваннях одразу завантажуємо збережену мову
        await loadLanguage(savedLang);
    }
});
