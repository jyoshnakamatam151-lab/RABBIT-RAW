/* ==========================================
   R.A.B.B.I.T. RAW
   Frontend Conversation System
========================================== */


/* =========================
   ELEMENTS
========================= */

const taskInput = document.getElementById("taskInput");
const runButton = document.getElementById("runButton");

const statusDisplay = document.getElementById("status");

const welcomeScreen = document.getElementById("welcomeScreen");
const messages = document.getElementById("messages");

const activityContainer =
    document.getElementById("activityContainer");

const resultContainer =
    document.getElementById("resultContainer");

const resultDisplay =
    document.getElementById("resultDisplay");

const topNewTaskButton =
    document.getElementById("topNewTaskButton");

const historyList =
    document.getElementById("historyList");

const fileButton =
    document.getElementById("fileButton");

const fileInput =
    document.getElementById("fileInput");

const fileList =
    document.getElementById("fileList");


/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "rabbitConversations";

let currentTaskId = null;


/* =========================
   GET SAVED TASKS
========================= */

function getTasks() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {

        console.error(
            "Could not read saved tasks:",
            error
        );

        return [];
    }
}


/* =========================
   SAVE TASKS
========================= */

function saveTasks(tasks) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}


/* =========================
   RUN TASK
========================= */

function runTask() {

    const task =
        taskInput.value.trim();

    if (!task) {
        taskInput.focus();
        return;
    }


    /* New task ID */

    currentTaskId =
        Date.now().toString();


    /* Hide welcome */

    welcomeScreen.classList.add("hidden");


    /* Clear old conversation */

    messages.innerHTML = "";

    resultContainer.classList.add("hidden");


    /* Add user message */

    addMessage(
        "user",
        task
    );


    /* Show activity */

    activityContainer.classList.remove(
        "hidden"
    );


    resetActivity();


    /* Status */

    setStatus(
        "● WORKING",
        "working"
    );


    /* Save conversation */

    const newTask = {

        id: currentTaskId,

        title:
            task.length > 35
                ? task.substring(0, 35) + "..."
                : task,

        userMessage: task,

        status: "working",

        result: "",

        createdAt:
            new Date().toISOString()

    };


    const tasks = getTasks();

    tasks.unshift(newTask);

    saveTasks(tasks.slice(0, 10));


    displayHistory();


    /* Clear input */

    taskInput.value = "";


    /* Simulate Rabbit activity */

    runActivity();

}


/* =========================
   ADD MESSAGE
========================= */

function addMessage(
    type,
    text
) {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;


    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";


    bubble.textContent = text;


    message.appendChild(bubble);

    messages.appendChild(message);


    scrollToBottom();
}


/* =========================
   RABBIT ACTIVITY
========================= */

function resetActivity() {

    const steps =
        document.querySelectorAll(
            ".activity-step"
        );

    steps.forEach(step => {

        step.classList.remove(
            "active",
            "completed"
        );

    });
}


function runActivity() {

    const steps =
        document.querySelectorAll(
            ".activity-step"
        );

    let index = 0;


    const interval =
        setInterval(() => {

            if (index > 0) {

                steps[index - 1]
                    .classList.remove("active");

                steps[index - 1]
                    .classList.add("completed");
            }


            if (index < steps.length) {

                steps[index]
                    .classList.add("active");

                index++;

                scrollToBottom();

            } else {

                clearInterval(interval);

                steps[steps.length - 1]
                    .classList.remove("active");

                steps[steps.length - 1]
                    .classList.add("completed");


                showResult();

            }

        }, 700);

}


/* =========================
   SHOW RESULT
========================= */

function showResult() {

    if (!currentTaskId) {
        return;
    }


    const result =
        `R.A.B.B.I.T. successfully processed the task "${taskInput.value || "your requested task"}". 
The system discovered relevant capabilities, retrieved information, planned an approach, executed the action and evaluated the result.`;


    resultDisplay.textContent =
        result;


    resultContainer.classList.remove(
        "hidden"
    );


    setStatus(
        "● COMPLETED",
        "completed"
    );


    /* Update saved task */

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                item.id === currentTaskId
        );


    if (task) {

        task.status =
            "completed";

        task.result =
            result;

        saveTasks(tasks);
    }


    displayHistory();


    scrollToBottom();

}


/* =========================
   NEW TASK
========================= */

function startNewTask() {

    currentTaskId = null;


    welcomeScreen.classList.remove(
        "hidden"
    );


    messages.innerHTML = "";


    activityContainer.classList.add(
        "hidden"
    );


    resultContainer.classList.add(
        "hidden"
    );


    resetActivity();


    resultDisplay.textContent =
        "No result available yet.";


    setStatus(
        "● IDLE",
        "idle"
    );


    taskInput.value = "";

    taskInput.focus();


    displayHistory();

}


/* =========================
   OPEN OLD CONVERSATION
========================= */

function openConversation(taskId) {

    const tasks =
        getTasks();


    const task =
        tasks.find(
            item =>
                item.id === taskId
        );


    if (!task) {
        return;
    }


    currentTaskId =
        task.id;


    /* Hide welcome */

    welcomeScreen.classList.add(
        "hidden"
    );


    /* Clear current */

    messages.innerHTML = "";


    /* Restore user message */

    addMessage(
        "user",
        task.userMessage
    );


    /* Restore activity */

    activityContainer.classList.remove(
        "hidden"
    );


    const steps =
        document.querySelectorAll(
            ".activity-step"
        );


    steps.forEach(step => {

        step.classList.remove(
            "active"
        );

        step.classList.add(
            "completed"
        );

    });


    /* Restore result */

    if (
        task.status === "completed" &&
        task.result
    ) {

        resultDisplay.textContent =
            task.result;

        resultContainer.classList.remove(
            "hidden"
        );

        setStatus(
            "● COMPLETED",
            "completed"
        );

    } else {

        resultContainer.classList.add(
            "hidden"
        );

        setStatus(
            "● WORKING",
            "working"
        );

    }


    /* Put task title/message in input */

    taskInput.value =
        task.userMessage;


    displayHistory();

    scrollToBottom();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(
    taskId,
    event
) {

    if (event) {
        event.stopPropagation();
    }


    let tasks =
        getTasks();


    tasks =
        tasks.filter(
            task =>
                task.id !== taskId
        );


    saveTasks(tasks);


    /* If current task deleted */

    if (currentTaskId === taskId) {

        startNewTask();

    } else {

        displayHistory();

    }

}


/* =========================
   DISPLAY HISTORY
========================= */

function displayHistory() {

    const tasks =
        getTasks();


    historyList.innerHTML = "";


    if (tasks.length === 0) {

        const empty =
            document.createElement("div");

        empty.style.color = "#666c79";
        empty.style.fontSize = "13px";
        empty.style.padding = "10px";

        empty.textContent =
            "No recent tasks";

        historyList.appendChild(empty);

        return;
    }


    tasks.forEach(task => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";


        if (
            task.id === currentTaskId
        ) {

            item.classList.add(
                "active"
            );

        }


        /* History icon */

        const icon =
            document.createElement("div");

        icon.className =
            "history-icon";

        icon.textContent =
            "◷";


        /* Title */

        const title =
            document.createElement("div");

        title.className =
            "history-title";

        title.textContent =
            task.title;


        /* Delete */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-task";

        deleteButton.title =
            "Delete task";


        /* Professional trash icon */

        deleteButton.innerHTML = `

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >

                <path
                    d="M4 7h16"
                    stroke-linecap="round"
                />

                <path
                    d="M10 11v6"
                    stroke-linecap="round"
                />

                <path
                    d="M14 11v6"
                    stroke-linecap="round"
                />

                <path
                    d="M6 7l1 13h10l1-13"
                    stroke-linejoin="round"
                />

                <path
                    d="M9 7V4h6v3"
                    stroke-linejoin="round"
                />

            </svg>

        `;


        deleteButton.addEventListener(
            "click",
            function(event) {

                deleteTask(
                    task.id,
                    event
                );

            }
        );


        /* Open conversation */

        item.addEventListener(
            "click",
            function() {

                openConversation(
                    task.id
                );

            }
        );


        item.appendChild(icon);

        item.appendChild(title);

        item.appendChild(
            deleteButton
        );


        historyList.appendChild(
            item
        );

    });

}


/* =========================
   STATUS
========================= */

function setStatus(
    text,
    type
) {

    statusDisplay.textContent =
        text;


    statusDisplay.className =
        `status ${type}`;

}


/* =========================
   FILE BUTTON
========================= */

fileButton.addEventListener(
    "click",
    function() {

        fileInput.click();

    }
);


/* =========================
   FILE SELECTION
========================= */

fileInput.addEventListener(
    "change",
    function() {

        const files =
            Array.from(
                fileInput.files
            );


        if (files.length === 0) {
            return;
        }


        const empty =
            fileList.querySelector(
                ".empty-files"
            );


        if (empty) {
            empty.remove();
        }


        files.forEach(file => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "file-item";


            const icon =
                document.createElement(
                    "span"
                );

            icon.className =
                "file-item-icon";

            icon.textContent =
                "📄";


            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "file-name";

            name.textContent =
                file.name;


            item.appendChild(icon);

            item.appendChild(name);


            fileList.appendChild(
                item
            );

        });


        /* Reset input so same file
           can be selected again */

        fileInput.value = "";

    }
);


/* =========================
   SUGGESTIONS
========================= */

document
    .querySelectorAll(".suggestion")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                taskInput.value =
                    this.textContent
                        .replace(/^[^\w]+/, "")
                        .trim();

                taskInput.focus();

            }
        );

    });


/* =========================
   SEND BUTTON
========================= */

runButton.addEventListener(
    "click",
    runTask
);


/* =========================
   ENTER TO SEND
========================= */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            runTask();

        }

    }
);


/* =========================
   NEW TASK BUTTON
========================= */

topNewTaskButton.addEventListener(
    "click",
    startNewTask
);


/* =========================
   AUTO RESIZE TEXTAREA
========================= */

taskInput.addEventListener(
    "input",
    function() {

        this.style.height = "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                130
            ) + "px";

    }
);


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    const chatArea =
        document.querySelector(
            ".chat-area"
        );


    setTimeout(() => {

        chatArea.scrollTop =
            chatArea.scrollHeight;

    }, 50);

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================
   INITIAL LOAD
========================= */

displayHistory();

setStatus(
    "● IDLE",
    "idle"
);
