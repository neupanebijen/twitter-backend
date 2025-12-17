const express = require('express')
const router = express.Router('/')
const asyncHandler = require('../middlewares/asyncHandler')
const {addPost, getUserPost, deletePost, searchByTag, editPost, getAllPost, likePost, unlikePost, retweet, unretweet, getLikedPosts} = require('../controllers/post')

router.get('/getAllPost', getAllPost)

router.post('/addPost', addPost)

router.post('/getUserPost', getUserPost)

router.delete('/deletePost', deletePost)

router.post('/searchByTag', searchByTag)

router.post('/editPost', editPost)

router.post('/likePost', likePost)

router.post('/unlikePost', unlikePost)

router.post('/retweet', retweet)

router.post('/unretweet', unretweet)

router.post('/getLikedPosts', getLikedPosts)

module.exports = router
