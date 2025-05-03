const GRAPHQL_ENDPOINT =
  "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function fetchUserData() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const queries = {
    userInfo: ` {
      user {
        id
        login
        email
        auditRatio
      }
    }`,

    xpTransactions: `  {
    transaction(
        where : {
            type : {_eq : "xp"}
            path : {
                _niregex : "(piscine-js/|piscine-go)"
            }
        }
        order_by: {amount : desc}
    ) {
        id
        amount
        createdAt
        path
    }
    }`,

    skills: ` {
      skillsTransactions: transaction(
        where: {type: {_regex: "^skill_"}}
        order_by: [{type: asc}, {createdAt: desc}]
        distinct_on: type
      ) {
        type
        amount
      }
    }`,
  };

  try {
    const [userData, xpTransactionsData, skillsData] = await Promise.all([
      makeGraphQLRequest(token, queries.userInfo),
      makeGraphQLRequest(token, queries.xpTransactions),
      makeGraphQLRequest(token, queries.skills),
    ]);

    const user = userData.data.user[0];
    const transactions = xpTransactionsData.data.transaction;

    const xpData = processXPData(transactions);

    return {
      user,
      ...xpData,
      transactionCount: transactions.length,
      skills: skillsData.data.skillsTransactions,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

function processXPData(transactions) {
  const projectXP = {};

  transactions.forEach((transaction) => {
    const pathParts = transaction.path.split("/");
    const projectName = pathParts[pathParts.length - 1];
    projectXP[projectName] = (projectXP[projectName] || 0) + transaction.amount;
  });

  return {
    totalXP: transactions.reduce((sum, t) => sum + t.amount, 0),
    projects: Object.entries(projectXP)
      .map(([name, xp]) => ({ name, xp }))
      .sort((a, b) => b.xp - a.xp),
  };
}

async function makeGraphQLRequest(token, query) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(errors[0].message || "GraphQL error");
  }

  return { data };
}
