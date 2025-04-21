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
        firstName
        lastName
        auditRatio
        progresses(where: {isDone: {_eq: true}}) {
          object {
            name
            type
          }
          grade
          createdAt
          path
        }
        results(where: {grade: {_eq: 1}}) {
          path
          object {
            name
          }
        }
      }
    }`,

    xpTransactions: ` {
      transaction(
        where: {
          type: {_eq: "xp"},
          _or: [
            {path: {_iregex: "^/oujda/module/checkpoint/.+"}},
            {path: {_iregex: "^/oujda/module/module/.+"}},
            {path: {_iregex: "^/oujda/module/[^/]+$"}}
          ]
        }
        order_by: {amount: desc}
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

    console.log("Transactions received:", transactions.length);
    console.log(
      "Sample paths:",
      transactions.slice(0, 5).map((t) => t.path)
    );

    const xpData = processXPData(transactions);
    const progressData = processProgressData(user.progresses);

    return {
      user,
      ...xpData,
      ...progressData,
      completedProjects: user.results.length,
      transactionCount: transactions.length,
      skills: skillsData.data.skillsTransactions,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

// Update processXPData to use the correct count
function processXPData(transactions) {
  const projectXP = {};
  const dailyXP = [];
  const xpByDate = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt).toISOString().split("T")[0];
    xpByDate[date] = (xpByDate[date] || 0) + transaction.amount;

    const pathParts = transaction.path.split("/");
    const projectName = pathParts[pathParts.length - 1];
    projectXP[projectName] = (projectXP[projectName] || 0) + transaction.amount;
  });

  for (const date in xpByDate) {
    dailyXP.push({ date, xp: xpByDate[date] });
  }

  return {
    totalXP: transactions.reduce((sum, t) => sum + t.amount, 0),
    projects: Object.entries(projectXP)
      .map(([name, xp]) => ({ name, xp }))
      .sort((a, b) => b.xp - a.xp),
    dailyXP: dailyXP.sort((a, b) => new Date(a.date) - new Date(b.date)),
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

function processProgressData(progresses) {
  const skills = {};
  const projectGrades = {};

  progresses.forEach((item) => {
    if (item.object.type === "exercise") {
      const skill = item.object.name.split(":")[0];
      skills[skill] = (skills[skill] || 0) + 1;
    } else if (item.object.type === "project") {
      projectGrades[item.object.name] = item.grade;
    }
  });

  return {
    skills: Object.entries(skills).map(([name, count]) => ({ name, count })),
    projectGrades: Object.entries(projectGrades).map(([name, grade]) => ({
      name,
      grade,
    })),
  };
}
