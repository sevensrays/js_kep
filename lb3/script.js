// Завдання 1: startGreetingTimer(message, seconds, callback)
function startGreetingTimer(message, seconds, callback) {
    const out = document.getElementById('timerOut');
    out.textContent = `Таймер запущено на ${seconds} с...`;

    setTimeout(() => {
        console.log(message);
        out.textContent = message;
        callback();
    }, seconds * 1000);
}

document.getElementById('startTimerBtn').addEventListener('click', () => {
    startGreetingTimer('Привіт! Час таймера вийшов.', 3, () => alert('Time is up!'));
});


// Завдання 2: calculate(a, b, operation) та showResult()
function calculate(a, b, operation) {
    if (operation === '+') {
        let res = a + b;
        return res;
    } else if (operation === '-') {
        let res = a - b;
        return res;
    } else if (operation === '*') {
        let res = a * b;
        return res;
    } else if (operation === '/') {
        let res = b !== 0 ? a / b : 'Division by zero';
        return res;
    } else {
        return 'Invalid operation';
    }
}

function showResult() {
    const a = Number(prompt('Введіть перше число:'));
    const b = Number(prompt('Введіть друге число:'));
    const operation = prompt("Введіть операцію ('+', '-', '*', '/'):");

    const result = calculate(a, b, operation);
    alert(result);
    document.getElementById('calcOut').textContent = `Результат: ${result}`;
}

document.getElementById('calcBtn').addEventListener('click', showResult);


// Завдання 3: createClickCounter() із замиканням (closure)
function createClickCounter() {
    let count = 0;
    return function () {
        count++;
        console.log(`Count: ${count}`);
        const out = document.getElementById('counterOut');
        if (out) {
            out.textContent = `Count: ${count}`;
        }
    };
}

const counter = createClickCounter();

// Викликаємо лічильник кілька разів одразу для демонстрації у консолі
counter();
counter();
counter();

document.getElementById('counterBtn').addEventListener('click', counter);
