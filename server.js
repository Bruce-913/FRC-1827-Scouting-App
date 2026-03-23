const express = require('express');
// const session = require('express-session');
const path = require('path');
// const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// // ===== SQLite setup =====
// const db = new sqlite3.Database('./app.db');
// db.serialize(() => {  
//   // USERS TABLE
//   db.run(`CREATE TABLE IF NOT EXISTS user_info (
//     id TEXT PRIMARY KEY,
//     firstName TEXT NOT NULL,
//     lastName TEXT NOT NULL,
//     email TEXT UNIQUE,
//     username TEXT UNIQUE NOT NULL,
//     password TEXT NOT NULL,
//     gradeLevel INTEGER,
//     schoolName TEXT,
//     roles TEXT NOT NULL,
//     status TEXT NOT NULL
//     )`
//   );
// });

app.use(express.json());
app.use(express.static('public'));

    /* Helper */
const page = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <nav class="nav">
    <div class="links">
      <a href="/">Login</a>
      <a href="/register">Register</a>
      <a href="/dashboard">Dashboard</a>
    </div>
  </nav>
  ${body}
</body>
</html>
`;

    /* |Page Routing| */
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/homePage.html'))
});

app.get('/scouting', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/scouting.html'))
});

app.get('/teamSort', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public/teamSort.html'))
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).send(page('Not Found', `<h1>404</h1><p>Page not found: ${req.path}</p><a href="/">Home</a>`));
});

// ===== Start =====
app.listen(PORT, () => console.log(`LoginBuddy running: http://localhost:${PORT}`));

  