const token = localStorage.getItem("token");
let currentTab = "pending";

async function loadTasks() {
  if (!token) {
    window.location.href = "/auth.html";
  }

  const pendingList = document.getElementById("pending-list");
  const completedList = document.getElementById("completed-list");

  renderMessage(pendingList, "Loading...");
  renderMessage(completedList, "Loading...");

  try {
    const response = await fetchWithRetry(`${baseURL}/api/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = data.todos.filter(t => !t.completed);
    const completedTasks = data.todos.filter(t => t.completed);

    if (pendingTasks.length === 0) {
      renderMessage(pendingList, "No Pending Tasks");
    }

    if (completedTasks.length === 0) {
    renderMessage(completedList, "No Completed Tasks");
    }

    data.todos.forEach((task) => {
      const li = document.createElement("li");

      // Title
      const title = document.createElement("span");
      title.textContent = task.title;

      // Due Date
      const due = document.createElement("small");
      if (task.due_date) {
        const date = new Date(task.due_date).toISOString().split("T")[0];
        due.textContent = `Due: ${date}`;
      }

      const left = document.createElement("div");
      left.appendChild(title);
      left.appendChild(due);

      li.appendChild(left);

      // BUTTON LOGIC
      if (!task.completed) {
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.onclick = () => editTask(task.id, completeBtn);
        li.appendChild(completeBtn);

        pendingList.appendChild(li);
      } else {
        title.classList.add("completed");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id, deleteBtn);
        li.appendChild(deleteBtn);

        completedList.appendChild(li);
      }
    });
  } catch (err) {
    console.error("Network error:", err);
  }
}

async function deleteTask(id, button) {
  button.innerText = "Deleting";
  button.disabled = true;

  if (!token) {
    window.location.href = "/auth.html";
  }
  try {
    const response = await fetchWithRetry(`${baseURL}/api/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    loadTasks();
  } catch (error) {
    console.error("Network error:", error);
  }
  button.innerText = "Delete";
  button.disabled = false;
}

async function addTask() {
  const input = document.getElementById("task-input");
  const title = input.value;
  const button = document.getElementById("task-input-button");
  button.innerText = "Adding";
  button.disabled = true;
  const date = document.getElementById("date-input");
  const due_date = date.value;

  if (!token) {
    window.location.href = "/auth.html";
  }

  if (!title) return;

  try {
    const response = await fetchWithRetry(`${baseURL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title , due_date}),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    input.value = "";
    loadTasks();
  } catch (error) {
    console.error("Error:", error);
  }
  button.innerText = "Add";
  button.disabled = false;
  closeDialog();
}

async function editTask(id, button) {
  button.innerText = "Loading";
  button.disabled = true;
  if (!token) {
    window.location.href = "/auth.html";
  }
  try {
    const response = await fetchWithRetry(`${baseURL}/api/update/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    loadTasks();
  } catch (error) {
    console.error("Error:", error);
  }
  button.innerText = "Completed";
  button.disabled = true;
}

function renderMessage(list, message) {
  list.innerHTML = "";

  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = message;

  li.appendChild(span);
  list.appendChild(li);
}

function showTab(tab) {
  currentTab = tab;
  const pending = document.getElementById("pending-list");
  const completed = document.getElementById("completed-list");

  const pendingTab = document.getElementById("pending-tab");
  const completedTab = document.getElementById("completed-tab");

  if (tab === "pending") {
    pending.classList.remove("hidden");
    completed.classList.add("hidden");

    pendingTab.classList.add("active");
    completedTab.classList.remove("active");
  } else {
    completed.classList.remove("hidden");
    pending.classList.add("hidden");

    completedTab.classList.add("active");
    pendingTab.classList.remove("active");
  }
}

function toggleSection(id) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
}

function openDialog(){
  const dialog = document.querySelector(".input-dialog");
  dialog.classList.remove("hidden");
}

function closeDialog(){
  console.log("clicked");
  const dialog = document.querySelector(".input-dialog");
  dialog.classList.add("hidden");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

document
  .getElementById("task-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("task-input-button").click();
    }
  });

loadTasks();
showTab(currentTab);