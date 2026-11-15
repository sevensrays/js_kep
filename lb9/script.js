const loader = document.getElementById('loader');
const resultDiv = document.getElementById('result');

// Допоміжні функції для Завдання 0 (відображення та приховування лоадера)
function showLoader() {
    loader.style.display = 'block';
    resultDiv.textContent = '';
    resultDiv.className = '';
}

function hideLoader(text, isError = false) {
    loader.style.display = 'none';
    resultDiv.textContent = text;
    resultDiv.className = isError ? 'message error' : 'message ok';
}

// ==========================================
// Завдання 2. Функція checkNumber(num)
// ==========================================
function checkNumber(num) {
    return new Promise((resolve, reject) => {
        // Невелика затримка (1 с), щоб лоадер із Завдання 0 був помітним на сторінці
        setTimeout(() => {
            if (num > 10) {
                resolve('Число більше 10');
            } else {
                reject('Число менше або дорівнює 10');
            }
        }, 1000);
    });
}

function runCheckNumber(value) {
    showLoader();
    checkNumber(value)
        .then((message) => {
            console.log(`checkNumber(${value}) — Успішно:`, message);
            hideLoader(`Результат для ${value}: ${message}`, false);
        })
        .catch((error) => {
            console.log(`checkNumber(${value}) — Помилка:`, error);
            hideLoader(`Помилка для ${value}: ${error}`, true);
        });
}

document.getElementById('checkInputBtn').addEventListener('click', () => {
    const val = Number(document.getElementById('numInput').value);
    runCheckNumber(val);
});

document.getElementById('check15Btn').addEventListener('click', () => runCheckNumber(15));
document.getElementById('check5Btn').addEventListener('click', () => runCheckNumber(5));


// ==========================================
// Завдання 3. Функція randomNumber()
// ==========================================
function randomNumber() {
    return new Promise((resolve) => {
        // Випадковий час від 1000 до 3000 мс (від 1 до 3 секунд)
        const delayMs = Math.floor(Math.random() * 2001) + 1000;
        // Випадкове число від 1 до 100
        const randomVal = Math.floor(Math.random() * 100) + 1;

        setTimeout(() => {
            resolve({ number: randomVal, time: delayMs });
        }, delayMs);
    });
}

document.getElementById('randomBtn').addEventListener('click', () => {
    showLoader();
    randomNumber()
        .then((data) => {
            const text = `Випадкове число: ${data.number} (час виконання: ${data.time} мс / ${(data.time / 1000).toFixed(2)} с)`;
            console.log(text);
            hideLoader(text, false);
        })
        .catch((error) => {
            hideLoader(`Помилка: ${error}`, true);
        });
});
