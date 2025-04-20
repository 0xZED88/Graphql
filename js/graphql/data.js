// js/graphql/data.js
const GRAPHQL_ENDPOINT =
  "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

// export async function fetchUserData() {
//   const token = localStorage.getItem("jwt");
//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   // Define all queries directly in this file

//   // js/graphql/data.js
//   const queries = {
//     userInfo: `{
//     user {
//       id
//       login
//       email
//       firstName
//       lastName
//       auditRatio
//       progresses(where: {isDone: {_eq: true}}) {
//         object {
//           name
//           type
//         }
//         grade
//         createdAt
//       }
//       results(where: {grade: {_eq: 1}}) {
//         path
//         object {
//           name
//         }
//       }
//     }
//   }`,

//   xpData: `{
//     transaction(
//       where: {
//         type: {_eq: "xp"},
//         path: {_iregex: "/oujda/module/"}
//       }
//       order_by: {amount: desc}
//     ) {
//       id
//       amount
//       createdAt
//       path
//     }
//   }`,

//     //   xpData: `{
//     //   transaction(
//     //     where: {
//     //       type: {_eq: "xp"},
//     //       path: {
//     //         _niregex: "(piscine-js/|piscine-go)"
//     //       }
//     //     }
//     //     order_by: {amount: desc}
//     //   ) {
//     //     id
//     //     amount
//     //     createdAt
//     //     path
//     //   }
//     // }`,

//     passFailRatios: `{
//     modulePass: progress_aggregate(
//       where: {_and: [
//         {path: {_like: "/oujda/module/%"}},
//         {grade: {_gt: 1}}
//       ]}
//     ) { aggregate { count } },
//     moduleFail: progress_aggregate(
//       where: {_and: [
//         {path: {_like: "/oujda/module/%"}},
//         {grade: {_lt: 1}}
//       ]}
//     ) { aggregate { count } }
//   }`,

//     // transactionCount: `{
//     //   transaction_aggregate(where: {
//     //     type: {_eq: "xp"},
//     //     path: {_regex: "/oujda/module/[a-z-]+$"}
//     //   }) {
//     //     aggregate {
//     //       count
//     //     }
//     //   }
//     // }`
//   };

//   try {
//     // Fetch all data in parallel
//     // const [userData, xpQueryData, ratioData] = await Promise.all([
//     //   makeGraphQLRequest(token, queries.userInfo),
//     //   makeGraphQLRequest(token, queries.xpData),
//     //   makeGraphQLRequest(token, queries.passFailRatios),
//     // ]);
//     const [userData, xpQueryData, ratioData, countData] = await Promise.all([
//       makeGraphQLRequest(token, queries.userInfo),
//       makeGraphQLRequest(token, queries.xpData),
//       makeGraphQLRequest(token, queries.passFailRatios),
//       //makeGraphQLRequest(token, queries.transactionCount),
//     ]);

//     // Process the data
//     const user = userData.data.user[0];
//     const transactions = xpQueryData.data.transaction;
//     console.log("Filtered transactions count:", transactions.length); // Should now show 67
//   console.log("All filtered transactions:", transactions);

//     const xpData = processXPData(transactions);

//     const progressData = processProgressData(user.progresses);
//     const ratios = processRatios(ratioData.data);
//     //console.log("XpDATA ==", xpData);

//     // return {
//     //   user,
//     //   ...xpData,
//     //   ...progressData,
//     //   ...ratios,
//     //   completedProjects: user.results.length,
//     // };

//     return {
//       user,
//       ...xpData,
//       ...progressData,
//       ...ratios,
//       completedProjects: user.results.length,
//       transactionCount: transactions.length, // Use the actual array length
//     };
//   } catch (error) {
//     console.error("Failed to fetch user data:", error);
//     throw error;
//   }
// }

// function processXPData(transactions) {
//   const projectXP = {};
//   const dailyXP = []; // This will store our daily XP data

//   // Group by date and calculate daily XP
//   const xpByDate = {};
//   transactions.forEach((transaction) => {
//     const date = new Date(transaction.createdAt).toISOString().split("T")[0];
//     xpByDate[date] = (xpByDate[date] || 0) + transaction.amount;

//     // Project XP calculation
//     const projectName = transaction.path.split("/").pop();
//     projectXP[projectName] = (projectXP[projectName] || 0) + transaction.amount;
//   });

//   const validTransactions = transactions.filter(t =>
//     t.path.startsWith('/oujda/module/') &&
//     !t.path.includes('piscine-go') // Only exclude piscine-go if needed
//   );

//   // Convert to dailyXP array format
//   for (const date in xpByDate) {
//     dailyXP.push({
//       date: date,
//       xp: xpByDate[date],
//     });
//   }

//   return {
//     totalXP: transactions.reduce((sum, t) => sum + t.amount, 0),
//     projects: Object.entries(projectXP)
//       .map(([name, xp]) => ({ name, xp }))
//       .sort((a, b) => b.xp - a.xp),
//     dailyXP: dailyXP.sort((a, b) => new Date(a.date) - new Date(b.date)), // Sort by date
//   };
// }

// Helper function for making GraphQL requests

// export async function fetchUserData() {
//   const token = localStorage.getItem("jwt");
//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   const queries = {
//     userInfo: `query {
//       user {
//         id
//         login
//         email
//         firstName
//         lastName
//         auditRatio
//         progresses(where: {isDone: {_eq: true}}) {
//           object {
//             name
//             type
//           }
//           grade
//           createdAt
//           path
//         }
//         results(where: {grade: {_eq: 1}}) {
//           path
//           object {
//             name
//           }
//         }
//       }
//     }`,

//     xpTransactions: `query {
//       transaction(
//         where: {
//           type: {_eq: "xp"},
//           _or: [
//             {path: {_iregex: "^/oujda/module/checkpoint/.+"}},
//             {path: {_iregex: "^/oujda/module/module/.+"}},
//             {path: {_iregex: "^/oujda/module/[^/]+$"}}
//           ]
//         }
//         order_by: {amount: desc}
//       ) {
//         id
//         amount
//         createdAt
//         path
//       }
//     }`,

//     skills: `query {
//       skillsTransactions: transaction(
//         where: {type: {_regex: "^skill_"}}
//         order_by: [{type: asc}, {createdAt: desc}]
//         distinct_on: type
//       ) {
//         type
//         amount
//       }
//     }`,
//   };

//   try {
//     const [userData, xpTransactionsData, skillsData] = await Promise.all([
//       makeGraphQLRequest(token, queries.userInfo),
//       makeGraphQLRequest(token, queries.xpTransactions),
//       makeGraphQLRequest(token, queries.skills),
//     ]);

//     const user = userData.data.user[0];
//     const transactions = xpTransactionsData.data.transaction;
//     const transactionCount =
//       xpCountData.data.transaction_aggregate.aggregate.count;

//     console.log("Transaction count from server:", transactionCount);
//     console.log("Transactions received:", transactions.length);
//     console.log(
//       "Sample paths:",
//       transactions.slice(0, 5).map((t) => t.path)
//     );

//     const xpData = processXPData(transactions, transactionCount);
//     const progressData = processProgressData(user.progresses);
//     //const ratios = processRatios(ratioData.data);

//     return {
//       user,
//       ...xpData,
//       ...progressData,
//       completedProjects: user.results.length,
//       transactionCount: transactions.length,
//       skills: skillsData.data.skillsTransactions,
//     };
//   } catch (error) {
//     console.error("Failed to fetch user data:", error);
//     throw error;
//   }
// }

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
    }`
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
    console.log("Sample paths:", transactions.slice(0, 5).map(t => t.path));

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
    dailyXP: dailyXP.sort((a, b) => new Date(a.date) - new Date(b.date))
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

// function processRatios(ratioData) {
//   const pass = ratioData.modulePass.aggregate.count;
//   const fail = ratioData.moduleFail.aggregate.count;
//   const total = pass + fail;
//   const ratio = total > 0 ? (pass / total) * 100 : 0;

//   return {
//     passCount: pass,
//     failCount: fail,
//     passRatio: ratio,
//     totalAttempts: total,
//   };
// }
