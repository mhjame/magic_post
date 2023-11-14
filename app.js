const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

const route = require('./routes/manager')
//template engine
app.engine('hbs', handlebars.engine({
    extname:'.hbs', // định nghĩa extname (đuôi file handlebar)
}));
//set view engine is handlebars 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//middlewware for body
app.use(
  express.urlencoded({
      extended: true,
  }),
); 
app.use(express.json());
//route
/**
 * app.get('/', function (req, res){
     res.send('Hello World!')
    })
 */

// app.get('/magicpost', (req, res) => {
//   res.render('home');
// })


// const managerRouter = require('./routes/manager');
// app.use(managerRouter);

//localhost: 127.0.0.1
const db = require('./config/db');
db.connect();

//Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//Ctrl + C// close port
//nodemon: auto listening change in file 
// npm start