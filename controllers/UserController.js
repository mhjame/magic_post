const User = require('../models/User');
const Post = require('../models/Post');




class UserController {

    getPost(req, res, next) {
        Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (!post) {
              
              
             
                res.render('search_post', {
                    message: 'post not found',
                    previousValue: value
                });

            } else {

                res.render('search_post', {
                    post: post,
                    previousValue: value

                });
            }

        })
        .catch(next);
    }

    searchPost(req, res, next) {
        const value = req.query.searchValue;
        Post.findOne({ id: value }).lean()
            .then((post) => {
                if (!post) {
                  
                  
                 
                    res.render('search_post', {
                        message: 'post not found',
                        previousValue: value
                    });

                } else {

                    res.render('search_post', {
                        post: post,
                        previousValue: value

                    });
                }

            })
            .catch(next);
    }


    getPostInfo(req, res, next) {


        // Tìm kiếm người dùng theo ID
        User.findOne({_id: '65523b6b821170c9c1bc7a21'}).lean()
            .then((user) => {
                // Nếu người dùng không tồn tại
                if (!user) {
                    res.status(404).send({ message: 'User not found' });
                    return;
                }

                // Lấy các ID của các post của người dùng
                const postIds = user.posts;





                // Tạo một mảng trống để chứa các post
                const posts = [];


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
                    user: user,

                });
            })
            .catch(next);
    }

    userSearchPost(req, res, next) {
        res.render('user_search_post');
    }

}

module.exports = new UserController;