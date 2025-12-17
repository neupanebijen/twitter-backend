const mongoose = require('mongoose')
const asyncHandler = require('../middlewares/asyncHandler')
const User = require('../models/User')
const Post = require('../models/Post')

exports.signup = asyncHandler(async (req,res) => {
	const {username, email, password} = req.body
	const result = await User.create({
		username: username, 
		email: email,
		password: password
	})

	res.json({success: true})
})

exports.login = asyncHandler(async (req,res) => {
	const {username,password} = req.body

	const result = await User.find({
		username: username
	})

	if(result[0].password === password.toString()){
		res.json({success:true, data: result[0]})
	} else{
		res.json({success:false, info: "Usename Password donot match"})
	}
})

exports.getUserData = asyncHandler(async (req,res) => {
	const {userId} = req.body

	const result = await User.findOne({
		_id: userId
	}).select({password: 0})

	res.status(200).json({success: true, data: result})
})

exports.savePost = asyncHandler(async(req,res) => {
	const{userId, postId} = req.body
	const userIdObject = mongoose.Types.ObjectId(userId)
	const postIdObject = mongoose.Types.ObjectId(postId)

	const condition = {
		_id: userIdObject	
	}

	const update = {
		$push: {savedPosts: postIdObject}
	}

	const result = await User.update(condition, update)
	res.status(200).json({success: true})
})

exports.getSavedPosts = asyncHandler(async(req,res) => {
	const {userId} = req.body

	const result = await User.findOne({_id: mongoose.Types.ObjectId(userId)}).populate({
		path:'savedPosts',
		populate:{
			path:'user'
		}
	})

	res.status(200).json({success:true, data: result})
})

exports.followUser = asyncHandler(async(req,res) => {
	const {userId, targetUserId} = req.body

	// User following themself
	if(userId ===  targetUserId) {
		res.status(200).json({success:false, message:'Cannot follow own account'}) 
	}

	const userIdObject = mongoose.Types.ObjectId(userId)
	const targetUserIdObject = mongoose.Types.ObjectId(targetUserId)

	const userCondition = {
		_id: userIdObject,
		following: {
			$ne: targetUserIdObject
		}
	}

	const targetCondition = {
		_id: targetUserIdObject,
		followers: {
			$ne: userIdObject
		}
	}

	const userUpdate = {
		$push: {
			following: targetUserIdObject
		},
		$inc : {
			followingCount: 1
		}
	}

	const targetUpdate = {
		$push: {
			followers: userIdObject
		}, 
		$inc: {
			followersCount: 1
		}
	}

	const resultUser = await User.update(userCondition, userUpdate)
	const resultTarget = await User.update(targetCondition, targetUpdate)

	res.status(200).json({success: true, data: resultUser})
})

exports.unfollowUser = asyncHandler(async(req,res) => {
	const {userId, targetUserId} = req.body

	const userIdObject = mongoose.Types.ObjectId(userId)
	const targetUserIdObject = mongoose.Types.ObjectId(targetUserId)

	const userCondition = {
		_id: userIdObject,
		following: {
			$eq: targetUserIdObject
		}
	}

	const targetCondition = {
		_id: targetUserIdObject,
		followers:{
			$eq: userIdObject
		}
	}

	const userUpdate = {
		$pull: {
			following: targetUserIdObject
		},
		$inc : {
			followingCount: -1
		}
	}
	const targetUpdate = {
		$pull: {
			followers: userIdObject
		}, 
		$inc: {
			followersCount: -1
		}
	}

	const resultUser = await User.update(userCondition, userUpdate)
	const resultTarget = await User.update(targetCondition, targetUpdate)

	console.log('UserResult : ', resultUser)
	console.log('TargetResult : ', resultTarget)
	res.status(200).json({success: true, data: resultUser})
})

exports.feedPosts = asyncHandler(async(req,res) => {
	const {userId} = req.body

	const userIdObject = mongoose.Types.ObjectId(userId)

	const condition = {
		_id: userIdObject
	}
	
	const userPosts = await User.findOne(condition).select({fullname: 1, username: 1, avatar: 1, posts: 1}).populate('posts')
	const userFollowings = await User.findOne(condition).select({fullname: 1, username: 1, following: 1}).populate({ 
		path: 'following',
		populate: {
			path: 'posts',
			limit: 5,
			sort: {createdAt: -1}
		}, 
		select: 'username fullname avatar posts',
	})

	const userPostList = userPosts.posts.map(post => {
		const newPost = {
			avatar: userPosts.avatar, 
			username: userPosts.username, 
			_id: userPosts._id,
			post
		}
		return newPost	
	})

	const followings = userFollowings.following
	let followingPostList = []

	followings.forEach(target => {
		target.posts.forEach(post => {
			const newPost = {
				avatar: target.avatar, 
				username: target.username, 
				_id: target._id,
				post
			}
			followingPostList.push(newPost)
		})
	})

	allPosts = userPostList
	allPosts.push(...followingPostList)
	allPosts.sort((i,j) => {
		const iDate = new Date(i.post.createdAt)
		const jDate = new Date(j.post.createdAt)

		return jDate - iDate
	})
	res.status(200).json({success: true, data: allPosts})
})

exports.searchUser = asyncHandler(async(req,res) => {
	const {username} = req.body
	const result = await User.find({username: username}).select({email: 0, password: 0})

	res.status(200).json({success: true, data: result})
})

exports.getFollowers = asyncHandler(async(req,res) => {
	const {userId} = req.body
	const userIdObject = mongoose.Types.ObjectId(userId)

	const result = await User.findOne({_id: userId}).populate('followers')

	res.status(200).json({success:true, data: result})
})

exports.getFollowing = asyncHandler(async(req,res) => {
	const {userId} = req.body
	const userIdObject = mongoose.Types.ObjectId(userId)

	const result = await User.findOne({_id: userId}).populate('following')

	res.status(200).json({success:true, data: result})
})

