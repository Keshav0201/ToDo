async function signup() {
  const emailContainer = document.getElementById("signup-email");
  const email = emailContainer.value;
  const passContainer = document.getElementById("signup-password");
  const password = passContainer.value;
  if (!email) return;
  if (!password) return;
  const button = document.getElementById("signup-button");
  button.innerText="Signing Up"
  button.disabled = true;

  try {
    const response = await fetchWithRetry(`${baseURL}/auth/signup`, {
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

    window.location.href="tasks.html";

  } catch (err) {
    console.error("Error:", err);
    return;
  }
  button.innerText="Sign Up"
  button.disabled = true;
}

async function login() {
  const emailContainer = document.getElementById("login-email");
  const email = emailContainer.value;
  const passContainer = document.getElementById("login-password");
  const password = passContainer.value;
  if (!email) return;
  if (!password) return;
  const button = document.getElementById("login-button");
  button.innerText="Logging Up"
  button.disabled = true;

  try {
    const response = await fetchWithRetry(`${baseURL}/auth/login`, {
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
    window.location.href="tasks.html";

  } catch (err) {
    console.error("Error:", err);
    return;
  }
  button.innerText="Login"
  button.disabled = true;
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