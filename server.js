const express = require('express');
// const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

// // ===== SQLite setup =====
const db = new sqlite3.Database('./app.db');
db.serialize(() => {  
  // USERS TABLE
  db.run(`CREATE TABLE IF NOT EXISTS team_data (
    id TEXT PRIMARY KEY,
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
      <a href="/">Home</a>
      <a href="/scouting">Scouting</a>
      <a href="/teamSort">Teams</a>
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
  sql = `SELECT id, teamName, teamNumber, robotDimensions, driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto
  FROM team_data`
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Fetch single team data
app.get('/api/team_data/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM team_data WHERE id = ?', [id], (err, row) => {
    if(err || !row) return res.status(404).json({ error: "Team not found" });
    res.json(row);
  });
});

// Update team
app.post('/api/team_data/:id/update', (req, res) => {
  const id = req.params.id;
  const { teamName, coach } = req.body;
  db.run('UPDATE team_data SET teamName = ?, coach = ? WHERE id = ?', [teamName, coach, id], err => {
    if(err) return res.status(500).json({ error: 'Update failed' });
    res.json({ success: true });
  });
});

app.post('/api/team_data/:id/delete', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM team_data WHERE id = ?', [id], err => {
    if(err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ success: true });
  });
});

app.post('/scoutForm', (req, res) => {
    const {teamName, teamNumber, robotDimensions, driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto} = req.body;

    db.run(
        `INSERT INTO team_data (id, teamName, teamNumber, robotDimensions,driveTrain, bumpCross, underTrench, pickupGround, pickupPlayer, hang, hangAuto)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            crypto.randomUUID(),
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

  