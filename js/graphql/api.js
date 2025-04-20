const GRAPHQL_ENDPOINT =
  "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function getUserData() {
  const token = localStorage.getItem("jwt");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            user {
              id
              login
              email
              firstName
              lastName
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      throw new Error(errors[0].message || "Unknown GraphQL error");
    }

    return data.user[0];
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}
