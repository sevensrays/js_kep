// ==============================
// DOM
// ==============================
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

// Елементи індивідуального варіанта №11 (letter-spacing та text-transform)
const letterSpacing = document.querySelector('#letter-spacing');
const letterSpacingValue = document.querySelector('#letter-spacing-value');
const textTransform = document.querySelector('#text-transform');
const textTransformValue = document.querySelector('#text-transform-value');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');

const scrollTopButton = document.querySelector('#scroll-top');

// ==============================
// TABS (І–ІІІ рівень)
// ==============================
function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });
    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });
}

function showTab(tabName) {
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.querySelector(`[data-content="${tabName}"]`);

    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
}

// Завдання 14 (ІІІ рівень): Делегування подій на контейнері вкладок
// (Також містить вивід event.type, event.target, event.currentTarget із Завдання 4)
tabsContainer.addEventListener('click', function (event) {
    console.log('Тип події:', event.type);
    console.log('Target:', event.target);
    console.log('CurrentTarget:', event.currentTarget);

    if (!event.target.classList.contains('tab')) {
        return;
    }

    const tabName = event.target.dataset.tab;
    hideTabs();
    showTab(tabName);
});

// ==============================
// BORDER RADIUS & ВАРІАНТ 11 (letter-spacing, text-transform)
// ==============================
function generateBorderRadius() {
    const topLeftRadius = topLeft.value;
    const topRightRadius = topRight.value;
    const bottomRightRadius = bottomRight.value;
    const bottomLeftRadius = bottomLeft.value;

    const spacing = letterSpacing.value;
    const transform = textTransform.value;

    // Відображення поточних значень біля елементів керування (Завдання 7 та 9)
    topLeftValue.textContent = `${topLeftRadius} px`;
    topRightValue.textContent = `${topRightRadius} px`;
    bottomRightValue.textContent = `${bottomRightRadius} px`;
    bottomLeftValue.textContent = `${bottomLeftRadius} px`;

    letterSpacingValue.textContent = `${spacing} px`;
    textTransformValue.textContent = transform;

    // Формування та застосування CSS-значень (Завдання 5 та 9)
    const radius = `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;
    preview.style.borderRadius = radius;
    preview.style.letterSpacing = `${spacing}px`;
    preview.style.textTransform = transform;

    // Генерація підсумкового CSS-коду (Завдання 8 та 9)
    cssCode.value =
        `border-radius: ${radius};\n` +
        `letter-spacing: ${spacing}px;\n` +
        `text-transform: ${transform};`;
}

// Призначення обробників подій input та change (Завдання 6 та 9)
topLeft.addEventListener('input', generateBorderRadius);
topRight.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius);
bottomLeft.addEventListener('input', generateBorderRadius);

letterSpacing.addEventListener('input', generateBorderRadius);
textTransform.addEventListener('change', generateBorderRadius);

// Початкова ініціалізація CSS-коду
generateBorderRadius();

// ==============================
// COPY (Завдання 13 — ІІ рівень)
// ==============================
function copyCSS() {
    navigator.clipboard.writeText(cssCode.value).then(function () {
        copyMessage.textContent = 'CSS-код скопійовано';
    });
}

copyButton.addEventListener('click', copyCSS);

// ==============================
// FORM: focus, blur, submit (Завдання 10–11 — ІІ рівень)
// ==============================
presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');

    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
    } else {
        presetName.classList.remove('error');
        presetError.textContent = '';
    }
});

function handlePresetSubmit(event) {
    event.preventDefault();

    const name = presetName.value.trim();
    if (name === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        return;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';

    console.log(`Пресет: ${name}`);
    console.log(cssCode.value);
}

presetForm.addEventListener('submit', handlePresetSubmit);

// ==============================
// KEYBOARD (Завдання 12 — ІІ рівень)
// ==============================
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        topLeft.value = 0;
        topRight.value = 0;
        bottomRight.value = 0;
        bottomLeft.value = 0;
        generateBorderRadius();
    }
}

document.addEventListener('keydown', handleKeyDown);

// ==============================
// PROPAGATION & MOUSE EVENTS (Завдання 15–17 — ІІІ рівень)
// ==============================
preview.addEventListener('click', function () {
    console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
    event.stopPropagation();
    console.log('Button click');
});

preview.addEventListener('mouseover', function () {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function () {
    preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
    console.log(`pageX: ${event.pageX}; pageY: ${event.pageY}`);
});

// ==============================
// SCROLL (Завдання 18–19 — ІІІ рівень)
// ==============================
function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
