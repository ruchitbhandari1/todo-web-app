const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  taskBox = document.querySelector(".task-box"),
  clearAll = document.querySelector(".controls .clear-btn");

let editId;
let isEditingTask = false;

// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";

      if (filter == todo.status || filter == "all") {
        li += `<li class="task">
                <label for="${id}">
                    <input ${isCompleted} onclick="updateStatus(this)" type="checkbox" name="" id="${id}">
                    <p class=${isCompleted}>${todo.name}</p>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis-vertical"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                            Edit
                        </li>
                        <li onclick="deleteTask(${id})">
                            <i class="fa-solid fa-trash-can"></i>
                            Delete
                        </li>
                    </ul>
                </div>
            </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all");

function updateStatus(selectedTask) {
  // getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function deleteTask(deleteId) {
  // removing selected task from todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditingTask = true;
  taskInput.value = taskName;
  showTodo("all");
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditingTask) {
      if (!todos) {
        // if todos isn't exist, pass an empty array to todos
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo); // adding new task to todos
    } else {
      isEditingTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});

clearAll.addEventListener("click", () => {
  // removing all task from todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});
