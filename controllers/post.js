const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const asyncHandler = require('../middlewares/asyncHandler')

exports.getAllPost = asyncHandler(async(req,res) => {
	const result = await Post.find({})

	res.status(200).json({result})
})

exports.addPost = asyncHandler(async(req,res,next) => {
	const {user, text, tag} = req.body;
	const userIdObject = mongoose.Types.ObjectId(user)
	const postResult = await Post.create({
		user: userIdObject,
		text: text,
		tag: tag
	})

	const postId = mongoose.Types.ObjectId(postResult._id)
	
	const conditionUser = {
		_id: userIdObject
	}

	const updateUser = {
		$push: {
			posts: postId
		},
		$inc: {
			postCount: 1
		}
	}

	const userResult = await User.update(conditionUser, updateUser)

	res.status(200).json({success: true})
})

exports.getUserPost = asyncHandler(async(req,res) => {
	const {user} = req.body
	const post = await Post.find({user: mongoose.Types.ObjectId(user)}).sort({createdAt: -1}).populate('user')

	res.status(200).json({success:true, data: post})
})

exports.deletePost = asyncHandler(async(req,res) => {
	const {postId} = req.body
	const postIdObject = mongoose.Types.ObjectId(postId)
	const postResult = await Post.remove({_id: postIdObject})

	res.status(200).json({success : true})
})

exports.searchByTag = asyncHandler(async(req,res) => {
	const {tag} = req.body
	const result = await Post.find({tag: tag}).sort({createdAt: -1}).populate('user')

	res.status(200).json({success: true, data: result})
})

exports.editPost = asyncHandler(async(req,res) => {
	const {postId, editText, editTag} = req.body

	const postIdObject = mongoose.Types.ObjectId(postId)

	const condition ={
		_id : postIdObject
	}

	const update = {
		$set: {
			text: editText,
			tag: editTag
		}
	}

	const result = await Post.update(condition, update)

	res.status(200).json({success: "true"})
})

exports.likePost = asyncHandler(async(req,res) => {
	const {postId, userId} = req.body

	const postIdObject = mongoose.Types.ObjectId(postId)
	const userIdObject = mongoose.Types.ObjectId(userId)

	const condition = {
		_id: postIdObject,
		likes: {
			$ne: userIdObject
		}
	}

	const update = {
		$push:{
			likes: userIdObject
		},
		$inc:{
			likeCount: 1
		}
	}

	const result = await Post.update(condition, update)

	res.status(200).json({success: true})
})

exports.unlikePost = asyncHandler(async(req,res) => {
	const {postId, userId} = req.body

	const postIdObject = mongoose.Types.ObjectId(postId)
	const userIdObject = mongoose.Types.ObjectId(userId)

	const condition = {
		_id: postIdObject,
		likes: userIdObject
	}

	const update = {
		$pull: {
			likes: userIdObject
		},
		$inc: {
			likeCount: -1
		}
	}

	const result = await Post.update(condition, update)

	res.status(200).json({success: true})
})

exports.retweet = asyncHandler(async(req,res) => {
	const {userId, postId} = req.body

	const userIdObject = mongoose.Types.ObjectId(userId)
	const postIdObject = mongoose.Types.ObjectId(postId)

	const condition = {
		_id: postId,
		retweets: {
			$ne: userIdObject
		}
	}
	const update = {
		$push: {
			retweets: userIdObject
		},
		$inc : {
			retweetCount: 1
		}
	}

	const result = await Post.update(condition, update)

	res.status(200).json({success: true})
})

exports.unretweet = asyncHandler(async(req,res) => {
	const {userId, postId} = req.body
	console.log('this called')

	const userIdObject = mongoose.Types.ObjectId(userId)
	const postIdObject = mongoose.Types.ObjectId(postId)

	const condition = {
		_id: postId,
		retweets: userIdObject
	}

	const update = {
		$pull: {
			retweets: userIdObject
		},
		$inc : {
			retweetCount: -1
		}
	}

	const result = await Post.update(condition, update)

	res.status(200).json({success: true})
})

exports.getLikedPosts = asyncHandler(async(req,res) => {
	const {userId} = req.body
	const userIdObject = mongoose.Types.ObjectId(userId)

	const result = await Post.find({likes: userIdObject}).populate('user')

	res.status(200).json({success: true, data: result})
})
