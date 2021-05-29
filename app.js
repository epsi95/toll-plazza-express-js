const express = require('express');
const helmet = require('helmet');
const path = require("path");
const ejs = require('ejs');
const receipt = require('./routes/receipt');
const homePage = require('./routes/homepage');

const app = express();

// middlewares
app.use(express.json());
app.use(helmet());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'))

app.use('/', homePage);
app.use('/api/receipt', receipt);




const port = process.env.PORT || 8080;
app.listen(port, ()=>console.log(`server started at port ${port}`));