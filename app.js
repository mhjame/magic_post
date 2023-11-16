const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

//template engine
app.engine('hbs', handlebars.engine({
    extname:'.hbs', // định nghĩa extname (đuôi file handlebar)
    helpers: {
      sum: (a, b) => a + b,
      renderStatus: (status) => {
        switch (status) {
          case 'received':
            return 'Đã nhận';
          case 'on way to receiver':
            return 'Đang chuyển đến người nhận';
          case 'at rStation':
            return 'Đã đến điểm giao dịch đích';
          case 'on way to rStation':
            return 'Đang chuyển đến điểm giao dịch đích';
          case 'at rWarehouse':
            return 'Đã đến điểm tập kết đích';
          case 'on way to rWarehouse':
            return 'Đang chuyển đến điểm tập kết đích';
          case 'at sWarehouse':
            return 'Đang ở điểm tập kết đầu'
          case 'on way to sWarehouse':
            return 'Đang chuyển đến điểm tập kết đầu'
          case 'at sStation':
            return 'Đang ở điểm giao dịch đầu';
        }
      },
      renderPayState: (state) => {
        if (state === 'done') {
          return 'Đã đóng cước';
        } else {
          return 'Chưa đóng cước';
        }
      }
    }
}));
//set view engine is handlebars 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
//route
/**
 * app.get('/', function (req, res){
     res.send('Hello World!')
    })
 */

// app.get('/magicpost', (req, res) => {
//   res.render('home');
// })
app.use(express.static(path.join(__dirname, 'public')));

const managerRouter = require('./routes/manager');
app.use(managerRouter);

const userRouter = require('./routes/user');
app.use(userRouter);

//localhost: 127.0.0.1
const db = require('./config/db');
db.connect();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//Ctrl + C// close port
//nodemon: auto listening change in file 
// npm start