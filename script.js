const taskInput = document.getElementById("taskInput");
const runButton = document.getElementById("runButton");
const taskDisplay = document.getElementById("taskDisplay");
const statusDisplay = document.getElementById("status");

runButton.addEventListener("click", function () {

    const task = taskInput.value;

    if (task.trim() === "") {
        taskDisplay.textContent = "Please enter a task.";
        return;
    }

    taskDisplay.textContent = task;
    statusDisplay.textContent = "● WORKING";
});