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
    sum: (a, b) => a + b,
    eq: function (a, b) {
      return a === b;
    },

    contain: function (a, b) {
      return a.includes(b);
    },
    renderStatus: (status) => {
      switch (status) {
        case 'returned':
          return 'Giao không thành công, trả lại điểm giao dịch';
        case 'received':
          return 'Giao hàng thành công';
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
        return 'Trả khi gửi hàng';
      } else {
        return 'Trả khi nhận hàng';
      }
    },
    formatDate: (date) => {
      if (date === null) {
        return 'Chưa nhận được';
      } else {
        return new Date(date).toLocaleDateString("vi-VN");
      }
    },
    transformToUniqueArray: (arr) => {
      const uniqueArray = new Set();
      if (Array.isArray(arr)) {

        for (let i = 0; i < arr.length; i++) {
          uniqueArray.add(arr[i].receiverAddress);
        }
      } else {
        uniqueArray.add(arr.receiverAddress);
      }

      return uniqueArray;
    },
    renderArray: (arr) => {
      if (Array.isArray(arr)) {
        return arr.join(', ');
      } else {
        return arr;
      }
    },
    renderPhoneNumber: (phoneNumber) => {
      return phoneNumber.toString().slice(0, 2) + '*****' + phoneNumber.toString().slice(-3);
    },
    renderCost: (cost) => {
      return cost.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      });
    }
  }


}));
//set view engine is handlebars 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

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
app.use(express.static(path.join(__dirname, 'public')));

const managerRouter = require('./routes/manager');
app.use(managerRouter);

const statisticRouter = require('./routes/statistic');
app.use(statisticRouter);

const userRouter = require('./routes/user');
app.use(userRouter);


const employeeRouter = require('./routes/employee');
app.use(employeeRouter);



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