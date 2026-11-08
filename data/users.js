// Встроенные отладочные аккаунты. Пользователь их не видит.
// Новые пользователи регистрируются и хранятся в localStorage.
const testUsers = {
  "tester1": { password: "111", name: "Алексей (Тест 1)", score: 0,   completedByRoute: {}, currentRoute: null },
  "tester2": { password: "222", name: "Мария (Тест 2)",   score: 100, completedByRoute: { polytech: [1] }, currentRoute: "polytech" },
  "tester3": { password: "333", name: "Иван (Тест 3)",    score: 250, completedByRoute: { polytech: [1, 2] }, currentRoute: "polytech" },
  "tester4": { password: "444", name: "Дмитрий (Тест 4)", score: 0,   completedByRoute: {}, currentRoute: null },
  "tester5": { password: "555", name: "Елена (Тест 5)",   score: 500, completedByRoute: { polytech: [1, 2, 3] }, currentRoute: "polytech" }
};
