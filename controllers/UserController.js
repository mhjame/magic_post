const User = require('../models/User');
const Post = require('../models/Post');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');



class UserController {


    searchPostInfo(req, res, next) {
    

        // Tìm kiếm người dùng theo ID
        User.findOne({ id: "123" }).lean()
            .then((user) => {
                // Nếu người dùng không tồn tại
                if (!user) {
                    res.status(404).send({ message: 'User not found' });
                    return;
                }

                // Lấy các ID của các post của người dùng
                const postIds = user.posts;

                let sStation, sWarehouse, rStation, rWarehouse;

                

                // Tạo một mảng trống để chứa các post
                const posts = [], route = [];


                // Lặp qua từng ID của post
                postIds.forEach((postId) => {
                    // Tìm kiếm post theo ID
                    Post.findOne({ id: postId }).lean()
                        .then((post) => {
                            // Nếu post không tồn tại
                            if (!post) {
                                return;
                            }

                            // Thêm post vào mảng posts
                            posts.push(post);

                            
                            
                        })
                        .catch((err) => {
                            // Xử lý lỗi
                            res.status(500).send({ message: err });
                            return;
                        });
                });

                // Render trang post_info
                res.render('post_info', {
                    posts: posts,
                   
                
                });
            })
            .catch(next);
    }
    
}

module.exports = new UserController;