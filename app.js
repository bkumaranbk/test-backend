const express = require('express');
const session = require('express-session');
const calendarRoutes = require('./routes/calendarRoutes');
require('dotenv').config();
const cors = require('cors')

const app = express();
app.use(cors())
const PORT = process.env.PORT || 8000;

app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
}));

app.use('/api', calendarRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Google Calendar Integration!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
