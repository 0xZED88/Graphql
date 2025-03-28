export const Auth = {
  _token: null,

  init() {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      this._token = storedToken;
    }
  },

  async login(username, password) {
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

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

      // Directly parse the response as JSON
      const token = await response.json();

      if (!token) {
        throw new Error("No token received from server");
      }

      this._token = token;
      localStorage.setItem("jwt", token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout() {
    this._token = null;
    localStorage.removeItem("jwt");
    window.location.reload();
  },

  isAuthenticated() {
    return !!this._token;
  },

  getToken() {
    return this._token;
  },
};

Auth.init();
