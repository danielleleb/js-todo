'use strict';    
const addButton = document.querySelector('.add-btn');
const deleteButton = document.querySelector('.delete-btn');
const addTaskContainer = document.querySelector('.add-task-container')
const submitButton = document.querySelector('.task-submit')
const taskInput = document.querySelector('.task-input')
const taskListDisplay = document.querySelector('.select');
const undoButton = document.querySelector('.undo-btn');
const exitButton = document.querySelector('.exit');
let clone;

// Mockjax setup
$.mockjax({
    type: 'get',
    url: '/restful/taskList',
    responseTime: 0,
    responseText: {
        status: 'success',
        taskList: ['Task One', 'Task Two']
    }
});

let taskList = $.getJSON('/restful/taskList', (response) => {
      taskList = response.taskList;
})

// Clone elements to revert to on undo
const cloneList = () => {
    clone = $('.select').children().clone(true);
}

// Delete one or multiple tasks
const deleteTask = () => {
    cloneList();
    $('select').find('option:selected').remove()
}

// Display all tasks and add delete event listener
const loadTasks = () => {
    for (let i = 0; i < taskList.length; i++) {
        const option = document.createElement('option');
        option.innerHTML = taskList[i];
        taskListDisplay.appendChild(option)
        option.addEventListener('dblclick', deleteTask)
    }
}

if (taskList.length > 0) {
    loadTasks()
} else {
    setTimeout(loadTasks, 100)
}

// Add a task (and add event listener for double-click to remove)
addButton.addEventListener('click', () => {
    if (addTaskContainer.classList.contains('hidden')) {
        addTaskContainer.classList.remove('hidden')
    } else {
        addTaskContainer.classList.add('hidden')
    }
});

const addTask = () => {
    cloneList();
    const newOption = document.createElement('option');
    newOption.innerHTML = taskInput.value;
    newOption.addEventListener('dblclick', deleteTask)
    taskListDisplay.appendChild(newOption);
    taskInput.value = ''
    addTaskContainer.classList.add('hidden')
}

submitButton.addEventListener('click', addTask)
taskInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        addTask();
    }
})

// Remove a task with delete button
deleteButton.addEventListener('click', deleteTask)

// Clear select, add clone with event listener
undoButton.addEventListener('click', () => {
    $('.select').empty();
    for (let i = 0; i <clone.length; i++) {
        clone[i].addEventListener('dblclick', deleteTask)
    }
    clone.appendTo('.select')
})

// Exit modal
exitButton.addEventListener('click', () => {
    if(!addTaskContainer.classList.contains('hidden')) {
        addTaskContainer.classList.add('hidden')
    }
})

// Load initial tasks
document.addEventListener('DOMContentLoaded', loadTasks(), false);

