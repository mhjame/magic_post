const User = require('../models/User');
const Post = require('../models/Post');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');




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

                    Station.findOne({ stationCode: post.senderStationCode }).lean()
                        .then((senderStation) => {
                            Station.findOne({ stationCode: post.receiverStationCode }).lean()
                                .then((receiverStation) => {
                                    Warehouse.findOne({ warehouseCode: post.senderWarehouseCode }).lean()
                                        .then((senderWarehouse) => {
                                            Warehouse.findOne({ warehouseCode: post.receiverWarehouseCode }).lean()
                                                .then((receiverWarehouse) => {
                                                    res.render('search_post', {
                                                        post: post,
                                                        previousValue: value,
                                                        senderStation,
                                                        senderWarehouse,
                                                        receiverStation,
                                                        receiverWarehouse,
                                                        noHeader: 'yes'
                                                    });
                                                })
                                        })
                                })
                        })
                }

            })
            .catch(next);
    }

    searchPost(req, res, next) {
        const value = req.query.searchValue;
        const ObjectId = require('mongoose').Types.ObjectId;
        if (!ObjectId.isValid(value)) {
            res.render('search_post', {
                message: 'post not found',
                previousValue: value,
                noHeader: 'yes'
            });
            return;
        }

        Post.findOne({ _id: value }).lean()
            .then((post) => {
                if (!post) {
                    res.render('search_post', {
                        message: 'post not found',
                        previousValue: value,
                        noHeader: 'yes'
                    });

                } else {
                    Station.findOne({ stationCode: post.senderStationCode }).lean()
                        .then((senderStation) => {
                            Station.findOne({ stationCode: post.receiverStationCode }).lean()
                                .then((receiverStation) => {
                                    Warehouse.findOne({ warehouseCode: post.senderWarehouseCode }).lean()
                                        .then((senderWarehouse) => {
                                            Warehouse.findOne({ warehouseCode: post.receiverWarehouseCode }).lean()
                                                .then((receiverWarehouse) => {
                                                    res.render('search_post', {
                                                        post: post,
                                                        previousValue: value,
                                                        senderStation,
                                                        senderWarehouse,
                                                        receiverStation,
                                                        receiverWarehouse,
                                                        noHeader: 'yes'
                                                    });
                                                })
                                        })
                                })
                        })

                }

            })
            .catch(next);


    }


    getPostInfo(req, res, next) {


        // Tìm kiếm người dùng theo ID
        User.findOne({ _id: '65523b6b821170c9c1bc7a21' }).lean()
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
                const postRoutine = {};


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
                            const routine = {};
                            Station.findOne({ id: post.senderStationId }).lean().then((senderStation) => {
                                routine['senderStation'] = senderStation;
                            })
                            Warehouse.findOne({ id: post.senderWarehouseId }).lean().then((senderWarehouse) => {
                                routine['senderWarehouse'] = senderWarehouse;
                            })
                            Warehouse.findOne({ id: post.receiverWarehouseId }).lean().then((receiverWarehouse) => {
                                routine['receiverWarehouse'] = receiverWarehouse;
                            })
                            Station.findOne({ id: post.receiverStationId }).lean().then((receiverStation) => {
                                routine['receiverStation'] = receiverStation;
                            })
                            postRoutine[post.id] = routine;

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
                    postRoutine
                });
            })
            .catch(next);
    }

    userSearchPost(req, res, next) {
        res.render('user_search_post', {
            noHeader: 'yes'
        });
    }

}

module.exports = new UserController;