let taskInput = document.getElementById('task');
const addTaskBtn = document.getElementById('addTask');
const todosListEl = document.getElementById('todos-list');

addTaskBtn.addEventListener('click', addTask);

let todoTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editVal = -1;

renderTodos();

function addTask() {
    if (taskInput.value != "") {
        if (editVal >= 0) {
            todoTasks = todoTasks.map((todo, index) => ({
                ...todo,
                task: index === editVal ? taskInput.value : todo.task,
            }));
            editVal = -1;
        }
        else {
            let todoTask = { task: taskInput.value, completed: false };
            todoTasks.push(todoTask);
        }
        taskInput.value = "";
        renderTodos();
        addTaskToLocaleStorage(todoTasks);
    }
    else {
        alert("Todo's input is empty");
    }
}

function renderTodos() {
    todosListEl.setAttribute("style", "display: block");

    if (todoTasks.length === 0) {
        todosListEl.innerHTML = "<center>Nothing to do!</center>";
        return;
    }
    todosListEl.innerHTML = "";

    todoTasks.forEach((todo, index) => {
        todosListEl.innerHTML += `
        <div class="todo" id=${index}>
            <i class="bi ${todo.completed ? 'bi-check-circle-fill' : 'bi-circle'} "
                style="color : rgb(14, 54, 48)"
                data-action="check"
            ></i>
            <p class="${todo.completed ? 'checked' : ''}" data-action="check">${todo.task}</p>
            <i class="bi bi-pencil-square" data-action="edit"></i>
            <i class="bi bi-trash" data-action="delete"></i>
        </div>
        `
    })
}

todosListEl.addEventListener('click', (e) => {
    const target = e.target;
    const parentEl = target.parentNode;

    if (parentEl.className !== "todo") return;
    const todoId = Number(parentEl.id);

    const action = target.dataset.action;

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
})

function checkTodo(todoId) {
    todoTasks = todoTasks.map((todo, index) => ({
        ...todo,
        completed: index === todoId ? !todo.completed : todo.completed,
    }));
    renderTodos();
    addTaskToLocaleStorage(todoTasks);
}

function editTodo(todoId) {
    taskInput.value = todoTasks[todoId].task;
    editVal = todoId;
}

function deleteTodo(todoId) {
    todoTasks = todoTasks.filter((todo, index) => index !== todoId);
    editVal = -1;
    renderTodos();
    addTaskToLocaleStorage(todoTasks);
}

function addTaskToLocaleStorage(todoTasks) {
    localStorage.setItem("tasks", JSON.stringify(todoTasks));
}

function getTaskfromLocaleStorage() {
    if (localStorage.tasks) {
        return JSON.parse(localStorage.getItem('tasks'))
    }
}
