import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'SUPABASE_PROJECT_URL';
const SUPABASE_KEY = 'SUPABASE_PUBLISHABLE_KEY';

const isConfigured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('SUPABASE_PROJECT_URL');
const db = isConfigured ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const $ = (selector) => document.querySelector(selector);

const authStatus = $('#auth-status');
const authForms = $('#auth-forms');
const userPanel = $('#user-panel');
const userInfo = $('#user-info');
const status = $('#status');
const list = $('#books-list');
const adminPanel = $('#admin-panel');
const formStatus = $('#form-status');
const bookForm = $('#book-form');
const bookIdInput = $('#book-id');
const titleInput = $('#title');
const authorInput = $('#author');
const saveButton = $('#save-button');
const cancelButton = $('#cancel-button');

let isAdmin = false;
let books = [];

// Демо-дані на випадок, якщо ключі Supabase ще не підставлені (для перевірки на GitHub Pages:
// вхід з admin@books.com відкриває адмін-панель, будь-який інший email — звичайний користувач)
let demoUserEmail = null;
let demoBooks = [
    { id: 1, title: 'Кобзар', author: 'Тарас Шевченко' },
    { id: 2, title: 'Лісова пісня', author: 'Леся Українка' },
    { id: 3, title: 'Тигролови', author: 'Іван Багряний' },
    { id: 4, title: 'Тіні забутих предків', author: 'Михайло Коцюбинський' },
    { id: 5, title: 'Захар Беркут', author: 'Іван Франко' }
];

function resetBookForm() {
    bookForm.reset();
    bookIdInput.value = '';
    saveButton.textContent = 'Додати книгу';
    cancelButton.hidden = true;
}

function setAdminState(value) {
    isAdmin = value;
    adminPanel.hidden = !value;
    if (!value) resetBookForm();
}

function showBooks() {
    list.replaceChildren();
    if (books.length === 0) {
        status.textContent = 'Записів немає.';
        return;
    }

    for (const book of books) {
        const item = document.createElement('li');
        const description = document.createElement('span');
        description.textContent = `${book.title} — ${book.author}`;
        item.append(description);

        if (isAdmin) {
            const actions = document.createElement('div');
            actions.className = 'book-actions';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Редагувати';
            editButton.addEventListener('click', () => startEditing(book));

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Видалити';
            deleteButton.addEventListener('click', () => deleteBook(book.id));

            actions.append(editButton, deleteButton);
            item.append(actions);
        }

        list.append(item);
    }

    status.textContent = `Знайдено книг: ${books.length}`;
}

async function loadBooks() {
    status.textContent = 'Завантаження книг...';
    list.replaceChildren();

    if (!db) {
        books = [...demoBooks];
        showBooks();
        return;
    }

    try {
        const { data, error } = await db
            .from('books')
            .select('id, title, author')
            .order('id', { ascending: true });
        if (error) throw error;
        books = data ?? [];
        showBooks();
    } catch (error) {
        console.error('Помилка читання:', error);
        books = [];
        status.textContent = 'Не вдалося завантажити книги.';
    }
}

async function updateAuthState() {
    setAdminState(false);
    userPanel.hidden = true;
    authForms.hidden = true;

    if (!db) {
        if (!demoUserEmail) {
            authForms.hidden = false;
            authStatus.textContent = 'Вхід не виконано. (Демо-режим: admin@books.com — адмін, user@books.com — користувач)';
        } else {
            userInfo.textContent = `Користувач: ${demoUserEmail}`;
            userPanel.hidden = false;
            const adminRole = demoUserEmail.toLowerCase().includes('admin');
            setAdminState(adminRole);
            authStatus.textContent = isAdmin
                ? 'Виконано вхід адміністратора.'
                : 'Виконано вхід звичайного користувача.';
        }
        await loadBooks();
        return;
    }

    try {
        const { data, error } = await db.auth.getUser();
        if (error || !data.user) {
            authForms.hidden = false;
            authStatus.textContent = 'Вхід не виконано.';
            return;
        }

        userInfo.textContent = `Користувач: ${data.user.email}`;
        userPanel.hidden = false;

        try {
            const { data: result, error: roleError } = await db.rpc('check_admin');
            if (roleError) throw roleError;
            setAdminState(result === true);
            authStatus.textContent = isAdmin
                ? 'Виконано вхід адміністратора.'
                : 'Виконано вхід звичайного користувача.';
        } catch (roleError) {
            console.error('Помилка перевірки ролі:', roleError);
            authStatus.textContent = 'Вхід виконано, але роль не вдалося перевірити.';
        }
    } catch (error) {
        console.error('Помилка автентифікації:', error);
        authForms.hidden = false;
        authStatus.textContent = 'Не вдалося перевірити сеанс.';
    } finally {
        await loadBooks();
    }
}

$('#register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    authStatus.textContent = 'Реєстрація...';

    try {
        const email = $('#register-email').value.trim();
        const password = $('#register-password').value;

        if (!db) {
            demoUserEmail = email;
            form.reset();
            await updateAuthState();
            return;
        }

        const { data, error } = await db.auth.signUp({ email, password });
        if (error) throw error;
        form.reset();

        if (data.session) {
            await updateAuthState();
        } else {
            authStatus.textContent = 'Перевірте електронну пошту для підтвердження реєстрації.';
        }
    } catch (error) {
        console.error('Помилка реєстрації:', error);
        authStatus.textContent = 'Не вдалося зареєструвати користувача.';
    } finally {
        button.disabled = false;
    }
});

$('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    authStatus.textContent = 'Виконується вхід...';

    try {
        const email = $('#login-email').value.trim();
        const password = $('#login-password').value;

        if (!db) {
            demoUserEmail = email;
            form.reset();
            await updateAuthState();
            return;
        }

        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        form.reset();
        await updateAuthState();
    } catch (error) {
        console.error('Помилка входу:', error);
        authStatus.textContent = 'Не вдалося виконати вхід.';
    } finally {
        button.disabled = false;
    }
});

$('#logout-button').addEventListener('click', async () => {
    try {
        if (!db) {
            demoUserEmail = null;
            await updateAuthState();
            return;
        }

        const { error } = await db.auth.signOut();
        if (error) throw error;
        await updateAuthState();
    } catch (error) {
        console.error('Помилка виходу:', error);
        authStatus.textContent = 'Не вдалося завершити сеанс.';
    }
});

function startEditing(book) {
    if (!isAdmin) return;
    bookIdInput.value = String(book.id);
    titleInput.value = book.title;
    authorInput.value = book.author;
    saveButton.textContent = 'Зберегти зміни';
    cancelButton.hidden = false;
    formStatus.textContent = `Редагування книги № ${book.id}`;
}

cancelButton.addEventListener('click', () => {
    resetBookForm();
    formStatus.textContent = '';
});

bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!isAdmin) return;

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const bookId = bookIdInput.value;

    if (!title || !author || title.length > 150 || author.length > 150) {
        formStatus.textContent = 'Перевірте назву книги та автора.';
        return;
    }

    saveButton.disabled = true;
    formStatus.textContent = 'Збереження запису...';

    try {
        if (!db) {
            if (bookId) {
                const target = demoBooks.find(b => b.id === Number(bookId));
                if (target) {
                    target.title = title;
                    target.author = author;
                }
            } else {
                const nextId = demoBooks.length > 0 ? Math.max(...demoBooks.map(b => b.id)) + 1 : 1;
                demoBooks.push({ id: nextId, title, author });
            }
            resetBookForm();
            await loadBooks();
            formStatus.textContent = bookId ? 'Зміни збережено.' : 'Книгу додано.';
            return;
        }

        const query = bookId
            ? db.from('books').update({ title, author }).eq('id', Number(bookId))
            : db.from('books').insert({ title, author });

        const { error } = await query;
        if (error) throw error;

        resetBookForm();
        await loadBooks();
        formStatus.textContent = bookId ? 'Зміни збережено.' : 'Книгу додано.';
    } catch (error) {
        console.error('Помилка збереження:', error);
        formStatus.textContent = 'Не вдалося зберегти запис.';
    } finally {
        saveButton.disabled = false;
    }
});

async function deleteBook(bookId) {
    if (!isAdmin || !confirm('Видалити вибрану книгу?')) return;
    formStatus.textContent = 'Видалення книги...';

    try {
        if (!db) {
            demoBooks = demoBooks.filter(b => b.id !== bookId);
            await loadBooks();
            formStatus.textContent = 'Книгу видалено.';
            return;
        }

        const { error } = await db.from('books').delete().eq('id', bookId);
        if (error) throw error;
        await loadBooks();
        formStatus.textContent = 'Книгу видалено.';
    } catch (error) {
        console.error('Помилка видалення:', error);
        formStatus.textContent = 'Не вдалося видалити книгу.';
    }
}

await updateAuthState();
