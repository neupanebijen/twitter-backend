const asyncHandler = require('../middlewares/asyncHandler')
const Post = require('../models/Post')
const UserId = require('../models/User')
const Comment = require('../models/Comment')
const mongoose = require('mongoose')

exports.addComment = asyncHandler(async (req,res) => {
	const {commentText, postId, userId} = req.body
	const postIdObject = mongoose.Types.ObjectId(postId)

	const result = Comment.create({
		user: mongoose.Types.ObjectId(userId),
		post : postId,
		text: commentText
	})

	const postCondition = {
		_id: postIdObject
	}

	const postUpdate = {
		$inc: {
			commentCount: 1
		}
	}

	const postResult = await Post.update(postCondition, postUpdate)

	res.status(200).json({success: true, data: result, })
})

exports.getComments = asyncHandler(async (req,res) => {
	const {postId} = req.body
	const postIdObject =  mongoose.Types.ObjectId(postId)

	const result = await Comment.find({post: postIdObject}).populate('user').sort({createdAt: -1})

	res.status(200).json({success: true, data: result}) 
})

exports.deleteComment = asyncHandler(async(req,res) => {
	const {commentId, postId} = req.body
	const commentIdObject = mongoose.Types.ObjectId(commentId)
	const postIdObject = mongoose.Types.ObjectId(postId)

	const postCondition = {
		_id: postIdObject
	}
	const postUpdate = {
		$inc: {
			commentCount: -1
		}
	}

	const postResult = await Post.update(postCondition, postUpdate)

	const result = await Comment.remove({_id: commentIdObject})
	res.status(200).json({success: true})
})