let tasks = [];

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
});

function startEditing(task, textElement) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit';
    input.value = task.text;
    input.maxLength = 200;

    function finishEditing(save) {
        const newText = input.value.trim();
        if (save && newText !== '') {
            task.text = newText;
        }
        textElement.textContent = task.text;
        if (input.isConnected) {
            input.replaceWith(textElement);
        }
    }

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishEditing(true);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            finishEditing(false);
        }
    });

    input.addEventListener('blur', () => finishEditing(true));

    textElement.replaceWith(input);
    input.focus();
    input.select();
}

function createTaskItem(task) {
    const item = document.createElement('li');
    item.className = task.completed ? 'task completed' : 'task';

    const status = document.createElement('span');
    status.className = 'task-status';

    if (!task.completed) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.addEventListener('change', () => {
            task.completed = true;
            renderTasks();
        });
        status.appendChild(checkbox);
    }

    const content = document.createElement('div');
    content.className = 'task-content';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    text.addEventListener('dblclick', () => startEditing(task, text));

    const time = document.createElement('time');
    time.textContent = dateFormatter.format(new Date(task.createdAt));

    content.append(text, time);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => {
        tasks = tasks.filter(current => current.id !== task.id);
        renderTasks();
    });

    item.append(status, content, deleteButton);
    return item;
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.replaceChildren(...tasks.map(createTaskItem));
}

function init() {
    const taskInput = document.getElementById('taskInput');

    taskInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const text = taskInput.value.trim();
            if (text === '') {
                return;
            }

            tasks.push({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text: text,
                completed: false,
                createdAt: Date.now()
            });

            taskInput.value = '';
            renderTasks();
        }
    });

    renderTasks();
}

document.addEventListener('DOMContentLoaded', init);
