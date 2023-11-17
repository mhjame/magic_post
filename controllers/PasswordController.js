const User = require('../models/User');
const Employee = require('../models/Employee')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

class PasswordController {

    getForgotPassword(req, res) {
        res.render('forgotPassword');
    }

    postForgotPassword(req, res) {
        const { email } = req.body;

        Employee.findOne({ email: email })
            .then((employee) => {
                if (!employee) {
                    return res.status(404).send('User not found');
                  }
                
                  console.log("Có user")
                  console.log(email)
                  // Generate a unique token using crypto
                  const token = crypto.randomBytes(20).toString('hex');
                  employee.resetToken = token;
                  employee.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
                
                  employee.save();
                  console.log(employee)
                  // Configure Nodemailer
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'nnl251203@gmail.com', // replace with your Gmail email
                      pass: 'qrze yrez zqjg yxkh', // replace with your Gmail password
                    },
                  });
                
                  // Create the email message
                  const mailOptions = {
                    from: 'nnl251203@gmail.com',
                    to: email,
                    subject: 'Password Reset',
                    html: `
                      <p>You requested a password reset</p>
                      <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
                    `,
                  };
                console.log("Create the email message DONE")

                  // Send the email
                  transporter.sendMail(mailOptions)
                    .then((info) => {
                        console.log('Email sent:', info.response);
                        res.status(200).send('Email sent successfully');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error sending email');
                    });
            });
      
       
    }

    getResetPassword(req, res) {
          // Lấy token từ đường dẫn
        const token = req.params.token;
        console.log("getreset"+token)

        // Tìm người dùng với token tương ứng và kiểm tra xem token có hiệu lực không
        // const employee = Employee.find((employee) => employee.resetToken === token && employee.resetTokenExpiration > Date.now());

        Employee.findOne({ resetToken: token })
            .then(employee => {
            
                if (!employee) {
                    return res.status(401).send('Invalid or expired token');
                }

                console.log("getreset2" + (employee.resetToken || 'No resetToken found'));
        
                console.log(employee)
                // Hiển thị form để người dùng đặt lại mật khẩu
                res.render('resetPassword', {
                  token: token
                });
            })
      
        
    }

    postResetPassword(req, res) {
          // Lấy token và password từ request
        const { token, password } = req.body;

        // Tìm người dùng với token tương ứng và kiểm tra xem token có hiệu lực không
        // const employee = Employee.find((employee) => employee.resetToken === token && employee.resetTokenExpiration > Date.now());

        Employee.findOne( { resetToken: token } )
            .then(employee => {
                if (!employee) {
                    return res.status(401).send('Invalid or expired token');
                }
        
                // Cập nhật mật khẩu mới và xóa resetToken
                employee.password = password;
                employee.resetToken = undefined;
                employee.resetTokenExpiration = undefined;

                employee.save();
        
                res.status(200).send('Password reset successfully');

            })

    }

}
module.exports = new PasswordController;