const express = require('express')

const router = express.Router()

const {login, signup, savePost, getSavedPosts, followUser, unfollowUser, feedPosts, searchUser, getFollowers, getFollowing, getUserData} = require('../controllers/user')

router.post('/login', login)

router.post('/signup', signup)

router.post('/getUserData', getUserData)

router.post('/savePost', savePost)

router.post('/getSavedPosts', getSavedPosts)

router.post('/followUser', followUser)

router.post('/unfollowUser', unfollowUser)

router.post('/feedPosts', feedPosts)

router.post('/searchUser', searchUser)

router.post('/getFollowers', getFollowers)

router.post('/getFollowing', getFollowing)

module.exports = router