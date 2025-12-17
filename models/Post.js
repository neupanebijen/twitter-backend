const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    tag: {
        type: [String]
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    commentCount: {
        type: Number,
        default: 0
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    retweets: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    likeCount: {
        type: Number,
        default: 0
    },
    retweetCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema)