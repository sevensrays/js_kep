// Завдання 3. Статистичний аналіз даних з масиву об'єктів (reduce)
const employees = [
    { name: 'Олександр', position: 'Frontend Developer', salary: 1800, years: 3 },
    { name: 'Марія', position: 'Project Manager', salary: 2200, years: 5 },
    { name: 'Андрій', position: 'Backend Developer', salary: 2500, years: 7 },
    { name: 'Ірина', position: 'QA Engineer', salary: 1500, years: 2 }
];

function getAverageSalary(empArray) {
    if (empArray.length === 0) return 0;
    const total = empArray.reduce((sum, emp) => sum + emp.salary, 0);
    return total / empArray.length;
}

function findMostExperiencedEmployee(empArray) {
    if (empArray.length === 0) return null;
    return empArray.reduce((mostExp, current) => {
        return current.years > mostExp.years ? current : mostExp;
    });
}

const avgSalary = getAverageSalary(employees);
const mostExperienced = findMostExperiencedEmployee(employees);

console.log('Середня зарплата:', avgSalary);
console.log('Найбільш досвідчений працівник:', mostExperienced);

document.getElementById('avgSalary').textContent = avgSalary;
document.getElementById('mostExp').textContent = JSON.stringify(mostExperienced, null, 2);


// Завдання 4. Обробка та аналіз даних про книги (reduce, sort)
const books = [
    { title: 'Кобзар', author: 'Тарас Шевченко', year: 1840, rating: 4.9, isRead: true },
    { title: 'Тіні забутих предків', author: 'Михайло Коцюбинський', year: 1911, rating: 4.7, isRead: false },
    { title: 'Сад Гетсиманський', author: 'Іван Багряний', year: 1950, rating: 4.9, isRead: false },
    { title: 'Тигролови', author: 'Іван Багряний', year: 1944, rating: 4.8, isRead: true },
    { title: 'Місто', author: "Валер'ян Підмогильний", year: 1928, rating: 3.9, isRead: false }
];

function getUnreadBooks(booksArray) {
    return booksArray.reduce((acc, book) => {
        if (!book.isRead) {
            acc.push(book.title);
        }
        return acc;
    }, []);
}

function getBooksByAuthor(booksArray, authorName) {
    const authorBooks = booksArray.reduce((acc, book) => {
        if (book.author.toLowerCase() === authorName.toLowerCase()) {
            acc.push(book);
        }
        return acc;
    }, []);
    return authorBooks.sort((a, b) => a.year - b.year);
}

function getTopRatedBooks(booksArray) {
    const topRated = booksArray.reduce((acc, book) => {
        if (book.rating > 4) {
            acc.push(book);
        }
        return acc;
    }, []);
    return topRated.sort((a, b) => b.rating - a.rating);
}

const unread = getUnreadBooks(books);
const byAuthor = getBooksByAuthor(books, 'Іван Багряний');
const topRated = getTopRatedBooks(books);

console.log('Непрочитані книги:', unread);
console.log('Книги автора Іван Багряний:', byAuthor);
console.log('Топ книги (рейтинг > 4):', topRated);

document.getElementById('unreadBooks').textContent = JSON.stringify(unread, null, 2);
document.getElementById('authorBooks').textContent = JSON.stringify(byAuthor, null, 2);
document.getElementById('topBooks').textContent = JSON.stringify(topRated, null, 2);
