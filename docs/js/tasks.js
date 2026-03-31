const token = localStorage.getItem("token");

async function loadTasks() {
  if (!token) {
    window.location.href = "/auth.html";
  }
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

    const taskList = document.getElementById("task-list-container");
    taskList.innerHTML = "";

    data.todos.forEach((task) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = task.title;

      li.appendChild(span);
      if (!task.completed) {
        const completedBtn = document.createElement("button");
        completedBtn.textContent = "Completed";
        completedBtn.onclick = () => editTask(task.id);
        li.appendChild(completedBtn);
      } else {
        span.classList.toggle("completed", task.completed);
      }

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTask(task.id);

      li.appendChild(deleteBtn);

      taskList.appendChild(li);
    });
  } catch (err) {
    console.error("Network error:", err);
  }
}

async function deleteTask(id) {
  if (!token) {
    window.location.href = "/auth.html";
  }
  try {
    const response = await fetchWithRetry(`${baseURL}/api/delete/${id}`, {
      method: "DELETE",
      headers:{
        "Authorization" : `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    alert("Task deleted");
    loadTasks();
  } catch (error) {
    console.error("Network error:", error);
  }
}

async function addTask() {
  const input = document.getElementById("task-input");
  const title = input.value;
  if (!token) {
    window.location.href = "/auth.html";
  }

  if (!title) return;

  try {
    const response = await fetchWithRetry(`${baseURL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    input.value = "";
    alert("Task added");
    loadTasks();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editTask(id) {
  if (!token) {
    window.location.href = "/auth.html";
  }
  try {
    const response = await fetchWithRetry(`${baseURL}/api/update/${id}`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${token}`,
      }
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    alert("Task completed YAYYYY");
    loadTasks();
  } catch (error) {
    console.error("Error:", error);
  }
}

function logout(){
  localStorage.removeItem("token");
  window.location.href="index.html";
}

document.getElementById("task-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("task-input-button").click();
    }
});

loadTasks();
