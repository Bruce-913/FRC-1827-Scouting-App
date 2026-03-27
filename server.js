const express = require('express');
// const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// // ===== SQLite setup =====
const db = new sqlite3.Database('./app.db');
db.serialize(() => {  
  // USERS TABLE
  db.run(`CREATE TABLE IF NOT EXISTS team_data (
    teamName TEXT,
    teamNumber TEXT, 
    robotDimensions TEXT,
    driveTrain TEXT,
    bumpCross TEXT,
    underTrench TEXT,
    pickupGround TEXT,
    pickupPlayer TEXT,
    hang TEXT,
    hangAuto TEXT
    )`
  );
});

    /* Middleware*/
app.use(express.urlencoded({ extended: true }));
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
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/homePage.html'))
});

app.get('/scouting', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/scouting.html'))
});

app.get('/teamSort', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/teamSort.html'))
});

app.get('/api/team_data', (req, res) => {
  sql = `SELECT teamName, teamNumber, robotDimensions, driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto
  FROM team_data`
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/scoutForm', (req, res) => {
    const {teamName, teamNumber, robotDimensions, driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto} = req.body;

    db.run(
        `INSERT INTO team_data (teamName, teamNumber, robotDimensions,driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            teamName,
            teamNumber,
            robotDimensions,
            driveTrain,
            bumpCross,
            underTrench,
            pickupGround,
            pickupPlayer,
            hang,
            hangAuto
        ],
        (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Database error');}
        res.redirect('/teamSort');
        }
    );
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).send(page('Not Found', `<h1>404</h1><p>Page not found: ${req.path}</p><a href="/">Home</a>`));
});

// ===== Start =====
app.listen(PORT, () => console.log(`LoginBuddy running: http://localhost:${PORT}`));

  