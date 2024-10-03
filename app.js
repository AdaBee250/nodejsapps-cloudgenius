const express = require('express');
const app = express();
const path = require('path');

let votes = { true: 0, false: 0 };

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Route for the home page
app.get('/', (req, res) => {
  res.render('index', { votes });
});

// Route to handle the vote submission
app.post('/vote', (req, res) => {
  const vote = req.body.vote;
  if (vote === 'true') {
    votes.true += 1;
  } else if (vote === 'false') {
    votes.false += 1;
  }
  res.redirect('/');
});

// Change port to 3077
const PORT = process.env.PORT || 3077;
app.listen(PORT, () => {
  console.log(`CloudGenius Voting App running on port ${PORT}`);
});
