import { loginUser, logoutUser } from "./auth/auth.js";
import { fetchUserData } from "./graphql/data.js";
import { renderProfile, renderProfileCharts } from "./components/profile.js";

// Initialize the app
function initApp() {
  try {
    const appContainer = document.getElementById("app");
    if (!appContainer) throw new Error("App container not found");

    const token = localStorage.getItem("jwt");
    if (token) {
      renderDashboard();
    } else {
      renderLogin();
    }
  } catch (error) {
    console.error("App initialization failed:", error);
    document.body.innerHTML = `
      <div class="error">
        <h1>Application Error</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()">Reload</button>
      </div>
    `;
  }
}

// Render login page
function renderLogin() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="login-container">
      <h1>Login</h1>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Username or Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
      <div id="loginError" class="error"></div>
    </div>
  `;

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
}

// Handle login submission
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("loginError");

  try {
    errorElement.textContent = "";
    const success = await loginUser(username, password);
    if (success) {
      renderDashboard();
    }
  } catch (error) {
    //console.error("Login failed:", error);
    errorElement.textContent = "Login failed: invalid credentials";
    errorElement.style.display = "block";
  }
}

// Render dashboard
async function renderDashboard() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <header>
      <h1>Zone01 Profile</h1>
      <button id="logout">Logout</button>
    </header>
    <main>
      <div id="loading">Loading profile...</div>
      <section id="profile"></section>
      <div id="profileError" class="error"></div>
    </main>
  `;

  // Setup logout button
  document.getElementById("logout")?.addEventListener("click", logoutUser);

  try {
    const userData = await fetchUserData();
    const profileElement = document.getElementById("profile");

    document.getElementById("loading")?.remove();

    if (profileElement) {
      profileElement.innerHTML = await renderProfile(userData);
      renderProfileCharts(userData);
    }
  } catch (error) {
    document.getElementById("loading")?.remove();
    const errorElement = document.getElementById("profileError");
    if (errorElement) {
      errorElement.textContent = `Error: ${error.message}`;
    }
    console.error("Dashboard error:", error);
  }
}

// Start the app
document.addEventListener("DOMContentLoaded", initApp);
