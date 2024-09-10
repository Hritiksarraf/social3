import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePhoto: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true,
  },
  collageName: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    default: [],
  },
  savedPosts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    default: [],
  },
  likedPosts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    default: [],
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pinsCount: {
    type: Number,  
    default: 100,
  },
  clerkId: {
    type: String,
    unique: true, 
    default: function() {
      return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
