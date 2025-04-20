let authToken;

function initAuth() {
  authToken = localStorage.getItem("jwt");
}

// Login function
export async function loginUser(username, password) {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  try {
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch(
      "https://learn.zone01oujda.ma/api/auth/signin",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const token = await response.json();

    if (!token) {
      throw new Error("No token received from server");
    }

    authToken = token;
    localStorage.setItem("jwt", token);
    return true;
  } catch (error) {
    //console.error("Login error:", error);
    throw error;
  }
}

// Logout function
export function logoutUser() {
  authToken = null;
  localStorage.removeItem("jwt");
  window.location.reload();
}

// Initialize on module load
initAuth();
