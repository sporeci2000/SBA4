let tasks = [];

document.getElementById("addTaskButton").addEventListener("click", addTask);

function addTask() {
    const name = document.getElementById("taskName").value;
    const category = document.getElementById("taskCategory").value;
    const deadline = document.getElementById("taskDeadline").value;
    const status = document.getElementById("taskStatus").value;

    if (name === "" || category === "" || deadline === "") {
        alert("Please fill out all fields to add a new task");
        return;
    }

    const task = {
        name,
        category,
        deadline,
        status
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    clearForm();
}

function checkOverdue(task) {
    const today = new Date().toISOString().split("T")[0];
    if (task.status !== "Completed" && task.deadline < today) {
        task.status = "Overdue";
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        displayTasks();
    }
}

window.onload = loadTasks;


document.getElementById("statusFilter").addEventListener("change", displayTasks);
document.getElementById("categoryFilter").addEventListener("change", displayTasks);

function displayTasks() {
    const statusFilter = document.getElementById("statusFilter").value;
    const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        checkOverdue(task);

        if (
            (statusFilter && statusFilter !== "" && task.status !== statusFilter) ||
            (categoryFilter !== "all" && categoryFilter && task.category.toLowerCase() !== categoryFilter)
        ) {
            return;
        }

        const taskItem = document.createElement("li");
        taskItem.className = "task";

        taskItem.innerHTML = `
  <div class="task-content">
    <strong>${task.name}</strong> - ${task.category} - Due: ${task.deadline}
  </div>
  <div class="task-controls">
    <select data-index="${index}" class="status-select">
      <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
      <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
      <option value="Overdue" ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
    </select>
    <button class="edit-btn" data-index="${index}">Edit</button>
    <button class="delete-btn" data-index="${index}">Delete task</button>
  </div>
`;

        taskList.appendChild(taskItem);
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks[index].status = e.target.value;
            saveTasks();
            displayTasks();
        });
    });


    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const task = tasks[index];

            const newName = prompt("Edit task name:", task.name);
            const newCategory = prompt("Edit category:", task.category);
            const newDeadline = prompt("Edit deadline (YYYY-MM-DD):", task.deadline);
            const newStatus = prompt("Edit status (In Progress, Completed, Overdue):", task.status);

            if (newName && newCategory && newDeadline && newStatus) {
                tasks[index] = {
                    name: newName,
                    category: newCategory,
                    deadline: newDeadline,
                    status: newStatus
                };

                saveTasks();
                displayTasks();
            } else {
                alert("Edit cancelled or invalid input.");
            }
        });
    });


    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });
    });


}