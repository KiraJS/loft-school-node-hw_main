const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:12345@ds231199.mlab.com:31199/loft-school-node');

require('./models/user');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ type: 'text/plain' }));
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  res.status(404).json({err: '404'});
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({err: '500'});
});

app.listen(3000, function() {
  console.log('Server is running on port 3000');
});
