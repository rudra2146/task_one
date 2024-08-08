const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const personRoutes = require('./routes/personRoutes'); 
const db = require('./db'); 

app.use(bodyParser.json());

app.use('/person', personRoutes);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
