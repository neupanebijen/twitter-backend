const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false
  },
  fullname: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    index: true, unique: true, sparse: true
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password should be atleast minimum of 6 characters"],
    validate(value) {
      if (value.length < 6) {
        throw new Error('Password should be atleast minimum of 6 characters');
      }
    },
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/douy56nkf/image/upload/v1594060920/defaults/txxeacnh3vanuhsemfc8.png",
  },
  bio: String,
  website: String,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: "User"}],
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },

  posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
  postCount: {
    type: Number,
    default: 0,
  },
  savedPosts: [{ type: mongoose.Schema.ObjectId, ref: "Post"}],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);