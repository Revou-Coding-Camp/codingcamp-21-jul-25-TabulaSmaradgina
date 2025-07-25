
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const todoListBody = document.getElementById('todo-list');
const filterBtn = document.getElementById('filter-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks(filterStatus = 'all') {
    todoListBody.innerHTML = '';


    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') {
            return true;
        } else if (filterStatus === 'pending') {
            return !task.completed;
        } else if (filterStatus === 'completed') {
            return task.completed;
        }
    });


    if (filteredTasks.length === 0) {
        const row = todoListBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = 'No tasks found.';
        return;
    }


    filteredTasks.forEach((task, index) => {
        const row = todoListBody.insertRow();


        const taskCell = row.insertCell(0);
        taskCell.textContent = task.name;


        const statusCell = row.insertCell(1);
        const statusButton = document.createElement('button');
        statusButton.textContent = task.completed ? 'Done' : 'Pending';
        statusButton.style.backgroundColor = task.completed ? '#28a745' : '#ffc107';
        statusButton.style.color = '#fff';
        statusButton.style.border = 'none';
        statusButton.style.borderRadius = '3px';
        statusButton.style.padding = '5px 10px';
        statusButton.style.cursor = 'pointer';
        statusButton.onclick = () => toggleTaskStatus(task.id);
        statusCell.appendChild(statusButton);
        
        
        const dateCell = row.insertCell(2);
        dateCell.textContent = task.date;
        
        
        const actionsCell = row.insertCell(3);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = '#dc3545';
        deleteButton.style.color = '#fff';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '3px';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.onclick = () => deleteTask(task.id);
        actionsCell.appendChild(deleteButton);
    });
}


function addTask() {
    const taskName = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (taskName === '') {
        alert('Please enter a task!');
        return;
    }

    if (taskDate === '') {
        alert('Please select a date!');
        return;
    }


    const newTask = {
        id: Date.now(),
        name: taskName,
        date: taskDate,
        completed: false
    };


    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    dateInput.value = '';
}


function toggleTaskStatus(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(); 
    renderTasks();
}


function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}


function filterTasks() {
    const currentFilter = filterBtn.dataset.filter || 'all';
    let newFilter = 'all';

    if (currentFilter === 'all') {
        newFilter = 'pending';
    } else if (currentFilter === 'pending') {
        newFilter = 'completed';
    } else if (currentFilter === 'completed') {
        newFilter = 'all';
    }

    filterBtn.dataset.filter = newFilter;
    filterBtn.textContent = `Filter: ${newFilter.charAt(0).toUpperCase() + newFilter.slice(1)}`;
    renderTasks(newFilter);
}


function deleteAllTasks() {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}


addBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addTask();
});

filterBtn.addEventListener('click', filterTasks);
deleteAllBtn.addEventListener('click', deleteAllTasks);


document.addEventListener('DOMContentLoaded', renderTasks);