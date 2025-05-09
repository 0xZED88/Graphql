import { loginUser, logoutUser } from "./auth/auth.js";
import { fetchUserData } from "./graphql/data.js";
import { renderProfile, renderProfileCharts } from "./components/profile.js";

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

export function renderLogin() {
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
// async function renderDashboard() {
//   const appContainer = document.getElementById("app");
//   if (!appContainer) return;

//   appContainer.innerHTML = `
//     <header>
//       <h1>Student Dashboard</h1>
//       <button id="logout">Logout</button>
//     </header>
//     <main>
//       <div id="loading">Fetching....</div>
//       <section id="profile"></section>
//       <div id="profileError" class="error"></div>
//     </main>
//   `;

//   // Setup logout button
//   document.getElementById("logout")?.addEventListener("click", logoutUser);

//   try {
//     const userData = await fetchUserData();
//     const profileElement = document.getElementById("profile");

//     document.getElementById("loading")?.remove();

//     if (profileElement) {
//       profileElement.innerHTML = await renderProfile(userData);
//       renderProfileCharts(userData);
//     }
//   } catch (error) {
//     document.getElementById("loading")?.remove();
//     const main = document.querySelector("main");
//     if (main) {
//       main.innerHTML = `
//         <div class="no-data-container">
//         No Data Found :/
//         </div>
//       `;
//     }
//   }
// }

async function renderDashboard() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <header>
      <h1>Student Dashboard</h1>
      <button id="logout">Logout</button>
    </header>
    <main>
      <div id="loading">Fetching....</div>
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

    const main = document.querySelector("main");
    if (main) {
      main.innerHTML = `
        <div class="no-data-container">
        No Data Found :/
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
