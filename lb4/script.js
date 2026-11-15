const logOutput = document.getElementById('logOutput');

function logLine(text) {
    console.log(text);
    logOutput.textContent += text + '\n';
}

// Завдання 1: Робота з об'єктами + додатковий метод markAsRead (п. 2)
let book = {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    year: 1997,
    isRead: true,
    bookInfo() {
        logLine(`Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${this.isRead ? "Так" : "Ні"}`);
    },
    markAsRead() {
        this.isRead = true;
    }
};

logLine("=== Завдання 1 ===");
book.bookInfo();
book.isRead = !book.isRead;
book.bookInfo();
book.markAsRead();
logLine("Після виклику book.markAsRead():");
book.bookInfo();


// Завдання 2: Робота з масивами та об'єктами
let library = [
    {
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        year: 1997,
        isRead: true,
        markAsRead() { this.isRead = true; }
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        year: 1937,
        isRead: false,
        markAsRead() { this.isRead = true; }
    },
    {
        title: "1984",
        author: "George Orwell",
        year: 1949,
        isRead: true,
        markAsRead() { this.isRead = true; }
    }
];

function displayLibrary() {
    library.forEach(book => {
        logLine(`Назва: ${book.title}, Автор: ${book.author}, Рік видання: ${book.year}, Прочитана: ${book.isRead ? "Так" : "Ні"}`);
    });
}

logLine("\n=== Завдання 2 (Початкова бібліотека) ===");
displayLibrary();

library.push({
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    isRead: false,
    markAsRead() { this.isRead = true; }
});

logLine("\n=== Завдання 2 (Після додавання The Great Gatsby) ===");
displayLibrary();


// Завдання 3: Робота з методами масивів (sort, filter, find)
logLine("\n=== Завдання 3 ===");
library.sort((a, b) => a.year - b.year);
logLine("Відсортовані книги за роком видання:");
displayLibrary();

let unreadBooks = library.filter(book => !book.isRead);
console.log("Непрочитані книги:", unreadBooks);
logLine("Непрочитані книги (filter): " + unreadBooks.map(b => b.title).join(", "));

let tolkienBook = library.find(book => book.author === "J.R.R. Tolkien");
console.log("Книга Толкіна:", tolkienBook);
logLine(`Книга Толкіна (find): ${tolkienBook.title} (${tolkienBook.year})`);


// Індивідуальні завдання (п. 2 на 7-9 балів): markAsRead та calculateAverageYear
logLine("\n=== Додаткові завдання (Пункт 2) ===");
tolkienBook.markAsRead();
logLine("Позначено 'The Hobbit' як прочитану через markAsRead():");
displayLibrary();

function calculateAverageYear() {
    if (library.length === 0) return 0;
    const sumYears = library.reduce((acc, book) => acc + book.year, 0);
    return Math.round(sumYears / library.length);
}

logLine("Середній рік видання всіх книг у library: " + calculateAverageYear());


// Завдання 4: Взаємодія з користувачем
function addBookToLibrary() {
    let title = prompt("Введіть назву книги:");
    if (!title) return;
    let author = prompt("Введіть автора книги:");
    let year = +prompt("Введіть рік видання книги:");
    let isRead = confirm("Чи прочитана книга?");

    library.push({
        title,
        author,
        year,
        isRead,
        markAsRead() { this.isRead = true; }
    });

    logLine("\n=== Оновлений список після додавання книги ===");
    displayLibrary();
    logLine("Новий середній рік видання: " + calculateAverageYear());
}

document.getElementById('addBookBtn').addEventListener('click', addBookToLibrary);
