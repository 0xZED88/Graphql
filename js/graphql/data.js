import { renderLogin } from "../app.js";

const GraphiQL =
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
    distinct_on: type
    where: {type: {_like: "skill_%"}}
    order_by: [{type: asc}, {amount: desc}]
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
    alert(error)
    renderLogin()
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
  const response = await fetch(GraphiQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("JWT invalid");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error("JWT invalid");
  }

  return result;
}
