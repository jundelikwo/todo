const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const searchInput = document.querySelector('#search');
const todoInput = document.querySelector('#todo');
const todosDiv = document.querySelector('#todos');
const addForm = document.querySelector('#add-form');
const editForm = document.querySelector('#edit-form');
let todos = JSON.parse(localStorage.getItem('todos')) || [];

renderTodos(todos);

function renderTodos(todosList) {
    const todosContainer = document.createElement('div');
    todosList.map(item => todosContainer.appendChild(generateTodoElement(item)));
    todosDiv.innerHTML = '';
    todosDiv.appendChild(todosContainer);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function handleTodoSearch() {
    const search = searchInput.value.toLowerCase();

    if(search) {
        const matchingTodos = todos.filter(item => item.text.toLowerCase().includes(search));
        renderTodos(matchingTodos);
    } else {
        renderTodos(todos)
    }
}

function handleTodoDelete(todoId, todoContainer) {
    return () => {
        if(confirm('Are you sure you want to delete this todo')) {
            todos = todos.filter(item => item.id !== todoId)
            saveTodos();
            todosDiv.querySelector('div').removeChild(todoContainer);
        }
    }
}

function handleTodoEdit(todo, todoContainer) {
    return () => {
        addForm.classList.add('disabled');
        editForm.classList.remove('disabled');
        editForm.querySelector('h6').innerHTML = 'Editing todo: ' + todo.text;
        const editInput = editForm.querySelector('input');
        editInput.value = todo.text;

        editForm.onsubmit = (evt) => {
            evt.preventDefault();
            todoContainer.querySelector('h3').innerHTML = editInput.value;

            const newTodo = todos.find(item => item.id === todo.id);
            newTodo.text = editInput.value;
            saveTodos();

            editInput.value = '';
            addForm.classList.remove('disabled');
            editForm.classList.add('disabled');
        }
    }
}

function handleTodoCopy(todoText, copyBtn) {
    return () => {
        navigator.clipboard.writeText(todoText);
        copyBtn.innerHTML = 'Copied';
        setTimeout(() => copyBtn.innerHTML="Copy", 3000);
    };
}

function generateTodoElement(todo) {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo');
    const todoText = document.createElement('h3')
    todoText.innerHTML = todo.text;
    const todoDate = document.createElement('h5')
    todoDate.innerHTML = todo.date;

    const buttonDiv = document.createElement('div');
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = 'Copy';
    copyBtn.addEventListener('click', handleTodoCopy(todo.text, copyBtn));
    buttonDiv.appendChild(copyBtn);
    const editBtn = document.createElement('button');
    editBtn.innerHTML = 'Edit';
    editBtn.addEventListener('click', handleTodoEdit(todo, todoContainer));
    buttonDiv.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.addEventListener('click', handleTodoDelete(todo.id, todoContainer));
    buttonDiv.appendChild(deleteBtn);

    todoContainer.appendChild(todoText);
    todoContainer.appendChild(todoDate);
    todoContainer.appendChild(buttonDiv);

    return todoContainer;
}

function addTodo(todoText) {
    const now = new Date();

    const todo = {
        id: Math.random(),
        text: todoText,
        date: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}`
    }

    todos.push(todo);
    saveTodos();

    todosDiv.querySelector('div').appendChild(generateTodoElement(todo));
}

addForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    addTodo(todoInput.value)
    todoInput.value = '';
})

searchInput.addEventListener('keyup', handleTodoSearch)

window.addEventListener('storage', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    handleTodoSearch();
})