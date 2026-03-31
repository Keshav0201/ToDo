async function signup() {
  const emailContainer = document.getElementById("signup-email");
  const email = emailContainer.value;
  const passContainer = document.getElementById("signup-password");
  const password = passContainer.value;
  if (!email) return;
  if (!password) return;

  try {
    const response = await fetch(`${baseURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    const token = data.result.token;
    localStorage.setItem("token",token);
    alert("Signned Up successfully");

    window.location.href="tasks.html";

  } catch (err) {
    console.error("Error:", err);
    return;
  }
}

async function login() {
  const emailContainer = document.getElementById("login-email");
  const email = emailContainer.value;
  const passContainer = document.getElementById("login-password");
  const password = passContainer.value;
  if (!email) return;
  if (!password) return;

  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    const token = data.result.token;
    localStorage.setItem("token",token);
    alert("Logged In successfully");

    window.location.href="tasks.html";

  } catch (err) {
    console.error("Error:", err);
    return;
  }
}

async function checkLogin() {
    if(localStorage.getItem("token")){
        window.location.href="tasks.html";
    }
}

document.getElementById("login-password")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("login-btn").click();
    }
});

document.getElementById("signup-password")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      document.getElementById("signup-btn").click();
    }
});

checkLogin();