const newTaskInput  = document.querySelector('#new-task-input');
const addTaskButton = document.querySelector('#add-task-button');
const tasksDiv      = document.querySelector('.tasks-list');

let tasksList = [];

const tasks = JSON.parse(localStorage.getItem('tasks'));

if(tasks) {
  tasksList = Array.from(tasks);
  updateDisplayedTasks();
}

newTaskInput.addEventListener('keydown', (event) => {
  if(event.key == "Enter") {
    newTask();
  }
})

addTaskButton.addEventListener('click', () => {
  newTask();
})

function newTask() {
  //check if title is empty.
  if(!newTaskInput.value.trim()) {
    return;
  }

  const task = createTaskObject(newTaskInput.value);
  updateLocalStorage();

  DisplayTask(createTaskElement(task.title, 'pending', task.id));

  newTaskInput.value = '';
}

function createTaskObject(title) {
  const task = {
    title: newTaskInput.value,
    id: (tasksList.length + 1),
    status: "pending"
  }

  tasksList.push(task);

  return task;
}

function createTaskElement(title, status, id) {
  const taskElement    = createElement('div', 'class', 'task');
  const taskInfo       = createElement('div', 'class', 'task-info');
  const customCheckbox = createElement('div', 'class', 'custom-checkbox');

  const completedCheckbox = createElement('input', 'type', 'checkbox')
  completedCheckbox.setAttribute('id', 'completed-checkbox')
  completedCheckbox.setAttribute('onchange', `updateTaskStatus(${id})`)
  
  if(status == "completed") {
    completedCheckbox.setAttribute('checked', 'true')
  }

  const checkIcon  = createElement('i', 'class', 'fa-solid fa-check');
  const deleteIcon = createElement('i', 'class', 'fa-regular fa-trash-can');
  deleteIcon.setAttribute('id', 'delete-task');
  deleteIcon.setAttribute('onclick', `deleteTask(${id})`);

  const taskTitle = document.createElement('span');
  taskTitle.textContent = title;

  customCheckbox.appendChild(checkIcon);
  
  taskInfo.appendChild(completedCheckbox);
  taskInfo.appendChild(customCheckbox);
  taskInfo.appendChild(taskTitle);

  taskElement.appendChild(taskInfo);
  taskElement.appendChild(deleteIcon);

  return taskElement;
}

function createElement(element, attribute, attributeName) {
  const newElement = document.createElement(element);
  newElement.setAttribute(attribute, attributeName);

  return newElement;
}

function DisplayTask(element) {
  tasksDiv.appendChild(element)
}

function deleteTask(taskID) {
  const taskIndex = --taskID;

  tasksList.splice(taskIndex, 1);

  updateTasksID();
  updateLocalStorage();
  updateDisplayedTasks();
}

function updateTasksID() {
  let taskID = 1;

  tasksList.forEach((task) => {
    task.id = taskID;

    taskID++;
  })

  updateLocalStorage();
}

function updateDisplayedTasks() {
  tasksDiv.innerHTML = '';

  tasksList.forEach((task) => {
    tasksDiv.appendChild(createTaskElement(task.title, task.status, task.id))
  })
}

function updateTaskStatus(taskID) {
  const taskIndex = --taskID;

  const isTaskCompleted = tasksList[taskIndex].status == "completed";

  isTaskCompleted ? tasksList[taskIndex].status = "pending" : tasksList[taskIndex].status = "completed";

  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasksList));
}