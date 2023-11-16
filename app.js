const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
//template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs', // định nghĩa extname (đuôi file handlebar)
  helpers: {
    eq: function (a, b) {
      return a === b;
    },

    sum: (a, b) => a + b, // tạo function cộng
  }
}));
//set view engine is handlebars 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));


const session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//route
/**
 * app.get('/', function (req, res){
     res.send('Hello World!')
    })
 */

// app.get('/magicpost', (req, res) => {
//   res.render('home');
// })


const managerRouter = require('./routes/manager');
app.use(managerRouter);

//localhost: 127.0.0.1
const db = require('./config/db');
db.connect();

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render('error', { error: err });
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//Ctrl + C// close port
//nodemon: auto listening change in file
// npm start