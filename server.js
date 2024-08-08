const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const personRoutes = require('./routes/personroutes');
const db = require('./db');
const person = require('./models/person');




app.use('/person',personRoutes);
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});